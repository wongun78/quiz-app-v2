#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your configuration"
    exit 1
fi

PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
VPC_NAME="quiz-vpc"
SUBNET_NAME="quiz-subnet"
CONNECTOR_NAME="quiz-connector"
SQL_INSTANCE="quiz-sql-db"

echo "BẮT ĐẦU TRIỂN KHAI CHO PROJECT: $PROJECT_ID"

echo "--- Enabling APIs ---"
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  vpcaccess.googleapis.com \
  compute.googleapis.com \
  servicenetworking.googleapis.com \
  secretmanager.googleapis.com

echo "--- Creating Secrets in Secret Manager ---"
# Generate strong JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
  echo "Generated new JWT_SECRET"
fi

# Generate strong admin password if not provided
if [ -z "$ADMIN_PASSWORD" ]; then
  ADMIN_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')
  echo "Generated new ADMIN_PASSWORD"
fi

# Generate strong user password if not provided
if [ -z "$USER_PASSWORD" ]; then
  USER_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')
  echo "Generated new USER_PASSWORD"
fi

# Create secrets in Secret Manager
echo "Creating DB_PASSWORD secret..."
echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=- --replication-policy=automatic 2>/dev/null || \
  echo -n "$DB_PASSWORD" | gcloud secrets versions add db-password --data-file=-

echo "Creating JWT_SECRET secret..."
echo -n "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=- --replication-policy=automatic 2>/dev/null || \
  echo -n "$JWT_SECRET" | gcloud secrets versions add jwt-secret --data-file=-

echo "Creating ADMIN_PASSWORD secret..."
echo -n "$ADMIN_PASSWORD" | gcloud secrets create admin-password --data-file=- --replication-policy=automatic 2>/dev/null || \
  echo -n "$ADMIN_PASSWORD" | gcloud secrets versions add admin-password --data-file=-

echo "Creating USER_PASSWORD secret..."
echo -n "$USER_PASSWORD" | gcloud secrets create user-password --data-file=- --replication-policy=automatic 2>/dev/null || \
  echo -n "$USER_PASSWORD" | gcloud secrets versions add user-password --data-file=-

# Grant Cloud Run service account access to secrets
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding db-password \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --quiet
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --quiet
gcloud secrets add-iam-policy-binding admin-password \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --quiet
gcloud secrets add-iam-policy-binding user-password \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --quiet

echo "Secrets created and IAM bindings configured"

echo "--- Creating VPC Network ---"
gcloud compute networks create $VPC_NAME \
  --subnet-mode=custom

# Main subnet for general resources
gcloud compute networks subnets create $SUBNET_NAME \
  --network=$VPC_NAME \
  --range=10.0.0.0/24 \
  --region=$REGION

# Dedicated /28 subnet for VPC Connector (required)
gcloud compute networks subnets create $CONNECTOR_NAME-subnet \
  --network=$VPC_NAME \
  --range=10.8.0.0/28 \
  --region=$REGION

echo "--- Creating VPC Access Connector (Mất khoảng 2-3 phút) ---"
gcloud compute networks vpc-access connectors create $CONNECTOR_NAME \
  --region=$REGION \
  --subnet-project=$PROJECT_ID \
  --subnet=$CONNECTOR_NAME-subnet \
  --min-instances=2 \
  --max-instances=3 \
  --machine-type=e2-micro

echo "--- Configuring Private IP Range ---"
gcloud compute addresses create google-managed-services-$VPC_NAME \
  --global \
  --purpose=VPC_PEERING \
  --prefix-length=16 \
  --description="Peering for Google Managed Services" \
  --network=$VPC_NAME

gcloud services vpc-peerings connect \
  --service=servicenetworking.googleapis.com \
  --ranges=google-managed-services-$VPC_NAME \
  --network=$VPC_NAME

echo "--- Creating Cloud SQL Instance (Mất khoảng 5-10 phút) ---"
gcloud sql instances create $SQL_INSTANCE \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --root-password=${DB_PASSWORD} \
  --network=projects/$PROJECT_ID/global/networks/$VPC_NAME \
  --no-assign-ip

echo "--- Creating Redis Memorystore (Managed Service, mất khoảng 3-5 phút) ---"
gcloud redis instances create quiz-redis \
  --size=1 \
  --region=$REGION \
  --tier=basic \
  --network=projects/$PROJECT_ID/global/networks/$VPC_NAME

echo "--- Lấy Cloud SQL Private IP ---"
DB_PRIVATE_IP=$(gcloud sql instances describe $SQL_INSTANCE \
  --format="value(ipAddresses[0].ipAddress)")

echo "--- Lấy Redis Host IP ---"
REDIS_HOST=$(gcloud redis instances describe quiz-redis \
  --region=$REGION \
  --format="value(host)")

echo ""
echo "=== AUTO-UPDATE .env FILE ==="
echo "" >> .env
echo "# Auto-generated from setup-quiz.sh ($(date))" >> .env
echo "DB_PRIVATE_IP=$DB_PRIVATE_IP" >> .env
echo "REDIS_HOST=$REDIS_HOST" >> .env
echo "REDIS_PORT=6379" >> .env

echo "Cloud SQL Private IP: $DB_PRIVATE_IP"
echo "Redis Memorystore IP: $REDIS_HOST"
echo "Đã tự động cập nhật vào file .env"
echo ""
echo "HOÀN TẤT! HỆ THỐNG ĐÃ SẴN SÀNG."
