# =============================================================================
# modules/cloud_run/main.tf — Deploy Backend + Frontend lên Cloud Run
#
# Lưu ý CORS lifecycle:
# → Lần đầu apply: cors_allowed_origins = "" → backend dùng default (localhost)
# → Sau khi frontend deploy xong: `terraform output frontend_url`
# → Cập nhật terraform.tfvars: cors_allowed_origins = "<frontend-url>"
# → Chạy `terraform apply` lại → backend update CORS
# =============================================================================

# =============================================================================
# BACKEND — Spring Boot service
# =============================================================================
resource "google_cloud_run_v2_service" "backend" {
  name     = "${var.app_name}-backend"
  project  = var.project_id
  location = var.region

  # KHÔNG yêu cầu Google authentication để gọi API
  # (app tự dùng JWT auth)
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = var.run_sa_email

    # Kết nối vào VPC để reach Cloud SQL và Redis (private IPs)
    vpc_access {
      connector = var.connector_id
      # private-ranges-only: chỉ traffic tới 10.x.x.x đi qua VPC
      # Traffic ra internet vẫn direct → tiết kiệm VPC Connector quota
      egress = "PRIVATE_RANGES_ONLY"
    }

    scaling {
      min_instance_count = 0 # Scale to zero → tiết kiệm chi phí khi không dùng
      max_instance_count = 3
    }

    containers {
      image = var.backend_image

      resources {
        limits = {
          memory = "1Gi"
          cpu    = "1"
        }
        # cpu_idle = false → CPU throttled khi không xử lý request (mặc định)
        # startup_cpu_boost = true → CPU full khi cold start → giảm latency
        startup_cpu_boost = true
      }

      ports {
        container_port = 8080
      }

      # Timeout cao hơn để tránh cold start timeout
      startup_probe {
        http_get {
          path = "/actuator/health"
          port = 8080
        }
        initial_delay_seconds = 10
        timeout_seconds       = 5
        period_seconds        = 10
        failure_threshold     = 10
      }

      # -------------------------------------------------------------------
      # Environment Variables — config không nhạy cảm
      # -------------------------------------------------------------------
      env {
        name  = "SPRING_DATASOURCE_URL"
        value = "jdbc:postgresql://${var.db_ip}:5432/${var.db_name}"
      }
      env {
        name  = "SPRING_DATASOURCE_USERNAME"
        value = "postgres"
      }
      env {
        name  = "REDIS_HOST"
        value = var.redis_host
      }
      env {
        name  = "REDIS_PORT"
        value = "6379"
      }
      env {
        name  = "REDIS_DATABASE"
        value = "0"
      }
      env {
        name  = "SPRING_JPA_HIBERNATE_DDL_AUTO"
        value = "update"
      }
      env {
        name  = "DATA_INIT_ENABLED"
        value = "true"
      }
      # CORS: set nếu cors_allowed_origins không rỗng
      dynamic "env" {
        for_each = var.cors_allowed_origins != "" ? [1] : []
        content {
          name  = "CORS_ALLOWED_ORIGINS"
          value = var.cors_allowed_origins
        }
      }

      # -------------------------------------------------------------------
      # Secrets từ Secret Manager — mount vào env var
      # Format: secret_name:version → env var name
      # Cloud Run tự fetch secret khi container start → không đi qua network
      # -------------------------------------------------------------------
      env {
        name = "SPRING_DATASOURCE_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = "db-password"
            version = "latest"
          }
        }
      }
      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = "jwt-secret"
            version = "latest"
          }
        }
      }
      env {
        name = "ADMIN_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = "admin-password"
            version = "latest"
          }
        }
      }
      env {
        name = "USER_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = "user-password"
            version = "latest"
          }
        }
      }
    }
  }

  lifecycle {
    # Không replace service khi image thay đổi (CI/CD sẽ deploy revision mới)
    # Nhưng vẫn cần apply để update env vars và config
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }
}

# Cho phép unauthenticated access vào backend (JWT tự xử lý auth)
resource "google_cloud_run_v2_service_iam_member" "backend_noauth" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# =============================================================================
# FRONTEND — React/Vite static + Nginx
# =============================================================================
resource "google_cloud_run_v2_service" "frontend" {
  name     = "${var.app_name}-frontend"
  project  = var.project_id
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = var.run_sa_email

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {
      image = var.frontend_image

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
        startup_cpu_boost = true
      }

      ports {
        container_port = 8080
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }
}

resource "google_cloud_run_v2_service_iam_member" "frontend_noauth" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
