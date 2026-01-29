# Deployment Setup Guide

## 🔐 Security First - Environment Configuration

This project uses environment variables for all sensitive data. **Never commit credentials to git!**

### Step 1: Create Your Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env  # or use your favorite editor
```

### Step 2: Fill in Your Configuration

Update `.env` with your Google Cloud project details:

```bash
# Google Cloud Configuration
GCP_PROJECT_ID=your-actual-project-id           # e.g., my-quiz-app-123456
GCP_REGION=us-central1                          # or your preferred region
GCP_ZONE=us-central1-a

# Database Configuration
DB_PRIVATE_IP=                                  # Will be set after running setup-quiz.sh
DB_NAME=quiz_db
DB_USER=quizadmin
DB_PASSWORD=                                    # Generate strong password (min 16 chars)

# Redis Configuration
REDIS_HOST=                                     # Will be set after running setup-quiz.sh
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=                                     # Generate: openssl rand -base64 64

# Cloud Storage
BUCKET_NAME=                                    # e.g., my-quiz-app-123456-frontend

# Backend URL (fill after deploying backend)
BACKEND_URL=                                    # e.g., https://quiz-backend-xxx.run.app
```

### Step 3: Generate Secure Secrets

```bash
# Generate a secure JWT secret
openssl rand -base64 64

# Generate a secure database password
openssl rand -base64 32
```

---

## 🚀 Deployment Steps

### Prerequisites

1. Google Cloud CLI installed: `gcloud --version`
2. Authenticated: `gcloud auth login`
3. Set your project: `gcloud config set project YOUR_PROJECT_ID`
4. Node.js & npm installed (for frontend build)
5. Java 21 & Gradle (for backend build)

### 1. Infrastructure Setup (One-Time)

```bash
chmod +x setup-quiz.sh
./setup-quiz.sh
```

This creates:

- VPC Network
- Cloud SQL (PostgreSQL)
- Redis VM
- VPC Connector
- Firewall rules

**⏱️ Duration:** ~10-15 minutes

After completion, update your `.env` with:

- `DB_PRIVATE_IP` (shown in output)
- `REDIS_HOST` (shown in output)

### 2. Deploy Backend

```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

After deployment, copy the backend URL and update `.env`:

```bash
BACKEND_URL=https://quiz-backend-xxxx.run.app
```

**⏱️ Duration:** ~5-7 minutes

### 3. Deploy Frontend

First, update `client/.env.production` with your backend URL:

```bash
echo "VITE_API_BASE_URL=${BACKEND_URL}" > client/.env.production
```

Then deploy:

```bash
chmod +x deploy-frontend-gcs.sh
./deploy-frontend-gcs.sh
```

**⏱️ Duration:** ~2-3 minutes

---

## ✅ Verification

### Test Backend

```bash
# Health check
curl ${BACKEND_URL}/actuator/health

# Should return: {"status":"UP"}
```

### Test Frontend

Open in browser:

```
https://storage.googleapis.com/${BUCKET_NAME}/index.html
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Google Cloud Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐         ┌──────────────┐              │
│  │   Cloud     │         │  Cloud Run   │              │
│  │   Storage   │────────▶│   Backend    │              │
│  │  (Frontend) │         │ (Spring Boot)│              │
│  └─────────────┘         └──────┬───────┘              │
│                                 │                       │
│                        VPC Connector                    │
│                                 │                       │
│                    ┌────────────┴──────────┐            │
│                    │                       │            │
│             ┌──────▼─────┐         ┌──────▼─────┐      │
│             │ Cloud SQL  │         │  Redis VM  │      │
│             │ PostgreSQL │         │ e2-medium  │      │
│             └────────────┘         └────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Best Practices

1. ✅ **Environment Variables**: All secrets in `.env` (gitignored)
2. ✅ **Private Database**: Cloud SQL with private IP only
3. ✅ **VPC Network**: Isolated network for backend resources
4. ✅ **JWT Authentication**: Secure token-based auth
5. ✅ **HTTPS Only**: All traffic encrypted

### Additional Security (Optional)

```bash
# Enable Cloud Armor (DDoS protection)
gcloud compute security-policies create quiz-security-policy

# Setup budget alerts
gcloud billing budgets create --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="Quiz App Budget" \
  --budget-amount=100
```

---

## 💰 Cost Estimation

**Monthly Cost:** ~$85 USD

| Service        | Configuration | Cost/Month |
| -------------- | ------------- | ---------- |
| Cloud SQL      | db-f1-micro   | ~$25       |
| Redis VM       | e2-medium     | ~$25       |
| Cloud Run      | 512Mi/1CPU    | ~$15       |
| Cloud Storage  | Standard      | ~$1        |
| VPC/Networking | Basic         | ~$19       |

### Cost Optimization Tips

1. Use Cloud Run autoscaling (min-instances=0)
2. Enable Cloud SQL automatic storage increase
3. Setup lifecycle policies for Cloud Storage
4. Use preemptible VMs for non-production Redis

---

## 🛠️ Maintenance

### Update Backend Code

```bash
cd server
# Make your changes
./deploy-backend.sh  # Redeploys with new code
```

### Update Frontend Code

```bash
cd client
# Make your changes
npm run build
gsutil -m rsync -r -d dist gs://${BUCKET_NAME}
```

### Database Backup

```bash
# Create backup
gcloud sql backups create --instance=quiz-sql-db

# List backups
gcloud sql backups list --instance=quiz-sql-db
```

---

## 🚨 Troubleshooting

### Backend Won't Start

```bash
# Check logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=quiz-backend" --limit 50

# Common issues:
# - Wrong DB_PASSWORD in .env
# - DB_PRIVATE_IP incorrect
# - VPC connector not ready
```

### Database Connection Failed

```bash
# Test connection from Redis VM
gcloud compute ssh quiz-redis-vm --zone=${GCP_ZONE} --command="pg_isready -h ${DB_PRIVATE_IP}"

# Reset password
gcloud sql users set-password ${DB_USER} --instance=quiz-sql-db --password=${DB_PASSWORD}
```

### Frontend Shows 404

```bash
# Check bucket permissions
gsutil iam get gs://${BUCKET_NAME}

# Make public
gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}
```

---

## 📚 Additional Resources

- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud SQL Best Practices](https://cloud.google.com/sql/docs/postgres/best-practices)
- [Cloud Storage Hosting](https://cloud.google.com/storage/docs/hosting-static-website)
- Quick Reference: `QUICK-DEPLOY.template.md`

---

## 🔄 CI/CD Integration (Future)

You can integrate these scripts with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GCP
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
      - name: Deploy
        env:
          GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: ./deploy-backend.sh
```

---

**Need Help?** Check the troubleshooting section or contact your team lead.
