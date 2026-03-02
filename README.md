# Quiz App v2

Full-stack quiz platform. Spring Boot 4 backend + React 19 frontend, deployed on GCP via Terraform + GitHub Actions.

**Live:** https://quiz-frontend-4rbzhybdxq-as.a.run.app

---

## Stack

| Layer              | Tech                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| Backend            | Java 21, Spring Boot 4.0.2, Spring Security 6, Gradle                                |
| Frontend           | React 19.2, TypeScript 5.9, Vite (rolldown) 7.2                                      |
| Database           | PostgreSQL 16 (Cloud SQL private IP)                                                 |
| Cache / Rate limit | Redis 7, Lettuce, Redisson, Bucket4j                                                 |
| Auth               | JWT (24h access + 7d refresh) + BCrypt                                               |
| Infra              | GCP: Cloud Run, Cloud SQL, Memorystore Redis, VPC, Secret Manager, Artifact Registry |
| IaC                | Terraform 1.9 — 7 modules, GCS remote state                                          |
| CI/CD              | GitHub Actions + Workload Identity Federation (keyless)                              |

---

## Architecture

```
GitHub Actions (CI/CD)
  ├─ backend.yml  → test → build image → push AR → deploy Cloud Run
  ├─ frontend.yml → lint/typecheck → build image → push AR → deploy Cloud Run → update CORS
  └─ terraform.yml → validate → plan → apply (main only)

Cloud Run (asia-southeast1)
  ├─ quiz-backend  (Spring Boot, port 8080, scale 0–3)
  └─ quiz-frontend (Nginx, port 8080, scale 0–2)
        └─ VPC Connector ──► VPC quiz-vpc
                            ├─ Cloud SQL postgres (private IP)
                            └─ Memorystore Redis (private IP)

Secret Manager ──► mounted as env vars on backend at runtime
  db-password | jwt-secret | admin-password | user-password
```

---

## Local Development

```bash
# Start Postgres + Redis + Backend
cp .env.example .env   # fill in passwords
docker-compose up -d

# Frontend (separate terminal)
cd client && npm install && npm run dev
```

| Service     | URL                                   |
| ----------- | ------------------------------------- |
| Frontend    | http://localhost:5173                 |
| Backend API | http://localhost:8080                 |
| Swagger UI  | http://localhost:8080/swagger-ui.html |
| Health      | http://localhost:8080/actuator/health |

**Test accounts** (set via `ADMIN_PASSWORD` / `USER_PASSWORD` env vars):

- Admin: `rex@dinoquiz.academy`
- User: `veloci@dinoquiz.academy`

---

## Project Structure

```
├─ client/             React 19 + TypeScript + Vite
├─ server/             Spring Boot 4 + Java 21
├─ terraform/          IaC — 7 modules (networking, iam, database, redis, secrets, artifact_registry, cloud_run)
├─ .github/workflows/  backend.yml │ frontend.yml │ terraform.yml
├─ docker-compose.yml  Local dev (postgres + redis + backend)
├─ deploy.sh           Manual GCP deploy (step-by-step gcloud)
├─ setup-terraform.sh  One-time: create GCS state bucket + grant SA roles
└─ setup-workload-identity.sh  One-time: create WIF pool/provider
```

---

## CI/CD

Three independent workflows, each triggered by path filter:

```
server/**          → backend.yml
client/**          → frontend.yml
terraform/**       → terraform.yml
```

All use **Workload Identity Federation** — no JSON keys stored anywhere.

**backend.yml:** `test` (Postgres+Redis service containers) → `build-and-deploy` (Docker Buildx, push to AR, gcloud run deploy)

**frontend.yml:** `lint+typecheck+build-validation` → `build-and-deploy` (bakes `VITE_API_BASE_URL` from live backend URL, updates CORS on backend after deploy)

**terraform.yml:** `validate` → `plan` (on any push/PR) → `apply` (main push only, requires `needs.plan.result == 'success'`)

**GitHub Secrets required:**

```
GCP_PROJECT_ID          kien-terraform-playground
WIF_PROVIDER            projects/7102516370/.../providers/github-provider
WIF_SERVICE_ACCOUNT     quiz-run-sa@kien-terraform-playground.iam.gserviceaccount.com
TF_VAR_DB_PASSWORD      ...
TF_VAR_JWT_SECRET       ...
TF_VAR_ADMIN_PASSWORD   ...
TF_VAR_USER_PASSWORD    ...
```

---

## Terraform

Remote state in GCS (`kien-terraform-playground-tfstate`). Run once before using CI:

```bash
./setup-terraform.sh         # create bucket + grant SA roles
cd terraform
terraform init
./import.sh                  # import existing GCP resources into state
terraform plan -var-file=environments/dev/terraform.tfvars
```

Modules: `networking` → `iam` → `database` → `redis` → `secrets` → `artifact_registry` → `cloud_run`

---

## Deployment (manual)

```bash
cp .env.example .env   # fill in credentials
./deploy.sh setup      # enable GCP APIs
./deploy.sh registry   # Artifact Registry
./deploy.sh network    # VPC + Connector
./deploy.sh database   # Cloud SQL (~15 min)
./deploy.sh redis      # Memorystore (~5 min)
./deploy.sh secrets    # Secret Manager + SA + IAM
./deploy.sh build      # Docker build + push
./deploy.sh deploy     # Cloud Run deploy
./deploy.sh status     # check all resources
```

---

## Estimated Cost (GCP, dev)

| Resource              | ~USD/month |
| --------------------- | ---------- |
| Cloud SQL db-f1-micro | $15        |
| Memorystore Redis 1GB | $25        |
| VPC Connector         | $9         |
| Cloud Run             | $9         |
| **Total**             | **~$58**   |
