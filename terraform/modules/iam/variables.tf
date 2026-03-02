variable "project_id" { type = string }

variable "project_number" {
  description = "GCP Project Number (dùng để build WIF member string)"
  type        = string
}

variable "app_name" {
  description = "Tên app (dùng làm prefix cho SA)"
  type        = string
}

variable "github_repo" {
  description = "GitHub repo dạng owner/repo"
  type        = string
}
