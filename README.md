# 🎯 Quiz Management System - Full Stack Application

> **Monorepo** cho hệ thống quản lý quiz với Spring Boot Backend và React Frontend

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-6DB33F?logo=springboot)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript)
![Java](https://img.shields.io/badge/Java-21-orange?logo=oracle)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## 📁 Cấu trúc Monorepo

```
quiz-app/
├── client/                 # Frontend - React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md          # Chi tiết về Frontend
│
├── server/                 # Backend - Spring Boot + PostgreSQL
│   ├── src/
│   ├── build.gradle.kts
│   └── README.md          # Chi tiết về Backend
│
├── docker-compose.yml     # Docker setup cho toàn bộ stack
├── .gitignore             # Gitignore chung
└── README.md              # File này
```

---

## 🚀 Quick Start

### Yêu cầu

- **Docker Desktop** (khuyến nghị - dễ nhất)
- **HOẶC:**
  - Node.js 20+
  - JDK 21
  - PostgreSQL 16+

---

### 🐳 Cách 1: Chạy với Docker (Khuyến nghị)

Cách này sẽ tự động khởi chạy cả Database, Backend, và Frontend trong containers.

```bash
# 1. Clone repo
git clone <your-repo-url>
cd quiz-app

# 2. Tạo file .env (copy từ server/.env)
cp server/.env .env

# 3. Khởi động toàn bộ hệ thống
docker-compose up -d

# 4. Kiểm tra logs
docker-compose logs -f
```

**Kết quả:**

- 🗄️ PostgreSQL: `localhost:5432`
- 🌐 Backend API: `http://localhost:8080`
- 🎨 Frontend (nếu enabled): `http://localhost:3000`

**Dừng toàn bộ:**

```bash
docker-compose down
```

---

### 💻 Cách 2: Chạy Manual (Development)

#### Bước 1: Khởi động Database

```bash
# Chỉ chạy PostgreSQL
docker-compose up -d postgres

# HOẶC cài PostgreSQL local và tạo database:
# createdb quiz_db
```

#### Bước 2: Chạy Backend (Spring Boot)

```bash
cd server

# Copy .env
cp .env.example .env
# Sửa .env với thông tin database của bạn

# Chạy với Gradle
./gradlew bootRun

# HOẶC build jar và chạy
./gradlew bootJar
java -jar build/libs/quiz-app-*.jar
```

✅ Backend đang chạy tại: `http://localhost:8080`
📚 API Docs: `http://localhost:8080/swagger-ui.html`

#### Bước 3: Chạy Frontend (React + Vite)

```bash
cd client

# Cài đặt dependencies
npm install
# hoặc
yarn install

# Chạy dev server
npm run dev
# hoặc
yarn dev
```

✅ Frontend đang chạy tại: `http://localhost:5173`

---

## 📚 Documentation

### Backend (Spring Boot)

Xem chi tiết tại: [`server/README.md`](server/README.md)

**Highlights:**

- REST API với JWT Authentication
- Role-based Access Control (Admin/User)
- Swagger UI cho API documentation
- Spring Data JPA + PostgreSQL
- Soft delete, pagination, validation

### Frontend (React + TypeScript)

Xem chi tiết tại: [`client/README.md`](client/README.md)

**Highlights:**

- React 19 với TypeScript
- Tailwind CSS v4 + Shadcn/ui
- Admin Dashboard đầy đủ CRUD
- Responsive design
- React Router 7

---

## 🧪 API Testing

### Postman Collection

Import collection từ: `server/postman/Quiz-API-Collection.json`

### Swagger UI

Truy cập: `http://localhost:8080/swagger-ui.html`

### Test Accounts

```
Admin:
  - Email: admin@example.com
  - Password: admin123

User:
  - Email: user@example.com
  - Password: user123
```

---

## 🔧 Scripts hữu ích

### Backend

```bash
cd server

# Build
./gradlew build

# Run tests
./gradlew test

# Clean build
./gradlew clean build

# Build Docker image
docker build -t quiz-backend .
```

### Frontend

```bash
cd client

# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 🌐 Deployment

### Heroku / Render / Railway

1. Backend: Deploy từ folder `server/`
2. Frontend: Deploy từ folder `client/`
3. Update environment variables:
   - Backend: Database URL, JWT Secret, CORS origins
   - Frontend: API URL

### Docker Production

```bash
# Build images
docker-compose build

# Push lên Docker Hub / Registry
docker tag quiz-backend your-registry/quiz-backend:latest
docker push your-registry/quiz-backend:latest
```

---

## 🛠️ Tech Stack

### Backend

- Java 21 + Spring Boot 4.0
- Spring Security 6 (JWT)
- Spring Data JPA
- PostgreSQL 16
- MapStruct (DTO mapping)
- Lombok
- Gradle

### Frontend

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Shadcn/ui Components
- React Router 7
- Axios

### DevOps

- Docker & Docker Compose
- GitHub Actions (CI/CD)
- PostgreSQL

---
