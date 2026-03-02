# =============================================================================
# modules/secrets/main.tf — Google Cloud Secret Manager
#
# Tại sao Secret Manager?
# - Env vars có thể bị lộ qua logs, `gcloud run services describe`, GCP Console
# - Secret Manager: encrypted at rest, audit log mọi access, versioning
# - Cloud Run mount secret trực tiếp vào env var → không đi qua network
#
# Cấu trúc trong Terraform:
# - google_secret_manager_secret: metadata (tên, policy)
# - google_secret_manager_secret_version: giá trị thực của secret
# - google_secret_manager_secret_iam_member: ai được phép đọc
# =============================================================================

locals {
  secrets = {
    "db-password"    = var.db_password
    "jwt-secret"     = var.jwt_secret
    "admin-password" = var.admin_password
    "user-password"  = var.user_password
  }
}

# Tạo secret container (chưa có giá trị)
resource "google_secret_manager_secret" "secrets" {
  for_each  = local.secrets
  project   = var.project_id
  secret_id = each.key

  # automatic: GCP tự chọn region lưu — đơn giản nhất
  replication {
    auto {}
  }
}

# Thêm secret version (giá trị thực)
# secret_data là sensitive → Terraform sẽ ẩn trong logs/output
resource "google_secret_manager_secret_version" "versions" {
  for_each = local.secrets

  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value # sensitive variable

  lifecycle {
    # ignore_changes: sau khi tạo lần đầu, KHÔNG update lại nếu value thay đổi
    # Lý do: thay đổi secret nên làm thủ công hoặc qua rotation policy
    # Nếu muốn TF quản lý rotation, bỏ dòng này
    ignore_changes = [secret_data]
  }
}

# Cấp quyền cho Cloud Run SA đọc từng secret
# Best practice: cấp per-secret, không cấp project-level
resource "google_secret_manager_secret_iam_member" "run_sa_access" {
  for_each = local.secrets

  project   = var.project_id
  secret_id = google_secret_manager_secret.secrets[each.key].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${var.run_sa_email}"
}
