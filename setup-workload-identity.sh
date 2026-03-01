#!/usr/bin/env bash
# =============================================================================
# setup-workload-identity.sh — Thiết lập Workload Identity Federation
#
# Mục đích: Cho phép GitHub Actions xác thực với GCP mà KHÔNG cần service
#           account key (JSON file). An toàn hơn nhiều vì không có secret nào
#           bị lưu vĩnh viễn — thay vào đó dùng OIDC token tạm thời.
#
# Cách hoạt động (Workload Identity Federation):
#   1. GitHub Actions tạo một OIDC token (JWT) chứng minh "tôi là workflow
#      trong repo X, chạy trên branch Y"
#   2. GCP kiểm tra token với GitHub's OIDC endpoint
#   3. Nếu hợp lệ, GCP cấp phép cho Service Account → không cần key!
#
# Chạy một lần duy nhất:
#   chmod +x setup-workload-identity.sh
#   ./setup-workload-identity.sh
# =============================================================================

set -euo pipefail

# =============================================================================
# CẤU HÌNH
# =============================================================================
PROJECT_ID="kien-terraform-playground"
PROJECT_NUMBER="7102516370"
REPO="wongun78/quiz-app-v2"    # GitHub repo: owner/repo-name
REGION="asia-southeast1"

# Tên resources WIF
POOL_NAME="github-pool"
PROVIDER_NAME="github-provider"
SA_NAME="quiz-run-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# =============================================================================
# Màu sắc cho output
# =============================================================================
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${CYAN}▶ $1${NC}"; }
success() { echo -e "${GREEN}✓ $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $1${NC}"; }

echo ""
echo "============================================"
echo "  Phase 3: Workload Identity Federation"
echo "  Project: $PROJECT_ID"
echo "  GitHub Repo: $REPO"
echo "============================================"
echo ""

# =============================================================================
# Bước 1: Tạo Workload Identity Pool
# =============================================================================
# Pool = "vùng tin cậy" chứa các Identity Providers bên ngoài GCP
# Mỗi project nên có 1 pool cho CI/CD
info "Bước 1: Tạo Workload Identity Pool"
if gcloud iam workload-identity-pools describe "$POOL_NAME" \
    --location="global" \
    --project="$PROJECT_ID" &>/dev/null; then
  warn "Pool '$POOL_NAME' đã tồn tại, bỏ qua"
else
  gcloud iam workload-identity-pools create "$POOL_NAME" \
    --location="global" \
    --project="$PROJECT_ID" \
    --display-name="GitHub Actions Pool" \
    --description="Workload Identity Pool for GitHub Actions CI/CD"
  success "Pool tạo xong: $POOL_NAME"
fi

# =============================================================================
# Bước 2: Tạo OIDC Provider trong Pool
# =============================================================================
# Provider = cấu hình cụ thể cho GitHub OIDC
# --issuer-uri: GitHub's OIDC discovery URL (chuẩn RFC 8414)
# --attribute-mapping: map claim từ GitHub JWT sang Google attribute:
#   - google.subject     ← sub        (globally unique ID của workflow)
#   - attribute.actor    ← actor_id   (người trigger workflow)
#   - attribute.aud      ← aud        (audience = repo URL)
#   - attribute.repository ← repository (tên repo để restrict access)
# --attribute-condition: CHỈ cho phép token từ repo cụ thể này
#   Không có dòng này → bất kỳ GitHub repo nào cũng có thể impersonate SA!
info "Bước 2: Tạo OIDC Provider"
if gcloud iam workload-identity-pools providers describe "$PROVIDER_NAME" \
    --location="global" \
    --workload-identity-pool="$POOL_NAME" \
    --project="$PROJECT_ID" &>/dev/null; then
  warn "Provider '$PROVIDER_NAME' đã tồn tại, bỏ qua"
else
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
    --location="global" \
    --project="$PROJECT_ID" \
    --workload-identity-pool="$POOL_NAME" \
    --display-name="GitHub Provider" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="assertion.repository=='${REPO}'"
  success "Provider tạo xong: $PROVIDER_NAME"
fi

# =============================================================================
# Bước 3: Cấp quyền SA impersonation cho GitHub Actions
# =============================================================================
# Binding này nói: "workflow từ repo $REPO được phép impersonate SA này"
# principalSet://: dùng vì có nhiều workflow trong 1 repo
# Nếu dùng principal:// → chỉ 1 workflow cụ thể
info "Bước 3: Bind Service Account với Workload Identity"
WIF_MEMBER="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${REPO}"

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="$WIF_MEMBER"
success "IAM binding done: $SA_EMAIL ← $WIF_MEMBER"

# =============================================================================
# Bước 4: Đảm bảo SA có đủ roles cho CI/CD
# =============================================================================
# Ngoài các roles đã có từ Phase 2 (secretAccessor, cloudsql.client),
# CI/CD còn cần:
#   - artifactregistry.writer: push Docker images
#   - run.developer: deploy Cloud Run services
#   - iam.serviceAccountUser: deploy-as SA (Cloud Run cần permission này)
info "Bước 4: Cấp thêm roles cho SA (CI/CD needs)"
for ROLE in "roles/artifactregistry.writer" "roles/run.developer" "roles/iam.serviceAccountUser"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --condition=None \
    --quiet 2>/dev/null | grep -E "role:|serviceAccount" || true
  success "Đã cấp: $ROLE → $SA_EMAIL"
done

# =============================================================================
# Bước 5: In ra thông tin cần add vào GitHub Secrets
# =============================================================================
WIF_PROVIDER_FULL="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"

echo ""
echo "============================================"
echo "  DONE! Add các secrets sau vào GitHub:"
echo "  Repo → Settings → Secrets → Actions"
echo "============================================"
echo ""
echo "  Secret Name              | Value"
echo "  -------------------------|-------------------------------------------"
echo "  GCP_PROJECT_ID           | ${PROJECT_ID}"
echo "  WIF_PROVIDER             | ${WIF_PROVIDER_FULL}"
echo "  WIF_SERVICE_ACCOUNT      | ${SA_EMAIL}"
echo ""
echo "  ⚠ CHỈ 3 secrets này — không cần key JSON, không cần password!"
echo ""
echo "  Sau khi add secrets, push code lên GitHub để trigger CI/CD."
echo ""
