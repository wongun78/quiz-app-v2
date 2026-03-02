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
      ipv4_enabled    = false
      private_network = var.vpc_id
    }

    backup_configuration {
      enabled = false
    }
  }

  deletion_protection = false

  lifecycle {
    ignore_changes = [settings[0].ip_configuration[0].private_network]
  }

  depends_on = [var.vpc_id]
}

resource "google_sql_database" "db" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

resource "google_sql_user" "postgres" {
  name     = "postgres"
  instance = google_sql_database_instance.main.name
  project  = var.project_id
  password = var.db_password
}
