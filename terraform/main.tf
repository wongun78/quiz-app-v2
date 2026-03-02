# =============================================================================
# main.tf — Provider config + gọi tất cả modules
#
# Thiết kế: Root module gọi các child modules theo thứ tự phụ thuộc:
#
#   [APIs] → [artifact_registry] → [networking] → [iam]
#          ↘ [database] ↘
#          ↘ [redis]    ↘ [secrets] → [cloud_run]
#          ↘ [iam]      ↗
#
# Từng module = 1 "concern" độc lập, dễ test và reuse
# =============================================================================

# =============================================================================
# PROVIDER — Google Cloud
# =============================================================================
provider "google" {
  project = var.project_id
  region  = var.region

  # Xác thực: ưu tiên theo thứ tự
  # 1. GOOGLE_APPLICATION_CREDENTIALS env var (CI/CD)
  # 2. gcloud Application Default Credentials (local dev)
  # → Không cần service account key hardcode ở đây
}

# =============================================================================
# ENABLE APIS — Bật các GCP APIs cần thiết
#
# Tại sao? GCP mặc định tắt hết. Phải bật tường minh.
# disable_on_destroy = false: KHÔNG tắt API khi `terraform destroy`
#   → Tắt API ngẫu nhiên có thể phá vỡ services khác trong project
# =============================================================================
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "artifactregistry.googleapis.com",
    "vpcaccess.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com", # Cần cho WIF (Workload Identity)
  ])

  service            = each.value
  disable_on_destroy = false
}

# =============================================================================
# MODULE: artifact_registry — Docker image registry
# =============================================================================
module "artifact_registry" {
  source = "./modules/artifact_registry"

  project_id = var.project_id
  region     = var.region
  repo_name  = "${var.app_name}-repo"

  depends_on = [google_project_service.apis]
}

# =============================================================================
# MODULE: networking — VPC, VPC Connector, Firewall, Private Peering
# =============================================================================
module "networking" {
  source = "./modules/networking"

  project_id     = var.project_id
  region         = var.region
  vpc_name       = "${var.app_name}-vpc"
  connector_name = "${var.app_name}-connector"

  depends_on = [google_project_service.apis]
}

# =============================================================================
# MODULE: iam — Service Account, IAM bindings, Workload Identity Federation
# =============================================================================
module "iam" {
  source = "./modules/iam"

  project_id     = var.project_id
  project_number = var.project_number
  app_name       = var.app_name
  github_repo    = var.github_repo

  depends_on = [google_project_service.apis]
}

# =============================================================================
# MODULE: database — Cloud SQL PostgreSQL
# =============================================================================
module "database" {
  source = "./modules/database"

  project_id    = var.project_id
  region        = var.region
  instance_name = "${var.app_name}-db"
  db_name       = "${var.app_name}_db"
  db_password   = var.db_password
  vpc_id        = module.networking.vpc_id

  depends_on = [module.networking]
}

# =============================================================================
# MODULE: redis — Memorystore Redis
# =============================================================================
module "redis" {
  source = "./modules/redis"

  project_id    = var.project_id
  region        = var.region
  instance_name = "${var.app_name}-redis"
  vpc_id        = module.networking.vpc_id

  depends_on = [module.networking]
}

# =============================================================================
# MODULE: secrets — Secret Manager (passwords, JWT secret)
# =============================================================================
module "secrets" {
  source = "./modules/secrets"

  project_id     = var.project_id
  run_sa_email   = module.iam.run_sa_email
  db_password    = var.db_password
  jwt_secret     = var.jwt_secret
  admin_password = var.admin_password
  user_password  = var.user_password

  depends_on = [module.iam]
}

# =============================================================================
# MODULE: cloud_run — Deploy Backend + Frontend lên Cloud Run
# =============================================================================
module "cloud_run" {
  source = "./modules/cloud_run"

  project_id     = var.project_id
  region         = var.region
  app_name       = var.app_name
  run_sa_email   = module.iam.run_sa_email
  connector_id   = module.networking.connector_id
  db_ip          = module.database.db_ip
  db_name        = "${var.app_name}_db"
  redis_host     = module.redis.redis_host
  backend_image  = var.backend_image
  frontend_image = var.frontend_image

  # CORS: xem hướng dẫn trong variables.tf
  cors_allowed_origins = var.cors_allowed_origins

  depends_on = [
    module.database,
    module.redis,
    module.secrets,
    module.iam,
    module.artifact_registry,
  ]
}
