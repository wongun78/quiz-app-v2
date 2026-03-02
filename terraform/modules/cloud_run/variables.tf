variable "project_id" { type = string }
variable "region" { type = string }

variable "app_name" {
  description = "Prefix cho service names"
  type        = string
}

variable "run_sa_email" {
  description = "Service Account email cho Cloud Run"
  type        = string
}

variable "connector_id" {
  description = "VPC Connector resource ID"
  type        = string
}

variable "db_ip" {
  description = "Cloud SQL private IP"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "redis_host" {
  description = "Redis host IP"
  type        = string
}

variable "backend_image" {
  description = "Backend Docker image"
  type        = string
}

variable "frontend_image" {
  description = "Frontend Docker image"
  type        = string
}

variable "cors_allowed_origins" {
  description = "Frontend URL cho CORS (trống = dùng Spring default localhost)"
  type        = string
  default     = ""
}
