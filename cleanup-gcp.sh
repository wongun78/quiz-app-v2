#!/bin/bash

PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-asia-southeast1}"

echo "WARNING: This will delete ALL GCP resources for quiz-app-v2"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""
read -p "Are you sure? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Starting cleanup..."

# 1. Delete Cloud Run services
echo "Deleting Cloud Run services..."
gcloud run services delete quiz-backend --region=$REGION --quiet 2>/dev/null || true
gcloud run services delete quiz-frontend --region=$REGION --quiet 2>/dev/null || true

# 2. Delete Redis Memorystore
echo "Deleting Redis Memorystore (takes 2-3 min)..."
gcloud redis instances delete quiz-redis --region=$REGION --quiet 2>/dev/null || true

# 3. Delete Cloud SQL instance
echo "Deleting Cloud SQL (takes 5-10 min)..."
gcloud sql instances delete quiz-sql-db --quiet 2>/dev/null || true

# 4. Delete VPC Connector
echo "Deleting VPC Connector..."
gcloud compute networks vpc-access connectors delete quiz-connector --region=$REGION --quiet 2>/dev/null || true

# 5. Delete VPC Peering
echo "Removing VPC Peering..."
gcloud services vpc-peerings delete --service=servicenetworking.googleapis.com --network=quiz-vpc --quiet 2>/dev/null || true

# 6. Delete reserved IP address
echo "Deleting reserved IP..."
gcloud compute addresses delete google-managed-services-quiz-vpc --global --quiet 2>/dev/null || true

# 7. Delete subnets
echo "Deleting subnets..."
gcloud compute networks subnets delete quiz-subnet --region=$REGION --quiet 2>/dev/null || true
gcloud compute networks subnets delete quiz-connector-subnet --region=$REGION --quiet 2>/dev/null || true

# 8. Delete VPC network
echo "Deleting VPC network..."
gcloud compute networks delete quiz-vpc --quiet 2>/dev/null || true

# 9. Delete secrets from Secret Manager
echo "Deleting secrets..."
gcloud secrets delete db-password --quiet 2>/dev/null || true
gcloud secrets delete jwt-secret --quiet 2>/dev/null || true
gcloud secrets delete admin-password --quiet 2>/dev/null || true
gcloud secrets delete user-password --quiet 2>/dev/null || true

# 10. Delete GitHub Actions service account (optional)
echo "Deleting GitHub Actions Service Account..."
SA_EMAIL="github-actions-sa@${PROJECT_ID}.iam.gserviceaccount.com"
gcloud iam service-accounts delete $SA_EMAIL --quiet 2>/dev/null || true

# 11. Delete Workload Identity Pool (optional)
echo "Deleting Workload Identity Pool..."
gcloud iam workload-identity-pools delete github-pool --location=global --quiet 2>/dev/null || true

echo ""
echo "Cleanup complete!"
echo ""
echo "Remaining resources to check manually:"
echo "- Container images in GCR: gcr.io/$PROJECT_ID"
echo "- Cloud Build logs"
echo "- Cloud Storage buckets"
echo ""
echo "View remaining resources:"
echo "  gcloud run services list --region=$REGION"
echo "  gcloud sql instances list"
echo "  gcloud redis instances list --region=$REGION"
echo "  gcloud compute networks list"
