output "secret_ids" {
  description = "Map từ secret name → secret resource ID"
  value       = { for k, v in google_secret_manager_secret.secrets : k => v.id }
}
