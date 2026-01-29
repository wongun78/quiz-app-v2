#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and fill in your configuration"
    exit 1
fi

PROJECT_ID="${GCP_PROJECT_ID}"
BUCKET_NAME="${BUCKET_NAME:-${PROJECT_ID}-frontend}"
BACKEND_URL="${BACKEND_URL}"

echo "Building Frontend..."
cd client
npm run build

echo "Creating Cloud Storage bucket..."
gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME 2>/dev/null || echo "Bucket already exists"

echo "Uploading files to bucket..."
gsutil -m rsync -r -d dist gs://$BUCKET_NAME

echo "Making bucket public..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

echo "Setting website configuration..."
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME

echo "Frontend deployed!"
echo ""
echo "Frontend URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo ""
echo "Next step - Update CORS:"
echo "gcloud run services update quiz-backend --region=us-central1 --set-env-vars=\"CORS_ALLOWED_ORIGINS=https://storage.googleapis.com,http://localhost:3000,http://localhost:5173\""
