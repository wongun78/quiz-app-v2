# =============================================================================
# modules/networking/main.tf — VPC, VPC Connector, Firewall, Private Peering
#
# Để Cloud Run (serverless) kết nối tới Cloud SQL và Redis (private VPC):
#   Cloud Run → [VPC Connector] → VPC → Cloud SQL / Redis
#
# Private Service Connection: kết nối VPC của ta với VPC của Google
# (Cloud SQL private IP nằm trong VPC của Google, không phải VPC của ta)
# =============================================================================

# =============================================================================
# VPC Network
# =============================================================================
resource "google_compute_network" "vpc" {
  name    = var.vpc_name
  project = var.project_id

  # auto: GCP tự tạo 1 subnet cho mỗi region
  auto_create_subnetworks = true

  # KHÔNG thêm description ở đây: description là ForceNew field
  # Thêm description sẽ force destroy+recreate toàn bộ VPC và cascade
  # xuống Cloud SQL, Redis, VPC Connector → downtime
}

# =============================================================================
# VPC Access Connector — Cầu nối Cloud Run ↔ VPC
# =============================================================================
resource "google_vpc_access_connector" "connector" {
  name    = var.connector_name
  project = var.project_id
  region  = var.region

  # IP range RIÊNG cho connector — không được trùng với VPC subnets (10.128.0.0/9 mặc định)
  # 10.8.0.0/28 = 16 IPs, đủ cho development
  ip_cidr_range = "10.8.0.0/28"

  # Dùng .name ("quiz-vpc") thay vì .id (full resource path)
  # Existing resource lưu short name → dùng id sẽ thấy diff → ForceNew → replace
  network = google_compute_network.vpc.name

  # e2-micro × 2-3 instances — đủ throughput cho demo/dev, tiết kiệm chi phí
  machine_type   = "e2-micro"
  min_instances  = 2
  max_instances  = 3

  lifecycle {
    # network là ForceNew field — ignore để tránh accidental replacement
    ignore_changes = [network]
  }
}

# =============================================================================
# Private Service Connection — Cho Cloud SQL private IP
#
# Cloud SQL với --no-assign-ip: chỉ có private IP trong "Google's VPC"
# Ta cần VPC peering: VPC của ta ↔ servicenetworking.googleapis.com
# Bước 1: Đặt trước một dải IP trong VPC của ta cho peering
# Bước 2: Connect peering với Google
# =============================================================================

# Bước 1: Reserve IP range cho Google-managed services
resource "google_compute_global_address" "private_service_range" {
  name    = "google-managed-services-${var.vpc_name}"
  project = var.project_id

  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16 # /16 = 65536 IPs — đủ cho Google để assign Cloud SQL IPs

  network = google_compute_network.vpc.id

  lifecycle {
    # network là ForceNew field, và format URL có thể khác khi import
    # (https://... vs projects/...) → ignore để tránh replacement
    ignore_changes = [network]
  }
}

# Bước 2: Tạo VPC peering với servicenetworking
resource "google_service_networking_connection" "private_vpc_connection" {
  network = google_compute_network.vpc.id
  service = "servicenetworking.googleapis.com"

  reserved_peering_ranges = [google_compute_global_address.private_service_range.name]

  lifecycle {
    ignore_changes = [network]
  }
}

# =============================================================================
# Firewall Rule — Cho phép VPC Connector traffic tới Cloud SQL + Redis
#
# Tại sao? VPC Connector forward traffic với source IP từ range 10.8.0.0/28
# Cloud SQL (port 5432) và Redis (port 6379) phải nhận traffic này
# Thiếu rule → Spring Boot không connect được → container crash
# =============================================================================
resource "google_compute_firewall" "allow_connector_to_services" {
  name    = "allow-connector-to-services"
  project = var.project_id
  network = google_compute_network.vpc.name

  description = "Cho phép VPC Connector (10.8.0.0/28) kết nối tới Cloud SQL và Redis"

  allow {
    protocol = "tcp"
    ports    = ["5432", "6379"] # PostgreSQL + Redis
  }

  source_ranges = ["10.8.0.0/28"] # IP range của VPC Connector
}
