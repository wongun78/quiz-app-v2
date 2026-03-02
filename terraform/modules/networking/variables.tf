variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
}

variable "vpc_name" {
  description = "Tên VPC network"
  type        = string
}

variable "connector_name" {
  description = "Tên VPC Access Connector"
  type        = string
}
