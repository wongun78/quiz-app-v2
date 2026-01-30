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
REGION="${GCP_REGION:-asia-southeast1}"
SERVICE_NAME="quiz-frontend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Get backend URL (or use from env)
BACKEND_URL="${BACKEND_URL:-https://quiz-backend-819085766724.asia-southeast1.run.app}"
API_BASE_URL="${BACKEND_URL}/api/v1"

echo "Building Frontend Docker image with API URL: $API_BASE_URL"
cd client

# Create temporary cloudbuild.yaml
cat > cloudbuild.yaml <<EOF
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'VITE_API_BASE_URL=${API_BASE_URL}'
      - '-t'
      - '${IMAGE_NAME}:latest'
      - '.'
images:
  - '${IMAGE_NAME}:latest'
EOF

gcloud builds submit --config=cloudbuild.yaml .

# Cleanup
rm cloudbuild.yaml

echo "Deploying to Cloud Run (1 vCPU, 1Gi, min-instances=1)..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 3

echo "Frontend deployment complete!"
echo ""
echo "Frontend URL:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'
