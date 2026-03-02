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

variable "backend_image" {
  description = "Full Docker image path cho backend service"
  type        = string
  default     = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/backend:latest"
}

variable "frontend_image" {
  description = "Full Docker image path cho frontend service"
  type        = string
  default     = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/frontend:latest"
}

variable "cors_allowed_origins" {
  description = "Frontend URL for CORS (empty = Spring default localhost)"
  type        = string
  default     = ""
}

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
