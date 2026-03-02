variable "project_id" { type = string }

variable "run_sa_email" {
  description = "Email của Cloud Run Service Account"
  type        = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "user_password" {
  type      = string
  sensitive = true
}
