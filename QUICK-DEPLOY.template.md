# Quiz App - Quick Deploy Reference

> **⚠️ IMPORTANT**: Copy `.env.example` to `.env` and fill in your actual values before running any scripts!

## One-Command Deploy

### Full Fresh Deployment

```bash
# 0. Setup environment (FIRST TIME ONLY)
cp .env.example .env
# Edit .env with your actual values

# 1. Setup infrastructure (one-time)
./setup-quiz.sh

# 2. Deploy backend
./deploy-backend.sh

# 3. Deploy frontend
./deploy-frontend-gcs.sh
```

### Update Existing Deployment

**Backend only:**

```bash
./deploy-backend.sh
```

**Frontend only:**

```bash
cd client && npm run build
gsutil -m rsync -r -d dist gs://${BUCKET_NAME}
gsutil cp dist/index.html gs://${BUCKET_NAME}/index.html
```

---

## 📋 Essential URLs

| Service          | URL                                                         |
| ---------------- | ----------------------------------------------------------- |
| **Frontend**     | https://storage.googleapis.com/${BUCKET_NAME}/index.html    |
| **Backend API**  | ${BACKEND_URL}                                              |
| **Health Check** | ${BACKEND_URL}/actuator/health                              |
| **GCP Console**  | https://console.cloud.google.com/?project=${GCP_PROJECT_ID} |

---

## Environment Variables

All sensitive configuration is in `.env` file (NOT committed to git):

```bash
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
DB_PRIVATE_IP=your-db-ip
DB_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
BUCKET_NAME=your-bucket-name
BACKEND_URL=your-backend-url
```

---

## Common Tasks

### View Backend Logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=quiz-backend" --limit 20 --project ${GCP_PROJECT_ID}
```

### Query Database

```bash
gcloud compute ssh quiz-redis-vm --zone=${GCP_ZONE} --project=${GCP_PROJECT_ID} --command="PGPASSWORD='${DB_PASSWORD}' psql -h ${DB_PRIVATE_IP} -U ${DB_USER} -d ${DB_NAME} -c 'SELECT * FROM users;'"
```

### Update Environment Variable

```bash
gcloud run services update quiz-backend --region ${GCP_REGION} --update-env-vars "KEY=VALUE" --project ${GCP_PROJECT_ID}
```

### Force Frontend Cache Refresh

```bash
gsutil setmeta -h "Cache-Control:no-cache, no-store, must-revalidate" gs://${BUCKET_NAME}/index.html
```

---

## Emergency Fixes

### Backend 500 Error

```bash
# Check logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=quiz-backend AND severity>=ERROR" --limit 10 --project ${GCP_PROJECT_ID}

# Restart service
gcloud run services update quiz-backend --region ${GCP_REGION} --project ${GCP_PROJECT_ID}
```

### Frontend Not Loading

```bash
# Rebuild and redeploy
cd client
npm run build
gsutil -m rsync -r -d dist gs://${BUCKET_NAME}
gsutil cp dist/index.html gs://${BUCKET_NAME}/index.html
```

### Database Connection Issues

```bash
# Reset DB password
gcloud sql users set-password ${DB_USER} --instance=quiz-sql-db --password=${DB_PASSWORD} --project ${GCP_PROJECT_ID}

# Update Cloud Run env
gcloud run services update quiz-backend --region ${GCP_REGION} --update-env-vars "DB_PASSWORD=${DB_PASSWORD}" --project ${GCP_PROJECT_ID}
```

---

## Cost Monitoring

```bash
# View current month costs
gcloud billing accounts list
gcloud beta billing projects describe ${GCP_PROJECT_ID}
```

**Estimated Monthly Cost:** ~$85/month

- Cloud SQL (db-f1-micro): ~$25
- Redis VM (e2-medium): ~$25
- Cloud Run: ~$15
- Cloud Storage: ~$1
- VPC/Networking: ~$19

---

## Security Notes

1. **Never commit `.env` file** - Already in .gitignore
2. **Rotate JWT_SECRET regularly** - Update in .env and redeploy
3. **Use strong DB passwords** - Min 16 characters
4. **Enable Cloud Armor** (optional) - DDoS protection
5. **Setup budget alerts** - Prevent unexpected costs

---

## Resources

- Deployment Guide: See `DEPLOYMENT-GUIDE.md`
- Production Summary: See `PRODUCTION-SUMMARY.md`
- Backend API: Cloud Run service
- Frontend: Cloud Storage bucket
