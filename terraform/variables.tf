# =============================================================================
# variables.tf — Khai báo tất cả input variables
#
# Quy tắc:
# - Biến KHÔNG nhạy cảm: có default hoặc điền trong terraform.tfvars
# - Biến nhạy cảm (sensitive = true): BẮT BUỘC điền trong tfvars
#   → Terraform sẽ ẩn giá trị trong logs/output
# - KHÔNG bao giờ hardcode secret vào đây!
# =============================================================================

# -----------------------------------------------------------------------------
# GCP Project Config
# -----------------------------------------------------------------------------
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "kien-terraform-playground"
}

variable "project_number" {
  description = "GCP Project Number (dùng cho WIF)"
  type        = string
  default     = "7102516370"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "asia-southeast1"
}

# -----------------------------------------------------------------------------
# App Config
# -----------------------------------------------------------------------------
variable "app_name" {
  description = "Tên app — dùng làm prefix cho tất cả resources (e.g. quiz)"
  type        = string
  default     = "quiz"
}

variable "github_repo" {
  description = "GitHub repo dạng owner/repo (dùng cho WIF restriction)"
  type        = string
  default     = "wongun78/quiz-app-v2"
}

# -----------------------------------------------------------------------------
# Docker Images — baked từ Artifact Registry
# -----------------------------------------------------------------------------
variable "backend_image" {
  description = "Full Docker image path cho backend service"
  type        = string
  # Sẽ được override trong CI/CD khi biết chính xác tag
  default     = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/backend:latest"
}

variable "frontend_image" {
  description = "Full Docker image path cho frontend service"
  type        = string
  default     = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/frontend:latest"
}

# -----------------------------------------------------------------------------
# Cloud Run - CORS
# -----------------------------------------------------------------------------
variable "cors_allowed_origins" {
  description = <<-EOT
    URL của frontend service, dùng cho CORS backend.
    Workflow:
      1. Lần đầu `terraform apply`: để trống → backend dùng default (localhost)
      2. Chạy `terraform output frontend_url` lấy URL
      3. Điền vào terraform.tfvars: cors_allowed_origins = "https://..."
      4. Chạy `terraform apply` lần 2 → backend update CORS
  EOT
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Secrets — SENSITIVE (giá trị ẩn trong logs)
# Điền vào terraform.tfvars (gitignored), KHÔNG hardcode ở đây!
# Xem terraform.tfvars.example để biết format
# -----------------------------------------------------------------------------
variable "db_password" {
  description = "Password cho PostgreSQL user 'postgres'"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret (>=32 chars)"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Password cho admin user khởi tạo"
  type        = string
  sensitive   = true
}

variable "user_password" {
  description = "Password cho normal user khởi tạo"
  type        = string
  sensitive   = true
}
