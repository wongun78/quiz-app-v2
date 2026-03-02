resource "google_artifact_registry_repository" "repo" {
  project  = var.project_id
  location = var.region

  repository_id = var.repo_name
  format        = "DOCKER"
  description   = "Docker images cho Quiz App"
}
