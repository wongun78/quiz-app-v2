# =============================================================================
# versions.tf — Yêu cầu phiên bản Terraform và providers
#
# Tại sao cần file này?
# → Đảm bảo team dùng cùng version Terraform, tránh "works on my machine"
# → version constraint (~> 6.0) = ">=6.0, <7.0" → không bị breaking change v7
# =============================================================================

terraform {
  # Terraform CLI tối thiểu 1.5 vì dùng import blocks (tính năng 1.5+)
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}
