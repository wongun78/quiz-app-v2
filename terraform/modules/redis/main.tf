resource "google_redis_instance" "cache" {
  name    = var.instance_name
  project = var.project_id
  region  = var.region

  tier           = "BASIC"
  memory_size_gb = 1
  redis_version  = "REDIS_7_0"

  authorized_network = var.vpc_id

  display_name = "Quiz App Cache"

  lifecycle {
    ignore_changes = [authorized_network]
  }
}
