# server — Spring Boot 4 Backend

REST API for the Quiz platform. Java 21 + Spring Boot 4.0.2 + PostgreSQL 16 + Redis 7.

---

## Stack

|               |                                                       |
| ------------- | ----------------------------------------------------- |
| Language      | Java 21                                               |
| Framework     | Spring Boot 4.0.2, Spring Security 6                  |
| Build         | Gradle 9.2 (Kotlin DSL)                               |
| Database      | PostgreSQL 16 — Spring Data JPA (Hibernate)           |
| Cache         | Redis 7 — Spring Cache + Lettuce + Redisson           |
| Rate limiting | Bucket4j 8.10.1 + Redisson (distributed token bucket) |
| Auth          | JJWT 0.12.6 — 24h access token + 7d refresh token     |
| Mapping       | MapStruct 1.6.3                                       |
| Validation    | Bean Validation + i18n messages (vi/en)               |
| API docs      | Springdoc OpenAPI 3 (Swagger UI)                      |

---

## Run locally

**Requires:** PostgreSQL 16 + Redis 7 running. Easiest via docker-compose from root:

```bash
cd ..
docker-compose up -d postgres redis
```

Then:

```bash
cp .env.example .env   # fill in DB_PASSWORD, JWT_SECRET, ADMIN_PASSWORD, USER_PASSWORD
./gradlew bootRun
```

| Endpoint   | URL                                   |
| ---------- | ------------------------------------- |
| API base   | http://localhost:8080                 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Health     | http://localhost:8080/actuator/health |

---

## Environment variables

| Variable                 | Default                                    | Required        |
| ------------------------ | ------------------------------------------ | --------------- |
| `DB_URL`                 | `jdbc:postgresql://localhost:5432/quiz_db` |                 |
| `DB_USERNAME`            | `postgres`                                 |                 |
| `DB_PASSWORD`            | —                                          | ✓               |
| `JWT_SECRET`             | —                                          | ✓ (min 256-bit) |
| `JWT_EXPIRATION`         | `86400000` (24h ms)                        |                 |
| `JWT_REFRESH_EXPIRATION` | `604800000` (7d ms)                        |                 |
| `REDIS_HOST`             | `localhost`                                |                 |
| `REDIS_PORT`             | `6379`                                     |                 |
| `REDIS_PASSWORD`         | _(empty)_                                  |                 |
| `ADMIN_PASSWORD`         | —                                          | ✓               |
| `USER_PASSWORD`          | —                                          | ✓               |
| `CORS_ALLOWED_ORIGINS`   | `http://localhost:5173`                    |                 |
| `DATA_INIT_ENABLED`      | `false`                                    |                 |

On GCP, `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`, `USER_PASSWORD` are mounted from Secret Manager at runtime.

---

## Build & test

```bash
./gradlew test          # run tests (uses H2 in-memory)
./gradlew build         # compile + test + JAR
./gradlew bootJar       # fat JAR → build/libs/
./gradlew clean build   # clean first
```

CI runs tests with real Postgres 16 + Redis 7 service containers (see `.github/workflows/backend.yml`).

---

## Docker

```bash
# Build (must be linux/amd64 for Cloud Run)
docker build --platform linux/amd64 -t quiz-backend .

# Run
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/quiz_db \
  -e DB_PASSWORD=... \
  -e JWT_SECRET=... \
  -e ADMIN_PASSWORD=... \
  -e USER_PASSWORD=... \
  quiz-backend
```

---

## Source structure

```
src/main/java/fpt/kiennt169/springboot/
├── config/          Spring Security, Redis, Cache, Rate Limiting, CORS, OpenAPI
├── controllers/     REST controllers (Auth, Quiz, Question, User, Role, Exam)
├── services/        Business logic
├── entities/        JPA entities
├── repositories/    Spring Data JPA
├── dtos/            Request/Response DTOs
├── filter/          JWT filter, Rate limit filter
├── mappers/         MapStruct mappers
├── exceptions/      Global exception handler
├── enums/           Role, QuestionType, etc.
└── util/            JWT util, helpers

src/main/resources/
├── application.properties
├── logback-spring.xml
├── redisson-config.yml
└── i18n/messages.properties  (en + vi)
```

---

## Key design decisions

**JWT:** Access token (24h) in Authorization header. Refresh token (7d) in HttpOnly cookie. Refresh uses mutex on frontend to prevent parallel refresh races.

**Redis caching:** `@Cacheable` / `@CacheEvict` on service layer. TTL 1h. Cache-null-values disabled. Invalidated on any write.

**Rate limiting:** Distributed token bucket per IP via Bucket4j + Redisson. Auth endpoints: 50 req/min. API endpoints: 200 req/min. Configurable via env vars.

**Data init:** Seeded on startup when `DATA_INIT_ENABLED=true`. Creates admin + user accounts. Safe to re-run (idempotent).

---

## API — Swagger

Full API docs at `/swagger-ui.html` when running. Collection also available:

```
postman/Quiz-API-Collection.json
```

Test accounts (passwords from env vars):

- Admin: `rex@dinoquiz.academy`
- User: `veloci@dinoquiz.academy`
