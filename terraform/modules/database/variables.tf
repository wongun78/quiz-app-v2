variable "project_id" { type = string }
variable "region" { type = string }

variable "instance_name" {
  description = "Tên Cloud SQL instance"
  type        = string
}

variable "db_name" {
  description = "Tên database bên trong instance"
  type        = string
}

variable "db_password" {
  description = "Password cho user postgres"
  type        = string
  sensitive   = true
}

variable "vpc_id" {
  description = "Self-link của VPC network"
  type        = string
}
