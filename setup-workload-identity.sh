#!/bin/bash

PROJECT_ID="${GCP_PROJECT_ID}"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
REGION="${GCP_REGION:-asia-southeast1}"
SA_NAME="github-actions-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
POOL_NAME="github-pool"
POOL_ID="${POOL_NAME}"
PROVIDER_NAME="github-provider"
PROVIDER_ID="${PROVIDER_NAME}"
GITHUB_REPO="wongun78/quiz-app-v2"

echo "Enabling APIs..."
gcloud services enable \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  sts.googleapis.com

echo "Creating Service Account..."
gcloud iam service-accounts create "$SA_NAME" \
  --display-name="GitHub Actions Service Account" \
  --description="Service Account for GitHub Actions CI/CD" \
  2>/dev/null || true

echo "Granting permissions..."

# Cloud Run permissions
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin" \
  --condition=None

# Cloud Build permissions
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudbuild.builds.editor" \
  --condition=None

# Storage permissions (for Container Registry)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin" \
  --condition=None

# Service Account User (để deploy Cloud Run)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None

# Viewer (để describe services)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/viewer" \
  --condition=None

# ============================================
# 4. Create Workload Identity Pool
# ============================================

echo "Creating Workload Identity Pool: $POOL_NAME"
gcloud iam workload-identity-pools create "$POOL_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  --description="Workload Identity Pool for GitHub Actions" \
  2>/dev/null || echo "Pool already exists"

# ============================================
# 5. Create Workload Identity Provider (GitHub)
# ============================================

echo "Creating Workload Identity Provider: $PROVIDER_NAME"
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository=='${GITHUB_REPO}'" \
  2>/dev/null || echo "Provider already exists"

# ============================================
# 6. Allow GitHub to impersonate Service Account
# ============================================

echo "Allowing GitHub to impersonate Service Account..."
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${GITHUB_REPO}"

# ============================================
# 7. Get values for GitHub Secrets
# ============================================

echo ""
echo "Setup complete!"
echo ""
echo "============================================"
echo "ADD THESE TO GITHUB SECRETS"
echo "============================================"
echo ""
echo "Go to: https://github.com/${GITHUB_REPO}/settings/secrets/actions"
echo ""
echo "1️GCP_PROJECT_ID:"
echo "$PROJECT_ID"
echo ""
echo "2️WIF_PROVIDER:"
echo "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"
echo ""
echo "3️WIF_SERVICE_ACCOUNT:"
echo "$SA_EMAIL"
echo ""
echo "============================================"
echo "NON-SENSITIVE CONFIGS (cũng add vào Secrets)"
echo "============================================"
echo ""
echo "4️⃣ DB_PRIVATE_IP:"
grep "^DB_PRIVATE_IP=" .env | cut -d'=' -f2 || echo "(run setup-quiz.sh first)"
echo ""
echo "5️⃣ DB_NAME:"
echo "quiz_db"
echo ""
echo "6️⃣ DB_USER:"
echo "quizadmin"
echo ""
echo "7️⃣ REDIS_HOST:"
grep "^REDIS_HOST=" .env | cut -d'=' -f2 || echo "(run setup-quiz.sh first)"
echo ""
echo "8️⃣ CORS_ALLOWED_ORIGINS:"
grep "^FRONTEND_URL=" .env | cut -d'=' -f2 || echo "https://quiz-frontend-819085766724.asia-southeast1.run.app"
echo ""
echo "============================================"
echo "SENSITIVE PASSWORDS (for reference only)"
echo "============================================"
echo ""
echo "ADMIN_PASSWORD (from Secret Manager):"
gcloud secrets versions access latest --secret=admin-password 2>/dev/null || echo "(not created yet)"
echo ""
echo "USER_PASSWORD (from Secret Manager):"
gcloud secrets versions access latest --secret=user-password 2>/dev/null || echo "(not created yet)"
echo ""
echo "Sau khi add secrets → push code → GitHub Actions sẽ tự động deploy!"