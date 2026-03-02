# =============================================================================
# modules/artifact_registry/main.tf — Docker image registry
#
# Tại sao Artifact Registry thay vì Docker Hub?
# → Images cùng region với Cloud Run → pull nhanh hơn, không tốn egress cost
# → Private: chỉ project này mới access được
# → GCP quản lý authentication tự động
# =============================================================================

resource "google_artifact_registry_repository" "repo" {
  project  = var.project_id
  location = var.region

  repository_id = var.repo_name
  format        = "DOCKER"
  description   = "Docker images cho Quiz App"
}
