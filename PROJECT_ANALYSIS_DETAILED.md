# PHÂN TÍCH CHI TIẾT DỰ ÁN `quiz-app-v2` (Blueprint tái sử dụng)

> Mục tiêu tài liệu: bóc tách đầy đủ kiến trúc, luồng chạy, hợp đồng API, infra/CI/CD, điểm mạnh/yếu và checklist tái sử dụng để làm tiền đề cho dự án khác.

---

## 1. Executive summary (đi thẳng vào bản chất)

Đây là một hệ thống **full-stack quiz platform** với:

- **Backend**: Java 21 + Spring Boot 4 + Spring Security JWT + PostgreSQL + Redis (cache + refresh token + rate limiting).
- **Frontend**: React 19 + TypeScript + Vite (rolldown) + TanStack Query + RHF/Zod + Axios interceptor có mutex refresh token.
- **Infra**: GCP Cloud Run + Cloud SQL private IP + Memorystore + VPC Connector + Secret Manager + Artifact Registry.
- **IaC/CD**: Terraform module hóa + GitHub Actions dùng Workload Identity Federation (keyless).

Điểm mạnh lớn nhất: kiến trúc production-ready theo hướng cloud-native, tách lớp rõ, có hệ sinh thái DevOps tương đối đầy đủ.

Điểm cần lưu ý khi lấy làm mẫu: còn một số mismatch/security/consistency ở API authz, frontend auth handling, và vài chi tiết workflow/terraform.

---

## 2. Bức tranh tổng thể repository

## 2.1. Cấu trúc thư mục cấp cao

```text
/
├── client/                     # React frontend
├── server/                     # Spring Boot backend
├── terraform/                  # IaC (7 modules)
├── .github/workflows/          # backend.yml / frontend.yml / terraform.yml
├── docker-compose.yml          # local orchestration
├── deploy.sh                   # manual deploy gcloud theo từng step
├── setup-terraform.sh          # bootstrap state bucket + IAM cho Terraform
└── setup-workload-identity.sh  # bootstrap WIF cho GitHub Actions
```

## 2.2. Chỉ số quy mô mã nguồn

| Hạng mục                      | Giá trị |
| ----------------------------- | ------: |
| `server/src/main/java` files  |      87 |
| `server` Java LOC             |   5,720 |
| `client/src` files            |     112 |
| `client` TS/TSX LOC           |  11,255 |
| Terraform `.tf/.tfvars` files |      28 |
| Terraform LOC                 |     948 |
| Controllers backend           |       6 |
| Service Impl backend          |       8 |
| Entity backend                |       8 |
| Components admin frontend     |      17 |
| Workflow GitHub Actions       |       3 |

## 2.3. Test coverage hiện trạng (định tính)

- **Backend test files**: 1 (`ApplicationTests` contextLoads).
- **Frontend test files**: 2 test thật (`QuizCard.test.tsx`, `constants.test.ts`) + setup.
- CI frontend hiện chạy lint/typecheck/build, **không chạy test**.

=> Lấy làm blueprint nên tăng test coverage đáng kể trước khi clone kiến trúc.

---

## 3. Kiến trúc runtime end-to-end

```text
User Browser
   |
   v
Frontend (React SPA, Nginx, Cloud Run) ---- build-time injected VITE_API_BASE_URL
   |
   v
Backend API (Spring Boot, Cloud Run)
   |                 \
   |                  \-- Redis (Memorystore): refresh token + cache + rate-limit bucket
   |
   \-- PostgreSQL (Cloud SQL private IP): user/role/quiz/question/submission

Secret Manager -> inject runtime secrets cho backend
Artifact Registry -> chứa images backend/frontend
GitHub Actions + WIF -> build/deploy keyless
Terraform -> quản lý hạ tầng module hóa
```

---

## 4. Backend deep dive (Spring Boot)

## 4.1. Stack + dependency chính

Từ `server/build.gradle.kts`:

- `spring-boot-starter-webmvc`, `data-jpa`, `security`, `validation`, `actuator`
- JWT: `io.jsonwebtoken` 0.12.6
- OpenAPI: `springdoc-openapi-starter-webmvc-ui`
- Redis: spring-data-redis + lettuce
- Rate limit: Bucket4j + Redisson
- Mapper: MapStruct 1.6.3 + Lombok
- DB runtime: PostgreSQL driver
- Test: Spring Boot Test + Security Test + H2 (runtime test)

## 4.2. Package design

```text
config/         security, redis/cache, rate-limit, openapi, data-init
controllers/    auth, user, role, quiz, question, exam
services/       business logic + token + refresh token
entities/       JPA model
repositories/   Spring Data repositories
dtos/           request/response contracts
mappers/        MapStruct mapping
exceptions/     base exception hierarchy + global handler
specifications/ dynamic filtering with JPA Specification
validation/     custom strong-password annotation
util/           MessageUtil i18n helper
```

## 4.3. Cấu hình runtime quan trọng (`application.properties`)

- `spring.datasource.*` lấy từ env (`DB_URL`, `DB_PASSWORD`).
- `spring.jpa.hibernate.ddl-auto=update`.
- JWT:
  - `jwt.secret=${JWT_SECRET}`
  - access: `86400000` ms (24h)
  - refresh: `604800000` ms (7d)
- Redis host/port/password/database từ env.
- Rate limit:
  - auth default 50 req/min
  - api default 200 req/min
- Cookie refresh token:
  - name: `refresh_token`
  - max-age: 604800s
- Seed data mặc định `DATA_INIT_ENABLED=false` trong property.
- Logging đang để DEBUG cho app/security/sql.

## 4.4. Security chain và auth mechanism

### 4.4.1. Filter chain

Trong `SecurityConfig`:

1. `RateLimitingFilter` chạy trước `SecurityContextHolderFilter`.
2. `JWTFilter` chạy trước `UsernamePasswordAuthenticationFilter`.
3. Session policy: `STATELESS`.
4. `CustomAuthenticationEntryPoint` cho unauthenticated access.
5. `PUBLIC_ENDPOINTS` permitAll; còn lại `authenticated`.

### 4.4.2. Public endpoints hiện khai báo

- `/api/v1/auth/login`
- `/api/v1/auth/register`
- `/api/v1/auth/refresh`
- `/api/v1/quizzes/search`
- `/api/v1/quizzes/{id}`
- `/api/v1/quizzes/{id}/start` (**không tồn tại controller mapping tương ứng**)
- swagger/api-docs/actuator

### 4.4.3. JWT

- Token sinh ở `TokenServiceImpl.generateToken`:
  - `subject = userId`
  - claims: `username`, `email`, `roles`
- Verify token tại `JWTFilter`; nếu invalid/expired trả `401`.
- Secret decode bằng `Decoders.BASE64.decode(jwtSecret)` => secret cần đúng format base64.

### 4.4.4. Refresh token strategy

- Refresh token random UUID không dấu gạch.
- Lưu trong Redis (`RefreshTokenServiceImpl`) theo 3 index:
  - `refresh_token:{token}` -> object
  - `refresh_token:user:{userId}` -> hash các token
  - `refresh_token:email:{email}` -> token hiện tại
- Khi login/register/refresh:
  - tạo refresh token mới
  - rotation: xóa token cũ theo email
- Frontend gửi refresh qua HttpOnly cookie.

### 4.4.5. Rate limiting

`RateLimitingFilter`:

- Nhận diện auth endpoint: chỉ `login/register`.
- Skip: swagger/docs/actuator.
- Key theo client IP (`X-Forwarded-For` ưu tiên).
- Dùng Bucket4j + Redisson proxy manager.
- Exceed trả `429` JSON kèm `retryAfter`.

## 4.5. Data model (JPA)

## 4.5.1. Soft-delete base

`BaseEntity`:

- `createdAt`, `updatedAt`, `isDeleted`.
- `@SQLDelete` + `@SQLRestriction("is_deleted = false")`.

## 4.5.2. Entity relationships

| Entity           | Quan hệ chính                                     | Ghi chú                     |
| ---------------- | ------------------------------------------------- | --------------------------- |
| `User`           | ManyToMany `Role`, OneToMany `QuizSubmission`     | email/username unique       |
| `Role`           | enum `RoleEnum`                                   | `ROLE_ADMIN`, `ROLE_USER`   |
| `Quiz`           | ManyToMany `Question`, OneToMany `QuizSubmission` | `durationMinutes`, `active` |
| `Question`       | OneToMany `Answer`, ManyToMany `Quiz`             | `type`, `score`             |
| `Answer`         | ManyToOne `Question`                              | `isCorrect`                 |
| `QuizSubmission` | ManyToOne `User`, ManyToOne `Quiz`                | `score`, `submissionTime`   |
| `RefreshToken`   | Redis object                                      | không phải JPA entity       |

## 4.6. Service layer chi tiết

### 4.6.1. `AuthServiceImpl`

- `login`:
  - authenticate qua `AuthenticationManager`
  - load user + roles
  - phát access + refresh token
  - persist refresh token Redis
- `register`:
  - check email exists
  - check confirm password
  - auto assign `ROLE_USER`
  - tạo token tương tự login
- `refresh`:
  - validate token tồn tại/chưa hết hạn
  - load user hiện tại
  - rotate refresh token
- `logout`:
  - lấy email từ security context
  - delete refresh token theo email

### 4.6.2. `ExamServiceImpl`

- Input: `userId`, `quizId`, danh sách answerIds theo question.
- Chấm điểm:
  - `SINGLE_CHOICE`: đúng khi chọn đúng **1** đáp án.
  - `MULTIPLE_CHOICE`: tập đáp án chọn phải **trùng tuyệt đối** tập đáp án đúng (không partial credit).
- Pass rule: `(achievedScore / totalScore) * 100 >= exam.pass-percentage`.
- Persist `QuizSubmission`.

### 4.6.3. `QuizServiceImpl`

- CRUD quiz + search theo title/active (Specification).
- `getWithQuestions` trả detail có full question/answers.
- add/remove question trong quiz (many-to-many join).

### 4.6.4. `QuestionServiceImpl`

- CRUD question + answer lồng nhau.
- Update answer gồm:
  - delete answer bị remove
  - update answer có id
  - add answer mới nếu id null

### 4.6.5. `UserServiceImpl`

- Create/update user + assign role IDs.
- Search theo `fullName` + `active`.
- Password encode bằng BCrypt.

### 4.6.6. `RoleServiceImpl`

- CRUD roles.
- Search role name đang làm theo kiểu:
  - lấy toàn bộ roles
  - filter in-memory
  - tự phân trang thủ công.

## 4.7. API contract matrix (thực tế authz)

> Quyền dưới đây là **thực tế theo SecurityConfig + @PreAuthorize hiện có**.

| Method | Endpoint                                          | Quyền         |
| ------ | ------------------------------------------------- | ------------- |
| POST   | `/api/v1/auth/login`                              | Public        |
| POST   | `/api/v1/auth/register`                           | Public        |
| POST   | `/api/v1/auth/refresh`                            | Public        |
| POST   | `/api/v1/auth/logout`                             | Authenticated |
| GET    | `/api/v1/auth/me`                                 | Authenticated |
| POST   | `/api/v1/users`                                   | ADMIN         |
| GET    | `/api/v1/users`                                   | ADMIN         |
| GET    | `/api/v1/users/search`                            | ADMIN         |
| GET    | `/api/v1/users/{id}`                              | Authenticated |
| GET    | `/api/v1/users/email/{email}`                     | Authenticated |
| PUT    | `/api/v1/users/{id}`                              | Authenticated |
| DELETE | `/api/v1/users/{id}`                              | ADMIN         |
| POST   | `/api/v1/roles`                                   | ADMIN         |
| GET    | `/api/v1/roles`                                   | ADMIN         |
| GET    | `/api/v1/roles/search`                            | ADMIN         |
| GET    | `/api/v1/roles/{id}`                              | ADMIN         |
| PUT    | `/api/v1/roles/{id}`                              | ADMIN         |
| DELETE | `/api/v1/roles/{id}`                              | ADMIN         |
| POST   | `/api/v1/quizzes`                                 | ADMIN         |
| GET    | `/api/v1/quizzes`                                 | Authenticated |
| GET    | `/api/v1/quizzes/search`                          | Public        |
| GET    | `/api/v1/quizzes/{id}`                            | Public        |
| GET    | `/api/v1/quizzes/{id}/details`                    | Authenticated |
| PUT    | `/api/v1/quizzes/{id}`                            | ADMIN         |
| DELETE | `/api/v1/quizzes/{id}`                            | ADMIN         |
| GET    | `/api/v1/quizzes/{quizId}/questions`              | Authenticated |
| POST   | `/api/v1/quizzes/{quizId}/questions`              | ADMIN         |
| DELETE | `/api/v1/quizzes/{quizId}/questions/{questionId}` | ADMIN         |
| POST   | `/api/v1/questions`                               | ADMIN         |
| GET    | `/api/v1/questions`                               | Authenticated |
| GET    | `/api/v1/questions/search`                        | Authenticated |
| GET    | `/api/v1/questions/{id}`                          | Authenticated |
| PUT    | `/api/v1/questions/{id}`                          | ADMIN         |
| DELETE | `/api/v1/questions/{id}`                          | ADMIN         |
| POST   | `/api/v1/exam/submit`                             | Authenticated |

## 4.8. Exception handling + i18n

- `GlobalExceptionHandler` trả format `ApiResponse` cho:
  - custom `BaseException`
  - validation
  - bad credentials
  - access denied
  - generic exception
- i18n: `messages.properties` (EN) + `messages_vi.properties` (VI) qua `MessageUtil`.

**Nhưng**:

- `CustomAuthenticationEntryPoint` trả JSON shape riêng (không theo `ApiResponse`) và status `403`.
- `JWTFilter` khi token invalid dùng `response.sendError(401, ...)` => format response khác.

---

## 5. Frontend deep dive (React)

## 5.1. Bootstrap và provider stack (`main.tsx`)

Provider order:

1. `QueryClientProvider`
2. `ThemeProvider`
3. `BrowserRouter`
4. `AuthProvider`
5. `ToastContainer`
6. `ReactQueryDevtools`

`QueryClient` mặc định:

- query staleTime 5 phút, gcTime 10 phút.
- retry query = 1, mutation retry = 0.

## 5.2. Route architecture (`App.tsx`)

- Public:
  - `/`, `/about`, `/contact`, `/quizzes`, `/exam/:quizId`, `/exam/result/:submissionId`
- Auth:
  - `/login`, `/register`
- Admin:
  - `/admin/quizzes`, `/admin/questions`, `/admin/users`, `/admin/roles`
  - bọc qua `ProtectedRoute requiredRole=[ROLE_ADMIN]`
- Error:
  - `/403`, `* -> 404`

## 5.3. Auth state & session control

`AuthContext`:

- state: `user`, `isAuthenticated`, `isLoading`
- startup:
  - nếu có access token trong localStorage -> gọi `/auth/me`
  - fail -> clear token, về unauthenticated
- login/register:
  - lưu `access_token`
  - set auth success
- logout:
  - gọi API logout (best effort)
  - clear token local

## 5.4. Axios layer và refresh mutex

`axios.config.ts`:

- request interceptor tự gắn `Authorization: Bearer <token>`.
- response interceptor:
  - trả `response.data` (unwrap 1 lớp API envelope)
  - khi 401 (trừ login), gọi `handleRefreshToken` với mutex (`async-mutex`)
  - retry request cũ bằng token mới (header `x-no-retry` chống loop)
- `withCredentials: true` để gửi/nhận refresh cookie.

## 5.5. Services + hooks pattern

Pattern chuẩn:

- `services/api/*.api.ts` gọi axios typed.
- `hooks/use*.ts` wrap bằng React Query:
  - query key có params
  - mutation invalidateQueries
  - toast success/error.

Module API:

- `auth.api.ts`
- `quiz.api.ts`
- `question.api.ts`
- `user.api.ts`
- `role.api.ts`
- `exam.api.ts`

## 5.6. Feature modules

### 5.6.1. Public/Home

- Hero + Featured quizzes.
- `quiz-section.tsx` lấy 3 quiz active và gán ảnh placeholder cứng.

### 5.6.2. Quizzes page

- Nhập quiz UUID -> gọi `useQuiz` -> nếu active thì chuyển `/exam/:quizId`.

### 5.6.3. Exam flow

- Exam page fetch quiz detail (có câu hỏi/đáp án).
- Chọn đáp án theo loại câu hỏi.
- Submit gọi `/exam/submit`.
- Result page nhận `location.state.result`; nếu reload thì chỉ hiện submission id.

### 5.6.4. Admin module

- 4 trang quản trị: quizzes/questions/users/roles.
- Mỗi trang có:
  - search filter
  - table + pagination
  - form create/update
  - delete confirm dialog.

## 5.7. Validation frontend (Zod)

- `auth.schema.ts`: email/password/register constraints.
- `quiz.schema.ts`: title/description/duration/active.
- `admin.schema.ts`: user/role/question/answer schema.

## 5.8. UI architecture

- Tailwind CSS v4 + shadcn/ui + Radix.
- Theme light/dark/system (persist localStorage).
- Dino-green token system trong `index.css`.
- Layout:
  - main layout: navbar + outlet + footer
  - admin layout: navbar + sidebar + breadcrumbs + outlet + footer.

---

## 6. Infra, Docker, Terraform, CI/CD

## 6.1. Local stack (`docker-compose.yml`)

Services:

- `postgres` (5432)
- `redis` (6379)
- `backend` (không expose host port, phục vụ nội mạng compose)
- `frontend` (port 80 host)

Healthcheck có cho PostgreSQL/Redis/backend/frontend.

## 6.2. Container images

### Backend Dockerfile

- Multi-stage: Gradle build -> JRE runtime.
- build `bootJar -x test`.
- chạy user non-root `spring`.
- expose 8080 + healthcheck `/actuator/health`.

### Frontend Dockerfile

- Stage build Node 20 `npm ci` + `npm run build`.
- build arg `VITE_API_BASE_URL` inject compile-time.
- runtime Nginx trên 8080 với SPA fallback.

## 6.3. Terraform architecture

Root module:

1. enable APIs
2. `artifact_registry`
3. `networking`
4. `iam`
5. `database`
6. `redis`
7. `secrets`
8. `cloud_run`

Backend state: GCS bucket `kien-terraform-playground-tfstate`, prefix `quiz-app`.

### Module summary

| Module            | Mục đích                                                           |
| ----------------- | ------------------------------------------------------------------ |
| networking        | VPC, VPC connector, private service connection, firewall           |
| iam               | run service account + WIF pool/provider + IAM roles                |
| database          | Cloud SQL PostgreSQL private IP                                    |
| redis             | Memorystore Redis (BASIC)                                          |
| secrets           | Secret Manager + version + IAM access cho SA                       |
| artifact_registry | Docker registry repo                                               |
| cloud_run         | Deploy backend/frontend service + env/secrets + IAM public invoker |

## 6.4. GitHub Actions workflows

### backend.yml

- Trigger path `server/**`.
- Job `test`: chạy Gradle test với postgres+redis service container.
- Job `build-and-deploy` (push/main/manual):
  - auth WIF
  - build/push image
  - đọc DB IP + Redis host
  - deploy Cloud Run backend
  - inject env + secrets

### frontend.yml

- Trigger path `client/**`.
- Job `test`: lint + typecheck + build validation.
- Job deploy:
  - lấy backend URL Cloud Run
  - build frontend image với `VITE_API_BASE_URL=<backend>/api/v1`
  - deploy frontend
  - update CORS backend = frontend URL

### terraform.yml

- Trigger path `terraform/**`.
- `validate` -> `plan` -> `apply` (main hoặc manual apply).
- plan output được comment vào PR.

---

## 7. Luồng nghiệp vụ quan trọng (sequence)

## 7.1. Login + token issuance

1. FE POST `/auth/login`.
2. BE authenticate credentials.
3. BE trả:
   - access token trong response body
   - refresh token trong cookie HttpOnly.
4. FE lưu access token localStorage.

## 7.2. Auto refresh khi access token hết hạn

1. Request API bị `401`.
2. Axios interceptor khóa mutex.
3. Gọi `/auth/refresh` (cookie refresh tự gửi).
4. Nhận access token mới -> update localStorage.
5. Retry request ban đầu.

## 7.3. Submit exam

1. FE gửi `userId + quizId + answers[]`.
2. BE load quiz + user.
3. Chấm từng câu theo type.
4. Lưu `quiz_submissions`.
5. Trả `submissionId, score, totalQuestions, passed`.

## 7.4. Admin gán câu hỏi vào quiz

1. FE lấy toàn bộ question bank.
2. FE hiển thị question in quiz (badge In Quiz).
3. FE gọi `POST /quizzes/{id}/questions` với list question IDs.
4. BE gắn relation many-to-many, skip duplicate.

---

## 8. Những điểm mạnh đáng học theo (copy pattern)

1. **Backend layering rõ ràng**: controller/service/repository/dto/mapper/specification.
2. **Auth model hiện đại**: access token ngắn hạn + refresh token rotate + HttpOnly cookie.
3. **Race-safe refresh ở frontend**: mutex chặn refresh storm.
4. **Module Terraform tách đúng domain**: dễ scale và maintain.
5. **WIF keyless CI/CD**: tránh service account key JSON.
6. **Mẫu search + paging xuyên suốt**: từ BE specification đến FE table pagination.
7. **I18n cho message backend**: hỗ trợ đa ngôn ngữ cho success/error text.

---

## 9. Rủi ro/gap kỹ thuật phát hiện (rất quan trọng trước khi clone)

## 9.1. Security/Authz

1. `PUT /api/v1/users/{id}` không có `@PreAuthorize("hasRole('ADMIN')")`  
   -> user authenticated bất kỳ có thể update user khác (nếu biết ID).
2. `GET /api/v1/users/{id}` và `GET /api/v1/users/email/{email}` cũng không khóa ADMIN.
3. `POST /api/v1/exam/submit` nhận `userId` từ client, chưa ràng buộc với principal hiện tại.
4. `CustomAuthenticationEntryPoint` trả `403` cho unauthenticated (thường chuẩn REST là `401`).
5. Security config có public endpoint `/api/v1/quizzes/{id}/start` nhưng endpoint này không tồn tại.

## 9.2. Auth/token consistency

1. `AuthController.refresh()` đọc cookie bằng hardcoded `"refresh_token"`, trong khi cookie name là config property.
2. FE define `STORAGE_KEYS.USER_INFO` và `REFRESH_TOKEN` nhưng thực tế không set giá trị tương ứng.
3. `handleForbidden()` phụ thuộc `USER_INFO`, nên nhánh redirect 403 gần như không chạy đúng.
4. `handleUnauthorized()` redirect login bằng query `?returnUrl=...`, nhưng login page lại đọc `location.state.returnUrl` -> mismatch.

## 9.3. Domain/API consistency

1. `UserRequestDTO` dùng cho update nhưng password gắn `@StrongPassword` (kèm `@NotBlank`), trái ngược intent “password optional khi update”.
2. `RoleService.search` filter in-memory (không dùng DB query/spec) -> không phù hợp dữ liệu lớn.
3. Caching chưa nhất quán:
   - `QuestionService` có `@CacheEvict` nhưng không có `@Cacheable` tương ứng.
   - evict key `'exam::'` trong `QuizService` nhưng không có cache put/get key này.

## 9.4. Frontend UX/logic debt

1. `question-form.tsx` hardcode `score: 10` khi submit (bỏ qua giá trị form).
2. Role form có toggle `isActive` nhưng backend DTO không có trường này (gần như không hiệu lực).
3. Question search filter có `activeOnly` nhưng không đưa vào query.
4. `components/admin/quiz/question-table.tsx` có pagination links tĩnh `1/2/3` (không dynamic).
5. Quiz image đang hardcode placeholder (thumbnail URL chưa implement thật).

## 9.5. Quality pipeline

1. Frontend test không chạy trong CI.
2. `constants.test.ts` kỳ vọng `APP_INFO.NAME = "Quizzes"` nhưng constants hiện là `"Dino Quiz"` (test stale).
3. Backend test coverage gần như chỉ smoke context load.

## 9.6. Infra/ops notes

1. `terraform.yml` cho `workflow_dispatch` có option `destroy` nhưng không có job destroy tương ứng.
2. `terraform fmt -check` đặt `continue-on-error: true` (không fail gate).
3. Cloud Run frontend dùng cùng service account với backend (quyền rộng hơn nhu cầu frontend).
4. Runtime backend đang set `SPRING_JPA_HIBERNATE_DDL_AUTO=update` trên production deploy.

---

## 10. Catalog biến môi trường (tham chiếu nhanh)

## 10.1. Backend

| Biến                                                                            | Vai trò             |
| ------------------------------------------------------------------------------- | ------------------- |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`                                          | Postgres connection |
| `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`                        | JWT config          |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DATABASE`, `REDIS_TIMEOUT` | Redis config        |
| `CORS_ALLOWED_ORIGINS`                                                          | CORS whitelist      |
| `DATA_INIT_ENABLED`                                                             | bật/tắt seed data   |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `USER_EMAIL`, `USER_PASSWORD`                  | seed users          |
| `API_CONTACT_EMAIL`, `API_PROJECT_URL`, `API_SERVER_URL`                        | OpenAPI metadata    |

## 10.2. Frontend

| Biến                                             | Vai trò                   |
| ------------------------------------------------ | ------------------------- |
| `VITE_API_BASE_URL`                              | API base URL (build-time) |
| `VITE_APP_NAME`, `VITE_APP_VERSION`              | app metadata              |
| `VITE_API_TIMEOUT`                               | axios timeout             |
| `VITE_ENABLE_DEV_TOOLS`, `VITE_ENABLE_MOCK_DATA` | feature flags             |

## 10.3. Terraform sensitive vars

- `db_password`
- `jwt_secret`
- `admin_password`
- `user_password`

---

## 11. Blueprint áp dụng cho dự án mới (khuyến nghị thực thi)

## 11.1. Giữ nguyên các pattern này

1. Kiến trúc backend tách lớp + DTO + mapper + specification.
2. Access/refresh token split + refresh mutex phía frontend.
3. Terraform module boundaries theo domain hạ tầng.
4. CI/CD tách backend/frontend/terraform theo path filters.
5. Secret Manager + WIF keyless.

## 11.2. Nên chỉnh trước khi nhân bản

1. Siết authz endpoint users/exam theo principal.
2. Chuẩn hóa status/auth error format (`401` vs `403`, `ApiResponse` thống nhất).
3. Làm sạch mismatch frontend auth storage/redirect.
4. Fix các điểm UX debt trong admin.
5. Bổ sung test matrix (unit + integration + e2e tối thiểu).
6. Tách service account frontend/backend theo least privilege.
7. Rà soát cache strategy để tránh annotation “evict-only”.

## 11.3. Checklist migration sang dự án khác

| Bước | Mục tiêu                        | Kết quả mong muốn                  |
| ---- | ------------------------------- | ---------------------------------- |
| 1    | Clone skeleton folder structure | có khung FE/BE/infra chuẩn         |
| 2    | Đổi domain model + DTO + mapper | API phản ánh đúng nghiệp vụ mới    |
| 3    | Áp auth policy chuẩn mới        | không còn endpoint hở quyền        |
| 4    | Cấu hình env + secret strategy  | tách secrets theo môi trường       |
| 5    | Adapt Terraform modules         | hạ tầng khớp workload mới          |
| 6    | Fix pipeline quality gates      | CI fail-fast đúng chuẩn team       |
| 7    | Thiết lập test baseline         | regression safety đủ trước release |

---

## 12. Kết luận kỹ thuật

`quiz-app-v2` là một nền tảng mẫu tốt cho dự án full-stack cloud-native vì đã có đủ backbone: domain CRUD, auth JWT, cache/rate-limit Redis, IaC Terraform, CD Cloud Run.

Nếu dùng làm “template gốc” cho dự án mới, nên coi đây là **v1 kiến trúc mạnh** nhưng cần một vòng **hardening** (authz + consistency + test + pipeline) trước khi chuẩn hóa thành framework nội bộ/team starter.
