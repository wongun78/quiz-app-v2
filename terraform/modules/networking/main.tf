resource "google_compute_network" "vpc" {
  name    = var.vpc_name
  project = var.project_id

  auto_create_subnetworks = true
}

resource "google_vpc_access_connector" "connector" {
  name    = var.connector_name
  project = var.project_id
  region  = var.region

  ip_cidr_range = "10.8.0.0/28"

  network = google_compute_network.vpc.name

  machine_type   = "e2-micro"
  min_instances  = 2
  max_instances  = 3

  lifecycle {
    ignore_changes = [network]
  }
}

resource "google_compute_global_address" "private_service_range" {
  name    = "google-managed-services-${var.vpc_name}"
  project = var.project_id

  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16

  network = google_compute_network.vpc.id

  lifecycle {
    ignore_changes = [network]
  }
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network = google_compute_network.vpc.id
  service = "servicenetworking.googleapis.com"

  reserved_peering_ranges = [google_compute_global_address.private_service_range.name]

  lifecycle {
    ignore_changes = [network]
  }
}

resource "google_compute_firewall" "allow_connector_to_services" {
  name    = "allow-connector-to-services"
  project = var.project_id
  network = google_compute_network.vpc.name

  description = "Cho phép VPC Connector (10.8.0.0/28) kết nối tới Cloud SQL và Redis"

  allow {
    protocol = "tcp"
    ports    = ["5432", "6379"]
  }

  source_ranges = ["10.8.0.0/28"]
}
