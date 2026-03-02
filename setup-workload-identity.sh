#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="kien-terraform-playground"
PROJECT_NUMBER="7102516370"
REPO="wongun78/quiz-app-v2"

POOL_NAME="github-pool"
PROVIDER_NAME="github-provider"
SA_NAME="quiz-run-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${CYAN}▶ $1${NC}"; }
success() { echo -e "${GREEN}✓ $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $1${NC}"; }

echo "WIF setup: $PROJECT_ID | $REPO"

info "Workload Identity Pool"
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

info "OIDC Provider"
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

info "SA ← WIF binding"
WIF_MEMBER="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${REPO}"

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="$WIF_MEMBER"
success "$SA_EMAIL ← $WIF_MEMBER"

info "IAM roles"
for ROLE in "roles/artifactregistry.writer" "roles/run.developer" "roles/iam.serviceAccountUser" "roles/redis.viewer"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --condition=None \
    --quiet 2>/dev/null || true
  success "$ROLE"
done

WIF_PROVIDER_FULL="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"

echo ""
echo "GitHub Secrets (Settings → Secrets → Actions):"
echo "  GCP_PROJECT_ID      = ${PROJECT_ID}"
echo "  WIF_PROVIDER        = ${WIF_PROVIDER_FULL}"
echo "  WIF_SERVICE_ACCOUNT = ${SA_EMAIL}"
