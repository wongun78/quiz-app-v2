# =============================================================================
# modules/iam/main.tf — Service Account, IAM Roles, Workload Identity Federation
#
# WIF (Workload Identity Federation):
# → GitHub Actions không cần JSON key
# → GitHub OIDC token được exchange lấy short-lived GCP credentials
# → An toàn hơn: không có long-lived secret nào bị lưu
# =============================================================================

# =============================================================================
# Service Account cho Cloud Run
# =============================================================================
resource "google_service_account" "run_sa" {
  account_id   = "${var.app_name}-run-sa"
  project      = var.project_id
  display_name = "${var.app_name} App Cloud Run SA"
  description  = "Service Account cho Cloud Run services (backend + frontend)"
}

# =============================================================================
# IAM Roles cho SA
# =============================================================================
locals {
  run_sa_roles = toset([
    "roles/cloudsql.client",          # Kết nối Cloud SQL
    "roles/redis.viewer",             # Đọc Redis instance info trong CI/CD
    "roles/artifactregistry.writer",  # Push Docker images từ CI/CD
    "roles/run.developer",            # Deploy Cloud Run services
    "roles/iam.serviceAccountUser",   # Cloud Run deploy-as SA
  ])
}

resource "google_project_iam_member" "run_sa_roles" {
  for_each = local.run_sa_roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.run_sa.email}"
}

# =============================================================================
# Workload Identity Federation
#
# Luồng hoạt động:
# 1. GitHub Actions request OIDC token từ GitHub
# 2. Token chứa: repo, branch, actor, workflow...
# 3. GCP kiểm tra token với GitHub's JWKS endpoint
# 4. Nếu assertion.repository == var.github_repo → cấp phép
# 5. SA token được issue cho workflow
# =============================================================================

# Pool = "không gian tin cậy" chứa các external identity providers
resource "google_iam_workload_identity_pool" "github_pool" {
  project                   = var.project_id
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub Actions Pool"
  description               = "WIF Pool cho GitHub Actions CI/CD (keyless auth)"
}

# Provider = cấu hình cụ thể cho GitHub OIDC
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Provider"

  # GitHub's OIDC discovery URL (RFC 8414 compliant)
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  # Map: GitHub JWT claims → GCP attributes
  attribute_mapping = {
    "google.subject"            = "assertion.sub"
    "attribute.actor"           = "assertion.actor"
    "attribute.repository"      = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
  }

  # CHỈ cho phép token từ repo này — QUAN TRỌNG vì bảo mật!
  # Thiếu dòng này → bất kỳ GitHub repo nào cũng có thể impersonate SA
  attribute_condition = "assertion.repository == '${var.github_repo}'"
}

# Binding: GitHub Actions workflows trong repo → được phép impersonate SA này
resource "google_service_account_iam_member" "wif_binding" {
  service_account_id = google_service_account.run_sa.name
  role               = "roles/iam.workloadIdentityUser"

  # principalSet: tất cả workflows trong repo (không giới hạn branch cụ thể)
  # Dùng principal: nếu muốn giới hạn từng workflow
  member = "principalSet://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_pool.workload_identity_pool_id}/attribute.repository/${var.github_repo}"
}
