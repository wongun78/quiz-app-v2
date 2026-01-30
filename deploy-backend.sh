#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your configuration"
    exit 1
fi

# Configuration
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="quiz-backend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Database info (from .env - non-sensitive)
DB_PRIVATE_IP="${DB_PRIVATE_IP}"
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"

# Redis info (from .env)
REDIS_HOST="${REDIS_HOST}"
REDIS_PORT="${REDIS_PORT}"

# CORS
CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS}"

echo "Building Docker image..."
cd server
gcloud builds submit --tag $IMAGE_NAME .

echo "Deploying to Cloud Run with Secret Manager..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --vpc-connector quiz-connector \
  --vpc-egress private-ranges-only \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "DB_URL=jdbc:postgresql://${DB_PRIVATE_IP}:5432/${DB_NAME}" \
  --set-env-vars "DB_USERNAME=${DB_USER}" \
  --set-env-vars "REDIS_HOST=${REDIS_HOST}" \
  --set-env-vars "REDIS_PORT=${REDIS_PORT}" \
  --set-env-vars "SPRING_PROFILES_ACTIVE=prod" \
  --set-env-vars "DATA_INIT_ENABLED=true" \
  --set-env-vars "CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}" \
  --set-secrets "DB_PASSWORD=db-password:latest" \
  --set-secrets "JWT_SECRET=jwt-secret:latest" \
  --set-secrets "ADMIN_PASSWORD=admin-password:latest" \
  --set-secrets "USER_PASSWORD=user-password:latest"

echo ""
echo "Deployment complete!"
echo "Secrets loaded from Secret Manager (not from .env)"
echo ""
echo "Backend URL:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'
