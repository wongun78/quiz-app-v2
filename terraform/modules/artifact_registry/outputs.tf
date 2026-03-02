output "registry_url" {
  description = "Base URL của Artifact Registry (không có trailing slash)"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo_name}"
}

output "repository_id" {
  value = google_artifact_registry_repository.repo.repository_id
}
