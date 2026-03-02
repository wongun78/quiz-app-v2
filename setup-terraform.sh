#!/usr/bin/env bash
# =============================================================================
# setup-terraform.sh — Chuẩn bị hạ tầng cho Terraform (chạy 1 lần)
#
# Terraform cần:
# 1. GCS bucket để lưu state (phải tạo TRƯỚC `terraform init`)
# 2. SA quiz-run-sa cần thêm quyền để Terraform quản lý GCP resources
#
# Chạy 1 lần từ local machine (cần gcloud auth):
#   chmod +x setup-terraform.sh
#   ./setup-terraform.sh
# =============================================================================

set -euo pipefail

PROJECT_ID="kien-terraform-playground"
REGION="asia-southeast1"
STATE_BUCKET="${PROJECT_ID}-tfstate"
SA_EMAIL="quiz-run-sa@${PROJECT_ID}.iam.gserviceaccount.com"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${CYAN}▶ $1${NC}"; }
success() { echo -e "${GREEN}✓ $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $1${NC}"; }

echo ""
echo "============================================"
echo "  Phase 4: Terraform Setup"
echo "  Project: $PROJECT_ID"
echo "============================================"
echo ""

# =============================================================================
# Bước 1: Tạo GCS bucket cho Terraform state
# =============================================================================
info "Bước 1: Tạo GCS state bucket"

# Tại sao cần bucket riêng?
# → Terraform state là "database" lưu trạng thái hiện tại của infra
# → Remote state = team members và CI/CD share cùng state
# → Versioning = có thể rollback state nếu bị corrupt

if gcloud storage buckets describe "gs://${STATE_BUCKET}" &>/dev/null; then
  warn "Bucket đã tồn tại: gs://${STATE_BUCKET}"
else
  gcloud storage buckets create "gs://${STATE_BUCKET}" \
    --location="$REGION" \
    --uniform-bucket-level-access
  success "Bucket tạo xong: gs://${STATE_BUCKET}"
fi

# Bật versioning — để có thể rollback state
gcloud storage buckets update "gs://${STATE_BUCKET}" --versioning
success "Versioning enabled trên gs://${STATE_BUCKET}"

# =============================================================================
# Bước 2: Cấp quyền cho SA quiz-run-sa quản lý state
# =============================================================================
info "Bước 2: Cấp quyền cho SA đọc/ghi state bucket"

# Terraform cần đọc và ghi state file trong bucket
gcloud storage buckets add-iam-policy-binding "gs://${STATE_BUCKET}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin"

success "SA có thể read/write state bucket"

# =============================================================================
# Bước 3: Cấp quyền cho SA để Terraform quản lý GCP resources
# =============================================================================
info "Bước 3: Cấp thêm roles cho Terraform SA"

# Terraform cần tạo/xóa/update GCP resources → cần quyền rộng hơn CI/CD
# Lưu ý: trong production nên tạo terraform-sa riêng biệt với quiz-run-sa
# nhưng cho learning purposes, dùng chung 1 SA

TERRAFORM_ROLES=(
  "roles/storage.objectAdmin"           # Quản lý state bucket
  "roles/vpcaccess.admin"               # Tạo VPC Connector
  "roles/compute.networkAdmin"          # Tạo VPC, Firewall
  "roles/servicenetworking.networksAdmin" # Private service connection
  "roles/cloudsql.admin"               # Tạo/xóa Cloud SQL
  "roles/redis.admin"                  # Tạo/xóa Redis
  "roles/secretmanager.admin"          # Tạo/xóa secrets
  "roles/iam.serviceAccountAdmin"      # Tạo/xóa Service Accounts
  "roles/iam.workloadIdentityPoolAdmin" # Tạo WIF pool/provider
  "roles/serviceusage.serviceUsageAdmin" # Enable/disable APIs
)

for ROLE in "${TERRAFORM_ROLES[@]}"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --condition=None \
    --quiet 2>/dev/null | grep -E "role:|etag" || true
  success "Đã cấp: $ROLE"
done

# =============================================================================
# DONE
# =============================================================================
echo ""
echo "============================================"
echo "  DONE! Tiếp theo:"
echo ""
echo "  1. Copy và điền terraform.tfvars:"
echo "     cd terraform/"
echo "     cp terraform.tfvars.example terraform.tfvars"
echo "     # Điền passwords thật vào terraform.tfvars"
echo ""
echo "  2. Khởi tạo Terraform (kết nối GCS backend):"
echo "     terraform init"
echo ""
echo "  3. Import resources đã tồn tại:"
echo "     chmod +x import.sh && ./import.sh"
echo ""
echo "  4. Xem sẽ thay đổi gì:"
echo "     terraform plan -var-file=environments/dev/terraform.tfvars"
echo ""
echo "  5. GitHub Secrets cần thêm:"
echo "     TF_VAR_DB_PASSWORD    = (db password)"
echo "     TF_VAR_JWT_SECRET     = (jwt secret)"
echo "     TF_VAR_ADMIN_PASSWORD = (admin password)"
echo "     TF_VAR_USER_PASSWORD  = (user password)"
echo "============================================"
