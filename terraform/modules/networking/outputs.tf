output "vpc_id" {
  description = "Self-link của VPC network"
  value       = google_compute_network.vpc.id
}

output "vpc_name" {
  description = "Tên VPC network"
  value       = google_compute_network.vpc.name
}

output "connector_id" {
  description = "Full resource ID của VPC Connector (dùng trong Cloud Run)"
  value       = google_vpc_access_connector.connector.id
}
