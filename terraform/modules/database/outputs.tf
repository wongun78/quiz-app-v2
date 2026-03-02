output "db_ip" {
  description = "Private IP của Cloud SQL instance"
  value       = google_sql_database_instance.main.private_ip_address
}

output "instance_name" {
  value = google_sql_database_instance.main.name
}

output "connection_name" {
  description = "Connection name format: project:region:instance (dùng cho Cloud SQL Auth Proxy)"
  value       = google_sql_database_instance.main.connection_name
}
