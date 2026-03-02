output "run_sa_email" {
  description = "Email của Cloud Run Service Account"
  value       = google_service_account.run_sa.email
}

output "run_sa_id" {
  value = google_service_account.run_sa.id
}

output "wif_provider_name" {
  description = "Full WIF provider name (dùng trong github-actions/auth)"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "wif_pool_id" {
  value = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
}
