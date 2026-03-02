# Prod environment tfvars
# Dùng với: terraform workspace select prod && terraform apply -var-file=environments/prod/terraform.tfvars
#
# Khác dev:
# - Có thể dùng project khác (nếu có multi-project setup)
# - Cloud SQL tier cao hơn (db-g1-small, db-n1-standard-1)
# - Redis HA tier: STANDARD_HA
# - min-instances > 0 để tránh cold start
# - deletion_protection = true

project_id     = "kien-terraform-playground"
project_number = "7102516370"
region         = "asia-southeast1"
app_name       = "quiz"
github_repo    = "wongun78/quiz-app-v2"

backend_image  = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/backend:latest"
frontend_image = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/frontend:latest"

cors_allowed_origins = ""

# NOTE: sensitive vars — dùng TF_VAR_* hoặc -var trong CI/CD
