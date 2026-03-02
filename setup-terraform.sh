#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="kien-terraform-playground"
REGION="asia-southeast1"
STATE_BUCKET="${PROJECT_ID}-tfstate"
SA_EMAIL="quiz-run-sa@${PROJECT_ID}.iam.gserviceaccount.com"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${CYAN}▶ $1${NC}"; }
success() { echo -e "${GREEN}✓ $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $1${NC}"; }

echo "Terraform setup: $PROJECT_ID"

info "GCS state bucket"
if gcloud storage buckets describe "gs://${STATE_BUCKET}" &>/dev/null; then
  warn "Bucket đã tồn tại: gs://${STATE_BUCKET}"
else
  gcloud storage buckets create "gs://${STATE_BUCKET}" \
    --location="$REGION" \
    --uniform-bucket-level-access
  success "Bucket tạo xong: gs://${STATE_BUCKET}"
fi

gcloud storage buckets update "gs://${STATE_BUCKET}" --versioning
success "Versioning enabled: gs://${STATE_BUCKET}"

info "SA → state bucket IAM"
gcloud storage buckets add-iam-policy-binding "gs://${STATE_BUCKET}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin"

success "SA có thể read/write state bucket"

info "IAM roles for Terraform SA"
TERRAFORM_ROLES=(
  "roles/storage.objectAdmin"
  "roles/vpcaccess.admin"
  "roles/compute.networkAdmin"
  "roles/compute.securityAdmin"
  "roles/servicenetworking.networksAdmin"
  "roles/cloudsql.admin"
  "roles/redis.admin"
  "roles/artifactregistry.admin"
  "roles/secretmanager.admin"
  "roles/iam.serviceAccountAdmin"
  "roles/iam.workloadIdentityPoolAdmin"
  "roles/serviceusage.serviceUsageAdmin"
  "roles/resourcemanager.projectIamAdmin"
)

for ROLE in "${TERRAFORM_ROLES[@]}"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$ROLE" \
    --condition=None \
    --quiet 2>/dev/null || true
  success "$ROLE"
done

echo ""
echo "Done. Next:"
echo "  cd terraform/ && terraform init"
echo "  ./import.sh"
echo "  terraform plan -var-file=environments/dev/terraform.tfvars"
