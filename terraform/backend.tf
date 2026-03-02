# =============================================================================
# backend.tf — Lưu Terraform state trên GCS (Google Cloud Storage)
#
# Tại sao cần remote state?
# → Nếu dùng local state (terraform.tfstate) → chỉ 1 người làm việc được
# → Remote state trên GCS: mọi người (và CI/CD) share cùng state
# → GCS tự động versioning → có thể rollback state nếu cần
#
# Cách tạo bucket state TRƯỚC KHI chạy terraform init:
#   gcloud storage buckets create gs://kien-terraform-playground-tfstate \
#     --location=asia-southeast1 \
#     --uniform-bucket-level-access
#   gcloud storage buckets update gs://kien-terraform-playground-tfstate \
#     --versioning
#
# Terraform workspace + GCS backend:
# → default workspace:  gs://bucket/quiz-app/default.tfstate
# → dev workspace:      gs://bucket/quiz-app/dev.tfstate
# → prod workspace:     gs://bucket/quiz-app/prod.tfstate
#
# LƯU Ý: backend block KHÔNG nhận variables (khác với resource blocks)
# → bucket name phải hardcode ở đây. Đây là thiết kế của Terraform.
# =============================================================================

terraform {
  backend "gcs" {
    bucket = "kien-terraform-playground-tfstate"
    prefix = "quiz-app"
  }
}
