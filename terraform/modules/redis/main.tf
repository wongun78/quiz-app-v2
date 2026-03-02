# =============================================================================
# modules/redis/main.tf — Memorystore Redis
#
# BASIC tier: 1 node, không HA (~$16/tháng cho 1GB)
# Chỉ có private IP trong VPC — không có public endpoint
# =============================================================================

resource "google_redis_instance" "cache" {
  name    = var.instance_name
  project = var.project_id
  region  = var.region

  tier           = "BASIC"
  memory_size_gb = 1
  redis_version  = "REDIS_7_0"

  # Kết nối vào VPC (private only)
  authorized_network = var.vpc_id

  display_name = "Quiz App Cache"
}
