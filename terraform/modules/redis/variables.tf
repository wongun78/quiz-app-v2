variable "project_id" { type = string }
variable "region" { type = string }

variable "instance_name" {
  description = "Tên Redis instance"
  type        = string
}

variable "vpc_id" {
  description = "Self-link của VPC network"
  type        = string
}
