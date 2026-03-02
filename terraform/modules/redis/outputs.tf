output "redis_host" {
  description = "Private IP của Redis instance"
  value       = google_redis_instance.cache.host
}

output "redis_port" {
  value = google_redis_instance.cache.port
}
