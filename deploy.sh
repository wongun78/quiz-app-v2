#!/usr/bin/env bash
# =============================================================================
# Full GCP deployment via gcloud CLI
# =============================================================================
# Cách dùng:
#   chmod +x deploy.sh
#   ./deploy.sh setup      # Bước 1: Config + Enable APIs
#   ./deploy.sh registry   # Bước 2: Tạo Artifact Registry
#   ./deploy.sh network    # Bước 3: VPC + VPC Connector
#   ./deploy.sh database   # Bước 4: Cloud SQL PostgreSQL
#   ./deploy.sh redis      # Bước 5: Memorystore Redis
#   ./deploy.sh secrets    # Bước 6: Secret Manager
#   ./deploy.sh build      # Bước 7: Build & Push Docker images
#   ./deploy.sh deploy     # Bước 8: Deploy lên Cloud Run
#   ./deploy.sh status     # Kiểm tra toàn bộ
#   ./deploy.sh destroy    # Xóa toàn bộ resources
# =============================================================================

set -euo pipefail  # Dừng ngay nếu có lỗi, biến chưa set cũng báo lỗi

# =============================================================================
# CẤU HÌNH — Tên resources
# =============================================================================
PROJECT_ID="kien-terraform-playground"
REGION="asia-southeast1"

# Tên resources
AR_REPO="quiz-repo"                  # Artifact Registry repository
VPC_NAME="quiz-vpc"                  # VPC network
CONNECTOR_NAME="quiz-connector"      # VPC Access Connector
SQL_INSTANCE="quiz-db"               # Cloud SQL instance
DB_NAME="quiz_db"                    # Database name bên trong SQL
REDIS_NAME="quiz-redis"              # Memorystore Redis instance
BACKEND_SERVICE="quiz-backend"       # Cloud Run backend service
FRONTEND_SERVICE="quiz-frontend"     # Cloud Run frontend service
RUN_SA="quiz-run-sa"                 # Service Account cho Cloud Run

# =============================================================================
# PASSWORDS — Đọc từ .env
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1091
  source "$ENV_FILE"
else
  echo ""
  echo "ERROR: File .env không tồn tại!"
  echo ""
  echo "  Tạo file .env từ template:"
  echo "    cp .env.example .env"
  echo "  Sau đó điền passwords thật vào .env"
  echo ""
  exit 1
fi

# Validate các biến bắt buộc
for VAR in DB_PASSWORD JWT_SECRET ADMIN_PASSWORD USER_PASSWORD; do
  if [[ -z "${!VAR:-}" ]]; then
    echo "ERROR: Biến $VAR chưa được set trong .env"
    exit 1
  fi
done

# Image tags
BACKEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/backend:latest"
FRONTEND_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/frontend:latest"
RUN_SA_EMAIL="${RUN_SA}@${PROJECT_ID}.iam.gserviceaccount.com"

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================
info()    { echo ""; echo "▶ $*"; }
success() { echo "✓ $*"; }
warn()    { echo "⚠ $*"; }

# =============================================================================
# STEP: setup — Bước 1: Config gcloud + Enable APIs
# =============================================================================
cmd_setup() {
  info "Bước 1: Config gcloud project"
  # Set project để mọi lệnh gcloud sau không cần truyền --project
  gcloud config set project "$PROJECT_ID"
  gcloud config set compute/region "$REGION"
  success "Project set: $PROJECT_ID | Region: $REGION"

  info "Bước 1b: Enable APIs"
  # GCP mặc định tắt tất cả services.
  # - run.googleapis.com          → Cloud Run
  # - sqladmin.googleapis.com     → Cloud SQL
  # - redis.googleapis.com        → Memorystore Redis
  # - artifactregistry.googleapis.com → Docker image registry
  # - vpcaccess.googleapis.com    → VPC Connector (Cloud Run ↔ private VPC)
  # - secretmanager.googleapis.com → Lưu passwords an toàn
  # - servicenetworking.googleapis.com → Private service connection cho Cloud SQL
  gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    redis.googleapis.com \
    artifactregistry.googleapis.com \
    vpcaccess.googleapis.com \
    secretmanager.googleapis.com \
    servicenetworking.googleapis.com \
    cloudresourcemanager.googleapis.com

  success "APIs enabled"
}

# =============================================================================
# STEP: registry — Bước 2: Tạo Artifact Registry
# =============================================================================
cmd_registry() {
  info "Bước 2: Tạo Artifact Registry repository"
  # Tại sao Artifact Registry thay vì Docker Hub?
  # → Images nằm cùng region với Cloud Run: pull nhanh hơn, không tốn network egress
  # → Private, không cần public Docker Hub account
  # → Google quản lý authentication tự động
  gcloud artifacts repositories create "$AR_REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Quiz App Docker images" \
    || warn "Repository đã tồn tại, bỏ qua"

  gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
  success "Artifact Registry: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}"
}

# =============================================================================
# STEP: network — Bước 3: VPC + VPC Connector
# =============================================================================
cmd_network() {
  info "Bước 3a: Tạo VPC network"
  # Tại sao cần VPC riêng?
  # → Cloud SQL và Redis không có public IP (bảo mật)
  # → Chúng chỉ accessible từ bên trong VPC này
  # → --subnet-mode=auto: GCP tự tạo subnet cho mỗi region
  gcloud compute networks create "$VPC_NAME" \
    --subnet-mode=auto \
    || warn "VPC đã tồn tại, bỏ qua"

  success "VPC: $VPC_NAME"

  info "Bước 3b: Tạo VPC Access Connector"
  # Tại sao cần Connector?
  # → Cloud Run là SERVERLESS — nó không "nằm trong" VPC
  # → Muốn Cloud Run gọi tới Redis/Cloud SQL (private IP), cần cầu nối
  # → Connector = cầu nối Cloud Run ↔ VPC
  # → --range=10.8.0.0/28: IP range riêng cho connector (không trùng với VPC subnet)
  # → e2-micro với 2-3 instances: đủ cho dev, tiết kiệm chi phí
  gcloud compute networks vpc-access connectors create "$CONNECTOR_NAME" \
    --region="$REGION" \
    --network="$VPC_NAME" \
    --range="10.8.0.0/28" \
    --min-instances=2 \
    --max-instances=3 \
    --machine-type=e2-micro \
    || warn "Connector đã tồn tại, bỏ qua"

  success "VPC Connector: $CONNECTOR_NAME"

  info "Bước 3c: Private Service Connection cho Cloud SQL"
  # Tại sao? Cloud SQL private IP cần peering với Google's network
  # Đây là 1-time setup cho project
  gcloud compute addresses create "google-managed-services-${VPC_NAME}" \
    --global \
    --purpose=VPC_PEERING \
    --prefix-length=16 \
    --network="$VPC_NAME" \
    || warn "Address đã tồn tại, bỏ qua"

  gcloud services vpc-peerings connect \
    --service=servicenetworking.googleapis.com \
    --ranges="google-managed-services-${VPC_NAME}" \
    --network="$VPC_NAME" \
    || warn "Peering đã tồn tại, bỏ qua"

  info "Bước 3d: Firewall rule cho VPC Connector → Cloud SQL & Redis"
  # Tại sao? VPC Connector dùng IP range 10.8.0.0/28
  # Cloud SQL (10.1.x.x) và Redis (10.22.x.x) cần nhận traffic từ range này
  # Thiếu rule này → Spring Boot không connect được DB → container crash khi start
  gcloud compute firewall-rules create "allow-connector-to-services" \
    --network="$VPC_NAME" \
    --allow="tcp:5432,tcp:6379" \
    --source-ranges="10.8.0.0/28" \
    --description="Allow VPC connector to reach Cloud SQL and Redis" \
    || warn "Firewall rule đã tồn tại, bỏ qua"

  success "Private service connection ready"
}

# =============================================================================
# STEP: database — Bước 4: Cloud SQL PostgreSQL
# =============================================================================
cmd_database() {
  info "Bước 4a: Tạo Cloud SQL instance (~10-15 phút, có thể uống nước)"
  # db-f1-micro: 1 shared vCPU, 614MB RAM — đủ cho dev/demo (~$7/tháng)
  # --no-assign-ip: KHÔNG có public IP — chỉ private IP trong VPC (bảo mật)
  # --storage-type=HDD: rẻ hơn SSD, đủ cho dev
  gcloud sql instances create "$SQL_INSTANCE" \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --edition=ENTERPRISE \
    --region="$REGION" \
    --network="$VPC_NAME" \
    --no-assign-ip \
    --storage-size=10GB \
    --storage-type=HDD \
    --no-storage-auto-increase \
    || warn "SQL instance đã tồn tại, bỏ qua"

  success "Cloud SQL instance: $SQL_INSTANCE"

  info "Bước 4b: Tạo database và set password"
  gcloud sql databases create "$DB_NAME" \
    --instance="$SQL_INSTANCE" \
    || warn "Database đã tồn tại, bỏ qua"

  gcloud sql users set-password postgres \
    --instance="$SQL_INSTANCE" \
    --password="$DB_PASSWORD"

  # Lấy private IP để dùng ở bước deploy
  DB_IP=$(gcloud sql instances describe "$SQL_INSTANCE" \
    --format='value(ipAddresses[0].ipAddress)')
  success "Cloud SQL private IP: $DB_IP"
}

# =============================================================================
# STEP: redis — Bước 5: Memorystore Redis
# =============================================================================
cmd_redis() {
  info "Bước 5: Tạo Memorystore Redis (~5 phút)"
  # BASIC tier: 1 node, không HA — đủ cho dev (~$16/tháng cho 1GB)
  # --size=1: 1GB memory
  # Không có public IP — chỉ accessible từ trong VPC
  gcloud redis instances create "$REDIS_NAME" \
    --size=1 \
    --region="$REGION" \
    --network="$VPC_NAME" \
    --redis-version=redis_7_0 \
    --tier=basic \
    || warn "Redis đã tồn tại, bỏ qua"

  REDIS_HOST=$(gcloud redis instances describe "$REDIS_NAME" \
    --region="$REGION" \
    --format='value(host)')
  success "Redis host: $REDIS_HOST"
}

# =============================================================================
# STEP: secrets — Bước 6: Secret Manager
# =============================================================================
cmd_secrets() {
  info "Bước 6a: Tạo Service Account cho Cloud Run"
  # Tại sao cần Service Account riêng?
  # → Nguyên tắc Least Privilege: chỉ cấp đúng quyền cần thiết
  # → Nếu bị compromise, hacker chỉ có quyền giới hạn
  # → Không dùng default Compute SA (quyền quá rộng)
  gcloud iam service-accounts create "$RUN_SA" \
    --display-name="Quiz App Cloud Run SA" \
    || warn "Service account đã tồn tại, bỏ qua"

  success "Service account: $RUN_SA_EMAIL"

  info "Bước 6b: Lưu secrets vào Secret Manager"
  # Tại sao Secret Manager thay vì env vars?
  # → Env vars có thể bị lộ qua logs, `docker inspect`, GCP Console
  # → Secret Manager: encrypted at rest, audit log mọi lần access, versioning
  for SECRET_NAME in db-password jwt-secret admin-password user-password; do
    gcloud secrets delete "$SECRET_NAME" --quiet 2>/dev/null || true
  done

  echo -n "$DB_PASSWORD"     | gcloud secrets create db-password     --data-file=- --replication-policy=automatic
  echo -n "$JWT_SECRET"      | gcloud secrets create jwt-secret      --data-file=- --replication-policy=automatic
  echo -n "$ADMIN_PASSWORD"  | gcloud secrets create admin-password  --data-file=- --replication-policy=automatic
  echo -n "$USER_PASSWORD"   | gcloud secrets create user-password   --data-file=- --replication-policy=automatic

  success "4 secrets đã được tạo"

  info "Bước 6c: Cấp quyền cho Cloud Run SA đọc secrets"
  # Grant quyền đọc từng secret (không phải toàn project)
  for SECRET_NAME in db-password jwt-secret admin-password user-password; do
    gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
      --member="serviceAccount:${RUN_SA_EMAIL}" \
      --role="roles/secretmanager.secretAccessor"
  done

  info "Bước 6d: Cấp quyền connect Cloud SQL"
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${RUN_SA_EMAIL}" \
    --role="roles/cloudsql.client"

  success "IAM bindings done"
}

# =============================================================================
# STEP: build — Bước 7: Build & Push Docker images
# =============================================================================
cmd_build() {

  info "Bước 7a: Build & Push Backend image"
  # Backend image: Spring Boot — không cần build arg, mọi config qua env vars lúc run
  # --platform linux/amd64: bắt buộc khi build trên Apple Silicon (arm64) cho Cloud Run (amd64)
  docker build --platform linux/amd64 -t "$BACKEND_IMAGE" ./server
  docker push "$BACKEND_IMAGE"
  success "Backend image pushed: $BACKEND_IMAGE"

  info "Bước 7b: Build Frontend image (tạm dùng placeholder URL)"
  # Frontend: VITE_API_BASE_URL được bake vào lúc build (Vite bundle)
  # → Nếu chưa có BACKEND_URL thật, dùng placeholder
  # → Sau khi deploy backend xong sẽ rebuild + redeploy
  # Lấy backend URL nếu đã deploy, nếu chưa thì dùng placeholder
  BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" \
    --region="$REGION" \
    --format='value(status.url)' 2>/dev/null || echo "https://quiz-backend-placeholder.run.app")

  docker build \
    --platform linux/amd64 \
    --build-arg VITE_API_BASE_URL="${BACKEND_URL}/api/v1" \
    -t "$FRONTEND_IMAGE" \
    ./client
  docker push "$FRONTEND_IMAGE"
  success "Frontend image pushed: $FRONTEND_IMAGE"
}

# =============================================================================
# STEP: deploy — Bước 8: Deploy lên Cloud Run
# =============================================================================
cmd_deploy() {
  # Lấy các giá trị cần thiết
  DB_IP=$(gcloud sql instances describe "$SQL_INSTANCE" \
    --format='value(ipAddresses[0].ipAddress)')
  REDIS_HOST=$(gcloud redis instances describe "$REDIS_NAME" \
    --region="$REGION" \
    --format='value(host)')
  CONNECTOR_ID="projects/${PROJECT_ID}/locations/${REGION}/connectors/${CONNECTOR_NAME}"

  info "Bước 8a: Deploy Backend lên Cloud Run"
  # --vpc-connector: dùng connector đã tạo để kết nối private services
  # --vpc-egress=private-ranges-only: chỉ traffic tới private IP mới đi qua VPC
  #   (traffic ra internet vẫn đi trực tiếp, tiết kiệm cost)
  # --set-secrets: mount secret từ Secret Manager vào env var
  #   Format: ENV_VAR_NAME=secret-name:version
  # --min-instances=0: scale to zero khi không có traffic (tiết kiệm tối đa)
  # --allow-unauthenticated: endpoint public, không cần Google auth để gọi API
  gcloud run deploy "$BACKEND_SERVICE" \
    --image="$BACKEND_IMAGE" \
    --region="$REGION" \
    --service-account="$RUN_SA_EMAIL" \
    --vpc-connector="$CONNECTOR_ID" \
    --vpc-egress=private-ranges-only \
    --set-env-vars="SPRING_DATASOURCE_URL=jdbc:postgresql://${DB_IP}:5432/${DB_NAME}" \
    --set-env-vars="SPRING_DATASOURCE_USERNAME=postgres" \
    --set-env-vars="REDIS_HOST=${REDIS_HOST}" \
    --set-env-vars="REDIS_PORT=6379" \
    --set-env-vars="REDIS_PASSWORD=" \
    --set-env-vars="REDIS_DATABASE=0" \
    --set-env-vars="SPRING_JPA_HIBERNATE_DDL_AUTO=update" \
    --set-env-vars="DATA_INIT_ENABLED=true" \
    --set-secrets="SPRING_DATASOURCE_PASSWORD=db-password:latest" \
    --set-secrets="JWT_SECRET=jwt-secret:latest" \
    --set-secrets="ADMIN_PASSWORD=admin-password:latest" \
    --set-secrets="USER_PASSWORD=user-password:latest" \
    --memory=1Gi \
    --cpu=1 \
    --cpu-boost \
    --min-instances=0 \
    --max-instances=3 \
    --port=8080 \
    --timeout=300 \
    --allow-unauthenticated

  BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" \
    --region="$REGION" \
    --format='value(status.url)')
  success "Backend URL: $BACKEND_URL"

  info "Bước 8b: Rebuild Frontend với Backend URL thật"
  # Lần này có URL thật → rebuild để Vite bundle đúng API endpoint
  docker build \
    --platform linux/amd64 \
    --build-arg VITE_API_BASE_URL="${BACKEND_URL}/api/v1" \
    -t "$FRONTEND_IMAGE" \
    ./client
  docker push "$FRONTEND_IMAGE"

  info "Bước 8c: Deploy Frontend lên Cloud Run"
  gcloud run deploy "$FRONTEND_SERVICE" \
    --image="$FRONTEND_IMAGE" \
    --region="$REGION" \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=2 \
    --port=8080 \
    --allow-unauthenticated

  FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE" \
    --region="$REGION" \
    --format='value(status.url)')
  success "Frontend URL: $FRONTEND_URL"

  info "Bước 8d: Update CORS trên Backend"
  # Bây giờ mới biết frontend URL → update env var CORS_ALLOWED_ORIGINS
  # QUAN TRỌNG: dùng --update-env-vars (KHÔNG phải --set-env-vars)
  # --set-env-vars: XÓA TOÀN BỘ env vars hiện tại rồi set lại → mất REDIS_HOST, DB_URL...
  # --update-env-vars: chỉ ADD/UPDATE biến được chỉ định, giữ nguyên các biến khác
  gcloud run services update "$BACKEND_SERVICE" \
    --region="$REGION" \
    --update-env-vars="CORS_ALLOWED_ORIGINS=${FRONTEND_URL}"

  echo ""
  echo "Frontend : $FRONTEND_URL"
  echo "Backend  : $BACKEND_URL"
  echo "Swagger  : ${BACKEND_URL}/swagger-ui/index.html"
}

# =============================================================================
# STEP: status — Kiểm tra toàn bộ resources
# =============================================================================
cmd_status() {
  info "Cloud Run Services"
  gcloud run services list --region="$REGION" \
    --format="table(name,status.url,status.conditions[0].status)" 2>/dev/null || true

  info "Cloud SQL"
  gcloud sql instances list \
    --format="table(name,databaseVersion,state,ipAddresses[0].ipAddress)" 2>/dev/null || true

  info "Redis"
  gcloud redis instances list --region="$REGION" \
    --format="table(name,state,host,port)" 2>/dev/null || true

  info "VPC Connector"
  gcloud compute networks vpc-access connectors list --region="$REGION" \
    --format="table(name,state,network)" 2>/dev/null || true

  info "Secrets"
  gcloud secrets list --format="table(name,createTime)" 2>/dev/null || true
}

# =============================================================================
# STEP: destroy — Xóa toàn bộ (tránh tiếp tục tốn tiền)
# =============================================================================
cmd_destroy() {
  warn "Sẽ xóa toàn bộ resources của quiz app!"
  read -r -p "Chắc chắn chưa? (yes/no): " CONFIRM
  [[ "$CONFIRM" != "yes" ]] && echo "Hủy." && exit 0

  info "Xóa Cloud Run services"
  gcloud run services delete "$BACKEND_SERVICE"  --region="$REGION" --quiet 2>/dev/null || true
  gcloud run services delete "$FRONTEND_SERVICE" --region="$REGION" --quiet 2>/dev/null || true

  info "Xóa Cloud SQL"
  gcloud sql instances delete "$SQL_INSTANCE" --quiet 2>/dev/null || true

  info "Xóa Redis"
  gcloud redis instances delete "$REDIS_NAME" --region="$REGION" --quiet 2>/dev/null || true

  info "Xóa Secrets"
  for S in db-password jwt-secret admin-password user-password; do
    gcloud secrets delete "$S" --quiet 2>/dev/null || true
  done

  info "Xóa VPC Connector"
  gcloud compute networks vpc-access connectors delete "$CONNECTOR_NAME" \
    --region="$REGION" --quiet 2>/dev/null || true

  info "Xóa VPC peering address"
  gcloud compute addresses delete "google-managed-services-${VPC_NAME}" \
    --global --quiet 2>/dev/null || true

  info "Xóa Artifact Registry"
  gcloud artifacts repositories delete "$AR_REPO" \
    --location="$REGION" --quiet 2>/dev/null || true

  info "Xóa Service Account"
  gcloud iam service-accounts delete "$RUN_SA_EMAIL" --quiet 2>/dev/null || true

  # VPC xóa cuối cùng (phải xóa resources bên trong trước)
  info "Xóa VPC"
  gcloud compute networks delete "$VPC_NAME" --quiet 2>/dev/null || true

  success "Đã xóa toàn bộ resources"
}

# =============================================================================
# ENTRYPOINT — Xử lý argument
# =============================================================================
case "${1:-help}" in
  setup)    cmd_setup    ;;
  registry) cmd_registry ;;
  network)  cmd_network  ;;
  database) cmd_database ;;
  redis)    cmd_redis    ;;
  secrets)  cmd_secrets  ;;
  build)    cmd_build    ;;
  deploy)   cmd_deploy   ;;
  status)   cmd_status   ;;
  destroy)  cmd_destroy  ;;
  *)
    echo "Quiz App v2 — GCP Deploy Script"
    echo ""
    echo "Chạy từng bước theo thứ tự:"
    echo "  ./deploy.sh setup      # 1. Config + Enable APIs"
    echo "  ./deploy.sh registry   # 2. Artifact Registry"
    echo "  ./deploy.sh network    # 3. VPC + Connector"
    echo "  ./deploy.sh database   # 4. Cloud SQL (~15 phút)"
    echo "  ./deploy.sh redis      # 5. Memorystore Redis (~5 phút)"
    echo "  ./deploy.sh secrets    # 6. Secret Manager + IAM"
    echo "  ./deploy.sh build      # 7. Build & Push images"
    echo "  ./deploy.sh deploy     # 8. Deploy lên Cloud Run"
    echo ""
    echo "Tiện ích:"
    echo "  ./deploy.sh status     # Xem trạng thái tất cả resources"
    echo "  ./deploy.sh destroy    # Xóa toàn bộ (tránh tốn tiền)"
    ;;
esac
