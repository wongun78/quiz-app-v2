#!/bin/bash

# Configuration
PROJECT_ID="gen-lang-client-0115774747"
REGION="us-central1"
SERVICE_NAME="quiz-frontend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Building Frontend Docker image..."
cd client
gcloud builds submit --tag $IMAGE_NAME .

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3

echo "Frontend deployment complete!"
echo ""
echo "Frontend URL:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'
