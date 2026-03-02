output "backend_url" {
  description = "URL của Cloud Run backend service"
  value       = module.cloud_run.backend_url
}

output "frontend_url" {
  description = "URL của Cloud Run frontend service"
  value       = module.cloud_run.frontend_url
}

output "backend_image_repo" {
  description = "Artifact Registry path để push backend image"
  value       = "asia-southeast1-docker.pkg.dev/${var.project_id}/${var.app_name}-repo/backend"
}

output "frontend_image_repo" {
  description = "Artifact Registry path để push frontend image"
  value       = "asia-southeast1-docker.pkg.dev/${var.project_id}/${var.app_name}-repo/frontend"
}

output "run_sa_email" {
  description = "Service Account email của Cloud Run"
  value       = module.iam.run_sa_email
}

output "wif_provider" {
  description = "Workload Identity Provider (dùng trong GitHub Actions)"
  value       = module.iam.wif_provider_name
}

output "swagger_url" {
  description = "Swagger UI URL"
  value       = "${module.cloud_run.backend_url}/swagger-ui/index.html"
}

output "health_url" {
  description = "Health check URL"
  value       = "${module.cloud_run.backend_url}/actuator/health"
}

output "db_ip" {
  description = "Cloud SQL private IP"
  value       = module.database.db_ip
}

output "redis_host" {
  description = "Memorystore Redis host IP"
  value       = module.redis.redis_host
}
