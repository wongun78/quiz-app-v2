provider "google" {
  project = var.project_id
  region  = var.region
}

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
    "iamcredentials.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

module "artifact_registry" {
  source = "./modules/artifact_registry"

  project_id = var.project_id
  region     = var.region
  repo_name  = "${var.app_name}-repo"

  depends_on = [google_project_service.apis]
}

module "networking" {
  source = "./modules/networking"

  project_id     = var.project_id
  region         = var.region
  vpc_name       = "${var.app_name}-vpc"
  connector_name = "${var.app_name}-connector"

  depends_on = [google_project_service.apis]
}

module "iam" {
  source = "./modules/iam"

  project_id     = var.project_id
  project_number = var.project_number
  app_name       = var.app_name
  github_repo    = var.github_repo

  depends_on = [google_project_service.apis]
}

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

module "redis" {
  source = "./modules/redis"

  project_id    = var.project_id
  region        = var.region
  instance_name = "${var.app_name}-redis"
  vpc_id        = module.networking.vpc_id

  depends_on = [module.networking]
}

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

  cors_allowed_origins = var.cors_allowed_origins

  depends_on = [
    module.database,
    module.redis,
    module.secrets,
    module.iam,
    module.artifact_registry,
  ]
}
