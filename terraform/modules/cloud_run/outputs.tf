output "backend_url" {
  description = "URL của backend Cloud Run service"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  description = "URL của frontend Cloud Run service"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "backend_service_name" {
  value = google_cloud_run_v2_service.backend.name
}

output "frontend_service_name" {
  value = google_cloud_run_v2_service.frontend.name
}
