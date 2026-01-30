# Quiz Application - Full-Stack Learning Platform

> **Production-Ready Quiz Application** - Spring Boot 4.0 + React 19 + TypeScript - Deployed on Google Cloud Platform

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.2-6DB33F?logo=springboot)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Java](https://img.shields.io/badge/Java-21-orange?logo=oracle)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![GCP](https://img.shields.io/badge/GCP-Ready-4285F4?logo=googlecloud)

## About Quiz Application

**Quiz Application** is a modern, production-ready full-stack platform for creating, managing, and taking quizzes. Built with enterprise-grade architecture, it features advanced security, caching, and scalability for educational institutions and organizations.

### Key Features

**Security & Performance**

- JWT Authentication with automatic token refresh (24h access + 7d refresh tokens)
- Role-Based Access Control (RBAC) with ROLE_USER and ROLE_ADMIN
- Rate Limiting (50 req/min for auth, 200 req/min for API) using Bucket4j + Redis
- Redis Caching - 65% faster response times (7ms avg with cache vs 20ms without)
- BCrypt password hashing with Spring Security 6

**Application Features**

- Complete Quiz CRUD operations with question management
- Automatic exam scoring with detailed results
- User management with pagination and search
- Real-time cache invalidation and updates
- Comprehensive API documentation with Swagger/OpenAPI

**Modern Architecture**

- Monorepo structure with Docker support
- RESTful API with 32 endpoints
- Responsive UI built with Tailwind CSS 4 and shadcn/ui
- Production deployment on Google Cloud Platform (Cloud Run, Cloud SQL, Redis Memorystore)
- Secrets management with Google Cloud Secret Manager
- CI/CD ready with comprehensive testing scripts

## Project Structure

```
quiz-app-v2/
├── client/                        # Frontend - React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/            # UI components (100+ components)
│   │   ├── pages/                 # Page components (14 pages)
│   │   ├── contexts/              # React Context (Auth, Theme)
│   │   ├── hooks/                 # Custom hooks (usePermission, useQuiz, etc.)
│   │   ├── services/              # API services
│   │   ├── types/                 # TypeScript definitions
│   │   └── validations/           # Zod schemas
│   ├── package.json
│   ├── Dockerfile                 # Production Docker image
│   └── README.md
│
├── server/                        # Backend - Spring Boot 4.0 + Java 21
│   ├── src/main/java/fpt/kiennt169/springboot/
│   │   ├── config/                # Security, Redis, Cache, Rate Limiting
│   │   ├── controllers/           # REST Controllers (6)
│   │   ├── services/              # Business Logic (17 services)
│   │   ├── entities/              # JPA Entities (8)
│   │   ├── repositories/          # Spring Data JPA
│   │   ├── dtos/                  # Data Transfer Objects
│   │   └── filter/                # JWT, Rate Limiting filters
│   ├── build.gradle.kts
│   ├── Dockerfile
│   ├── test-*.sh                  # Testing scripts
│   └── README.md
│
├── docker-compose.yml             # Local development (Postgres + Redis + Backend)
├── setup-quiz.sh                  # GCP infrastructure setup with Secret Manager
├── deploy-backend.sh              # Deploy backend to Cloud Run
├── deploy-frontend.sh             # Deploy frontend to Cloud Run
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Requirements

**For Local Development:**

- Docker Desktop (recommended for easiest setup)
- OR manually install:
  - Node.js 20+
  - JDK 21
  - PostgreSQL 16
  - Redis 7

**For Production Deployment:**

- Google Cloud Platform account
- gcloud CLI installed
- Docker (for building images)

---

### Option 1: Run with Docker (Recommended)

Automatically starts PostgreSQL, Redis, and Backend in containers.

```bash
# 1. Clone repository
git clone <your-repo-url>
cd quiz-app-v2

# 2. Create environment file
cp .env.example .env
# Edit .env with your configuration

# 3. Start all services
docker-compose up -d

# 4. Check logs
docker-compose logs -f backend

# 5. Verify services are running
curl http://localhost:8080/actuator/health
```

**Services:**

- PostgreSQL: `localhost:5432` (user: postgres, db: quiz_db)
- Redis: `localhost:6379`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

**Stop all services:**

```bash
docker-compose down
# Or with data cleanup:
docker-compose down -v
```

---

### Option 2: Manual Setup (Development)

#### Step 1: Start Database & Redis

```bash
# Start PostgreSQL and Redis only
docker-compose up -d postgres redis

# OR install locally:
# PostgreSQL: createdb quiz_db
# Redis: redis-server
```

#### Step 2: Run Backend (Spring Boot)

```bash
cd server

# Copy environment template
cp .env.example .env
# Edit .env with your database credentials

# Run with Gradle
./gradlew bootRun

# OR build JAR and run
./gradlew bootJar
java -jar build/libs/quiz-app-*.jar
```

**Backend is running at:**

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health Check: `http://localhost:8080/actuator/health`

#### Step 3: Run Frontend (React + Vite)

```bash
cd client

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8080" > .env

# Start development server
npm run dev
```

**Frontend is running at:** `http://localhost:5173`

---

## Documentation

### Comprehensive Analysis

For detailed technical analysis, see: [PROJECT-ANALYSIS.md](PROJECT-ANALYSIS.md)

**Includes:**

- Complete architecture overview
- Security implementation details
- Performance metrics (caching, rate limiting)
- Deployment infrastructure
- Technology comparisons
- Improvement recommendations

### Backend (Spring Boot)

Detailed documentation: [server/README.md](server/README.md)

**Key Features:**

- 32 REST API endpoints with JWT authentication
- Redis caching (65% performance improvement)
- Rate limiting with Bucket4j + Redisson (50/200 req/min)
- Role-based access control (RBAC)
- Automatic token refresh mechanism
- Swagger/OpenAPI 3.0 documentation
- MapStruct for DTO mapping
- Bean Validation with i18n messages
- Global exception handling

### Frontend (React + TypeScript)

Detailed documentation: [client/README.md](client/README.md)

**Key Features:**

- React 19.2.0 with TypeScript 5.9.3
- TanStack Query v5 for server state management
- React Context for auth and theme
- Tailwind CSS 4.1.17 + shadcn/ui components
- 14 pages with lazy loading
- Protected routes with role checking
- Form validation with React Hook Form + Zod
- Axios interceptors with token refresh mutex
- Responsive design with mobile support

### Deployment

Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

**Infrastructure:**

- Google Cloud Platform (GCP) setup
- Cloud Run for frontend and backend (autoscaling 0-10 instances)
- Cloud SQL for PostgreSQL (db-f1-micro, private IP)
- Redis Memorystore (1GB BASIC tier, managed service)
- VPC networking with private connectivity (VPC Connector)
- Secret Manager for secure credential storage
- Estimated cost: ~$58/month (51% reduction from initial setup)

---

## Testing

### API Testing

**Postman Collection:**

```bash
# Import collection from:
server/postman/Quiz-API-Collection.json
```

**Swagger UI:**

```
http://localhost:8080/swagger-ui.html
```

**Automated Test Scripts:**

```bash
cd server

# Test all APIs (27 test cases)
./test-all-apis.sh

# Test specific flows
./test-registration.sh      # User registration flow
./test-student-flow.sh       # Student endpoints (9 tests)
./test-admin-flow.sh         # Admin endpoints (12 tests)

# Performance testing
./test-caching.sh            # Cache performance
cd performance-tests
node test-rate-limit.js      # Rate limiting
node test-token-refresh.js   # Token refresh flow
```

**Test Accounts:**

```
Admin:
  Email: admin@example.com
  Password: admin123

User:
  Email: user@example.com
  Password: user123
```

**Performance Results:**

- With Redis cache: ~7ms average response time
- Without cache: ~20ms average response time
- Improvement: 65% faster
- Throughput: 135+ requests/second

---

## Available Scripts

### Backend

```bash
cd server

# Development
./gradlew bootRun                 # Run application
./gradlew build                   # Build project
./gradlew test                    # Run tests
./gradlew clean build             # Clean build

# Database
./reset-db.sh                     # Reset database

# Testing
./test-all-apis.sh                # Test all endpoints
./quick-start.sh                  # Reset + Start + Test

# Docker
docker build -t quiz-backend .
docker run -p 8080:8080 quiz-backend
```

### Frontend

```bash
cd client

# Development
npm run dev                       # Start dev server
npm run build                     # Build for production
npm run preview                   # Preview production build

# Code Quality
npm run lint                      # ESLint
npm run type-check                # TypeScript check
npm run test                      # Vitest tests
npm run test:ui                   # Vitest UI

# Docker
docker build -t quiz-frontend .
```

### Deployment (GCP)

```bash
# One-time infrastructure setup
./setup-quiz.sh                   # Create GCP resources + Secret Manager

# Deploy services
./deploy-backend.sh               # Deploy backend to Cloud Run
./deploy-frontend.sh              # Deploy frontend to Cloud Run

# Cleanup
./cleanup.sh                      # Clean build artifacts
```

---

## Deployment

### Google Cloud Platform (Recommended)

**Prerequisites:**

```bash
# Install gcloud CLI
# Authenticate with GCP
gcloud auth login

# Create .env file with credentials
cp .env.example .env
# Edit .env with your GCP project details
```

**Infrastructure Setup (One-time):**

```bash
# Create VPC, Cloud SQL, Redis Memorystore, VPC Connector, Secret Manager
./setup-quiz.sh
# Duration: ~10-15 minutes
# Cost: ~$58/month
#   - Cloud SQL (db-f1-micro): $15/month
#   - Redis Memorystore (1GB): $25/month
#   - VPC Connector: $9/month
#   - Cloud Run: $9/month
```

**Deploy Backend:**

```bash
./deploy-backend.sh
# - Builds Docker image with Cloud Build
# - Deploys to Cloud Run with Secret Manager integration
# - Mounts secrets (DB_PASSWORD, JWT_SECRET, etc.) from Secret Manager
# - Configures VPC egress (private-ranges-only) for DB/Redis access
# - Memory: 1Gi, CPU: 1, Autoscaling: 0-10 instances
# Duration: ~5-7 minutes
```

**Deploy Frontend:**

```bash
./deploy-frontend.sh
# - Builds Docker image with multi-stage build (Node.js + Nginx)
# - Deploys to Cloud Run
# - Serves static assets via Nginx with SPA routing support
# - Memory: 512Mi, CPU: 1, Autoscaling: 0-3 instances
# Duration: ~3-5 minutes
```

**Verify Deployment:**

```bash
# Backend health check
curl https://quiz-backend-[PROJECT_NUMBER].asia-southeast1.run.app/actuator/health
# Expected: {"status":"UP"}

# Backend readiness
curl https://quiz-backend-[PROJECT_NUMBER].asia-southeast1.run.app/actuator/health/readiness

# Frontend
open https://quiz-frontend-[PROJECT_NUMBER].asia-southeast1.run.app
```

### Alternative Platforms

**Docker-based platforms (Render, Railway, Fly.io):**

```bash
# Backend
cd server
docker build -t quiz-backend .
# Deploy using platform CLI

# Frontend
cd client
npm run build
# Deploy dist/ folder to static hosting
```

**Environment Variables:**

- Backend (from Secret Manager): `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`, `USER_PASSWORD`
- Backend (from .env): `DB_URL`, `DB_USERNAME`, `REDIS_HOST`, `REDIS_PORT`, `CORS_ALLOWED_ORIGINS`
- Frontend (build-time): `VITE_API_BASE_URL`

Note: Sensitive secrets are stored in Google Cloud Secret Manager and mounted as environment variables at runtime.

---

## Technology Stack

### Backend

**Framework & Language:**

- Java 21 (LTS)
- Spring Boot 4.0.2
- Spring Framework 7.0.1
- Spring Security 6

**Database & ORM:**

- PostgreSQL 16
- Spring Data JPA (Hibernate 7.1.8)
- MapStruct 1.6.3 (DTO mapping)
- Lombok (boilerplate reduction)

**Security:**

- JJWT 0.12.6 (JWT tokens)
- BCrypt password hashing
- Spring Security authentication & authorization

**Caching & Performance:**

- Google Cloud Memorystore for Redis (1GB BASIC tier)
- Spring Data Redis (Lettuce client)
- Redisson 3.27.2 (distributed objects)
- Bucket4j 8.10.1 (rate limiting)
- Spring Cache abstraction

**Documentation & Tools:**

- Springdoc OpenAPI 3.0.0 (Swagger UI)
- Spring Boot DevTools
- Spring Boot Actuator
- Gradle (build tool)

### Frontend

**Framework & Language:**

- React 19.2.0
- TypeScript 5.9.3
- Vite (Rolldown) 7.2.5

**State Management:**

- TanStack Query v5.90.16 (server state)
- React Context API (auth, theme)
- Zustand 5.0.9 (client state - optional)

**Routing & Forms:**

- React Router v7.10.1
- React Hook Form 7.69.0
- Zod 4.3.4 (schema validation)

**HTTP Client:**

- Axios 1.13.2
- Async-mutex 0.5.0 (prevent race conditions)

**UI & Styling:**

- Tailwind CSS 4.1.17
- shadcn/ui (Radix UI primitives)
- Lucide React 0.556.0 (icons)
- React Icons 5.5.0

**Testing:**

- Vitest 4.0.16
- @testing-library/react 16.3.1
- @testing-library/user-event

### DevOps & Infrastructure

**Containerization:**

- Docker
- Docker Compose

**Cloud Platform:**

- Google Cloud Platform (GCP)
- Cloud Run (frontend and backend hosting)
- Cloud SQL (PostgreSQL with private IP)
- Memorystore for Redis (managed service)
- Secret Manager (credentials storage)
- VPC with dedicated subnets (private networking)
- VPC Connector (Cloud Run to VPC integration)

**CI/CD:**

- GitHub Actions (planned)
- Cloud Build (GCP)

---

## Performance Metrics

**Backend:**

- Average response time: 7ms (with Redis cache)
- Cache hit ratio: 75-80%
- Throughput: 135+ requests/second
- Rate limiting: 50 req/min (auth), 200 req/min (API)

**Frontend:**

- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: ~500KB (gzipped)
- Lighthouse score: 90+

**Infrastructure:**

- Monthly cost: ~$58 USD (51% optimized)
  - Cloud SQL (db-f1-micro): $15
  - Redis Memorystore (1GB): $25
  - VPC Connector: $9
  - Cloud Run (frontend + backend): $9
- Backend autoscaling: 0-10 instances
- Frontend autoscaling: 0-3 instances
- Uptime target: 99.9%
- Region: asia-southeast1 (Singapore) - Low latency for Vietnam

---

## Security Features

- JWT authentication (24h access + 7d refresh tokens)
- HttpOnly cookies for refresh tokens
- Automatic token refresh with mutex pattern
- Role-based access control (RBAC)
- BCrypt password hashing (strength 10)
- Rate limiting (IP-based with Redis)
- Google Cloud Secret Manager for credential storage
  - Auto-generated JWT secrets (512-bit)
  - Auto-generated admin/user passwords (192-bit)
  - Encrypted at rest with automatic rotation support
  - IAM-based access control
- CORS configuration
- Input validation (Bean Validation + Zod)
- SQL injection prevention (JPA/Hibernate)
- XSS protection
- VPC private networking (no public database access)
- No hardcoded secrets in codebase

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Standards:**

- Backend: Follow Spring Boot best practices
- Frontend: ESLint + TypeScript strict mode
- Write tests for new features
- Update documentation

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Contact & Support

For questions or issues:

- Open an issue on GitHub
- Email: support@quizapp.example.com

---
