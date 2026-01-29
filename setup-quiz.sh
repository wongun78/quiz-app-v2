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
REDIS_VM="quiz-redis-vm"

echo "BẮT ĐẦU TRIỂN KHAI CHO PROJECT: $PROJECT_ID"

echo "--- Enabling APIs ---"
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  vpcaccess.googleapis.com \
  compute.googleapis.com \
  servicenetworking.googleapis.com

echo "--- Creating VPC Network ---"
gcloud compute networks create $VPC_NAME \
  --subnet-mode=custom

gcloud compute networks subnets create $SUBNET_NAME \
  --network=$VPC_NAME \
  --range=10.0.0.0/24 \
  --region=$REGION

echo "--- Creating VPC Access Connector (Mất khoảng 2-3 phút) ---"
gcloud compute networks vpc-access connectors create $CONNECTOR_NAME \
  --region=$REGION \
  --subnet-project=$PROJECT_ID \
  --subnet=$SUBNET_NAME \
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
  --cpu=1 \
  --memory=3840MiB \
  --region=$REGION \
  --root-password=${DB_PASSWORD} \
  --network=projects/$PROJECT_ID/global/networks/$VPC_NAME \
  --no-assign-ip

echo "--- Creating Redis VM ---"
gcloud compute instances create $REDIS_VM \
  --zone=$REGION-a \
  --machine-type=e2-medium \
  --network=$VPC_NAME \
  --subnet=$SUBNET_NAME \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=redis-server

echo "--- Creating Firewall Rules ---"
gcloud compute firewall-rules create allow-redis-internal \
  --network=$VPC_NAME \
  --allow=tcp:6379 \
  --source-ranges=10.0.0.0/24 \
  --target-tags=redis-server

echo "HOÀN TẤT! HỆ THỐNG ĐÃ SẴN SÀNG."
