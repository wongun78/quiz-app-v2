#!/usr/bin/env bash
# =============================================================================
# import.sh — Import các GCP resources đã tồn tại vào Terraform state
#
# Khi nào dùng?
# → Bạn đã tạo resources tay (qua deploy.sh hoặc GCP Console)
# → Giờ muốn Terraform quản lý chúng
# → Chạy script này để "đưa" chúng vào Terraform state
#
# Sau khi import:
# → `terraform plan` sẽ không thấy changes (resources đã sync)
# → Từ đây trở đi, Terraform là source of truth
#
# CHẠY TỪ THƯ MỤC terraform/:
#   cd terraform/
#   ./import.sh
# =============================================================================

set -euo pipefail

# Phải chạy từ trong terraform/ directory
cd "$(dirname "$0")"

PROJECT_ID="kien-terraform-playground"
PROJECT_NUMBER="7102516370"
REGION="asia-southeast1"
APP="quiz"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${CYAN}▶ $1${NC}"; }
success() { echo -e "${GREEN}✓ $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $1${NC}"; }
error()   { echo -e "${RED}✗ $1${NC}"; }

# Helper: import với skip nếu đã trong state
tf_import() {
  local resource="$1"
  local id="$2"
  if terraform state show "$resource" &>/dev/null; then
    warn "Đã trong state: $resource — bỏ qua"
  else
    info "Import: $resource"
    terraform import "$resource" "$id" && success "Import OK: $resource"
  fi
}

echo ""
echo "============================================"
echo "  Terraform Import — Quiz App GCP Resources"
echo "  Project: $PROJECT_ID"
echo "============================================"
echo ""

# Bước 0: Đảm bảo terraform init đã chạy
if [[ ! -d ".terraform" ]]; then
  info "Chạy terraform init trước..."
  terraform init
fi

# =============================================================================
# 1. GCP APIs (google_project_service)
# =============================================================================
info "=== 1. APIs ==="
for API in \
  "run.googleapis.com" \
  "sqladmin.googleapis.com" \
  "redis.googleapis.com" \
  "artifactregistry.googleapis.com" \
  "vpcaccess.googleapis.com" \
  "secretmanager.googleapis.com" \
  "servicenetworking.googleapis.com" \
  "cloudresourcemanager.googleapis.com" \
  "iam.googleapis.com" \
  "iamcredentials.googleapis.com"
do
  tf_import "google_project_service.apis[\"${API}\"]" \
    "${PROJECT_ID}/services/${API}"
done

# =============================================================================
# 2. Artifact Registry
# =============================================================================
info "=== 2. Artifact Registry ==="
tf_import "module.artifact_registry.google_artifact_registry_repository.repo" \
  "projects/${PROJECT_ID}/locations/${REGION}/repositories/${APP}-repo"

# =============================================================================
# 3. Networking
# =============================================================================
info "=== 3. Networking ==="

tf_import "module.networking.google_compute_network.vpc" \
  "projects/${PROJECT_ID}/global/networks/${APP}-vpc"

tf_import "module.networking.google_vpc_access_connector.connector" \
  "projects/${PROJECT_ID}/locations/${REGION}/connectors/${APP}-connector"

tf_import "module.networking.google_compute_global_address.private_service_range" \
  "projects/${PROJECT_ID}/global/addresses/google-managed-services-${APP}-vpc"

tf_import "module.networking.google_service_networking_connection.private_vpc_connection" \
  "projects/${PROJECT_ID}/global/networks/${APP}-vpc:servicenetworking.googleapis.com"

tf_import "module.networking.google_compute_firewall.allow_connector_to_services" \
  "projects/${PROJECT_ID}/global/firewalls/allow-connector-to-services"

# =============================================================================
# 4. IAM
# =============================================================================
info "=== 4. IAM ==="

SA_EMAIL="${APP}-run-sa@${PROJECT_ID}.iam.gserviceaccount.com"

tf_import "module.iam.google_service_account.run_sa" \
  "projects/${PROJECT_ID}/serviceAccounts/${SA_EMAIL}"

for ROLE in \
  "roles/cloudsql.client" \
  "roles/redis.viewer" \
  "roles/artifactregistry.writer" \
  "roles/run.developer" \
  "roles/iam.serviceAccountUser"
do
  tf_import "module.iam.google_project_iam_member.run_sa_roles[\"${ROLE}\"]" \
    "${PROJECT_ID} ${ROLE} serviceAccount:${SA_EMAIL}"
done

tf_import "module.iam.google_iam_workload_identity_pool.github_pool" \
  "projects/${PROJECT_ID}/locations/global/workloadIdentityPools/github-pool"

tf_import "module.iam.google_iam_workload_identity_pool_provider.github_provider" \
  "projects/${PROJECT_ID}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"

WIF_MEMBER="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/wongun78/quiz-app-v2"
tf_import "module.iam.google_service_account_iam_member.wif_binding" \
  "projects/${PROJECT_ID}/serviceAccounts/${SA_EMAIL} roles/iam.workloadIdentityUser ${WIF_MEMBER}"

# =============================================================================
# 5. Database
# =============================================================================
info "=== 5. Cloud SQL ==="

tf_import "module.database.google_sql_database_instance.main" \
  "${PROJECT_ID}/${APP}-db"

tf_import "module.database.google_sql_database.db" \
  "${PROJECT_ID}/${APP}-db/${APP}_db"

# postgres user: format = project/instance/host/user (host = "" for built-in user)
tf_import "module.database.google_sql_user.postgres" \
  "${PROJECT_ID}/${APP}-db//postgres"

# =============================================================================
# 6. Redis
# =============================================================================
info "=== 6. Redis ==="

tf_import "module.redis.google_redis_instance.cache" \
  "projects/${PROJECT_ID}/locations/${REGION}/instances/${APP}-redis"

# =============================================================================
# 7. Secrets
# =============================================================================
info "=== 7. Secrets ==="

for SECRET in "db-password" "jwt-secret" "admin-password" "user-password"; do
  tf_import "module.secrets.google_secret_manager_secret.secrets[\"${SECRET}\"]" \
    "projects/${PROJECT_ID}/secrets/${SECRET}"

  # Lấy version number của secret version mới nhất
  VERSION=$(gcloud secrets versions list "$SECRET" \
    --project="$PROJECT_ID" \
    --limit=1 \
    --filter="state=ENABLED" \
    --format='value(name)' 2>/dev/null | awk -F'/' '{print $NF}' || echo "1")

  tf_import "module.secrets.google_secret_manager_secret_version.versions[\"${SECRET}\"]" \
    "projects/${PROJECT_ID}/secrets/${SECRET}/versions/${VERSION}"

  tf_import "module.secrets.google_secret_manager_secret_iam_member.run_sa_access[\"${SECRET}\"]" \
    "projects/${PROJECT_ID}/secrets/${SECRET} roles/secretmanager.secretAccessor serviceAccount:${SA_EMAIL}"
done

# =============================================================================
# 8. Cloud Run
# =============================================================================
info "=== 8. Cloud Run ==="

tf_import "module.cloud_run.google_cloud_run_v2_service.backend" \
  "projects/${PROJECT_ID}/locations/${REGION}/services/${APP}-backend"

tf_import "module.cloud_run.google_cloud_run_v2_service.frontend" \
  "projects/${PROJECT_ID}/locations/${REGION}/services/${APP}-frontend"

tf_import "module.cloud_run.google_cloud_run_v2_service_iam_member.backend_noauth" \
  "projects/${PROJECT_ID}/locations/${REGION}/services/${APP}-backend roles/run.invoker allUsers"

tf_import "module.cloud_run.google_cloud_run_v2_service_iam_member.frontend_noauth" \
  "projects/${PROJECT_ID}/locations/${REGION}/services/${APP}-frontend roles/run.invoker allUsers"

# =============================================================================
# DONE
# =============================================================================
echo ""
echo "============================================"
echo "  Import hoàn tất!"
echo ""
echo "  Tiếp theo:"
echo "  1. terraform plan   → xem có diffs không"
echo "  2. Nếu có diffs: điều chỉnh .tf files cho khớp"
echo "  3. terraform apply  → apply diffs (nếu có)"
echo "============================================"
