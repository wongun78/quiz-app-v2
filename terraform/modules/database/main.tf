# =============================================================================
# modules/database/main.tf — Cloud SQL PostgreSQL
#
# Instance settings:
# - db-f1-micro: 1 shared vCPU, 614MB RAM (~$7/tháng) — đủ cho dev/demo
# - No public IP: chỉ private IP trong VPC → bảo mật
# - HDD storage: rẻ hơn SSD, đủ cho dev
# =============================================================================

resource "google_sql_database_instance" "main" {
  name             = var.instance_name
  project          = var.project_id
  region           = var.region
  database_version = "POSTGRES_16"

  settings {
    tier    = "db-f1-micro"
    edition = "ENTERPRISE"

    disk_size       = 10
    disk_type       = "PD_HDD"
    disk_autoresize = false

    ip_configuration {
      # KHÔNG assign public IP — chỉ private IP trong VPC (bảo mật)
      ipv4_enabled    = false
      private_network = var.vpc_id
    }

    # Backup tắt cho dev (tiết kiệm tiền)
    backup_configuration {
      enabled = false
    }
  }

  # deletion_protection = true cho production!
  # Đặt false để `terraform destroy` hoạt động được trong môi trường học
  deletion_protection = false

  depends_on = [var.vpc_id]
}

# Database bên trong instance
resource "google_sql_database" "db" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

# Đặt password cho user postgres
resource "google_sql_user" "postgres" {
  name     = "postgres"
  instance = google_sql_database_instance.main.name
  project  = var.project_id
  password = var.db_password
}
