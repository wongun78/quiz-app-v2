# Dev environment tfvars
# Dùng với: terraform workspace select dev && terraform apply -var-file=environments/dev/terraform.tfvars

project_id     = "kien-terraform-playground"
project_number = "7102516370"
region         = "asia-southeast1"
app_name       = "quiz"
github_repo    = "wongun78/quiz-app-v2"

backend_image  = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/backend:latest"
frontend_image = "asia-southeast1-docker.pkg.dev/kien-terraform-playground/quiz-repo/frontend:latest"

# Điền sau khi có frontend URL
cors_allowed_origins = ""

# NOTE: sensitive vars (db_password, jwt_secret, etc.) KHÔNG điền ở đây
# Dùng: terraform apply -var="db_password=$DB_PASSWORD" hoặc TF_VAR_* env vars
