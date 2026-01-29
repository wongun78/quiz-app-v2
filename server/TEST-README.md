# 🦕 Dino Quiz - API Testing Guide

Comprehensive test suite for the Dino Quiz application APIs.

## 📋 Prerequisites

- Docker Desktop running
- Docker services: `postgres`, `redis` (container names: `quiz-postgres`, `quiz-redis`)
- Application running on `http://localhost:8080`

**Start Docker services:**

```bash
docker-compose up -d postgres redis
```

## 🚀 Quick Start

### Option 1: Automated (Recommended)

Run everything with one command:

```bash
./quick-start.sh
```

This will:

1. Reset database and Redis
2. Start application (wait ~30s)
3. Run all API tests automatically
4. Stop application after tests

### Option 2: Manual Steps

### 1. Reset Database (Clean Slate)

```bash
./reset-database.sh
```

This will:

- Stop existing containers
- Drop and recreate `quiz_db` database
- Clear Redis cache
- Restart PostgreSQL and Redis containers

### 2. Start Application

```bash
./gradlew bootRun
```

Wait for application to start (creates schema + seeds initial data).

### 3. Run All Tests

```bash
./test-all-apis.sh
```

This orchestrates all test suites:

- ✅ Registration Flow
- ✅ Student Flow (ROLE_USER)
- ✅ Admin Flow (ROLE_ADMIN)

## 📝 Individual Test Scripts

### Test Registration

```bash
./test-registration.sh
```

**Features Tested:**

- ✓ User registration with all required fields
- ✓ Email uniqueness validation
- ✓ Email format validation
- ✓ Required fields validation
- ✓ Auto-login after registration
- ✓ JWT token generation
- ✓ Default ROLE_USER assignment

### Test Student Flow

```bash
./test-student-flow.sh
```

**Features Tested:**

- ✓ JWT authentication (ROLE_USER)
- ✓ Browse available quizzes
- ✓ View quiz details with questions
- ✓ Submit exam with automatic scoring
- ✓ View exam results (score, pass/fail)
- ✓ Search quizzes by keyword
- ✓ Authorization checks (403 for admin endpoints)
- ✓ User profile access

**Default Student Account:**

- Email: `rex@dinoquiz.academy`
- Password: `Rex@2024`
- Roles: ROLE_USER, ROLE_ADMIN

### Test Admin Flow

```bash
./test-admin-flow.sh
```

**Features Tested:**

- ✓ Admin authentication (ROLE_ADMIN)
- ✓ Create/Update/Delete quizzes
- ✓ Create/Update/Delete questions
- ✓ View all users (admin access)
- ✓ Search users by keyword
- ✓ View all roles
- ✓ Toggle quiz active status
- ✓ Full CRUD operations
- ✓ Spring Cache (roles/quizzes/questions)

**Default Admin Account:**

- Email: `rex@dinoquiz.academy`
- Password: `Rex@2024`
- Roles: ROLE_USER, ROLE_ADMIN

## 🧪 Test Results

Each script provides:

- ✅ **Pass/Fail Status** for each test step
- 📊 **Summary Statistics** (Total, Passed, Failed)
- 🎯 **Success Rate Percentage**
- 📋 **Feature Verification List**

### Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin Flow Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Steps: 12
✓ Passed: 12
✗ Failed: 0

✅ Admin Flow: ALL TESTS PASSED!
```

## 🔍 API Endpoints Tested

### Authentication (`/api/v1/auth`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get user profile

### Quizzes (`/api/v1/quizzes`)

- `GET /quizzes` - Browse all quizzes
- `GET /quizzes/{id}` - Get quiz details
- `GET /quizzes/{id}/questions` - Get quiz questions
- `GET /quizzes/search` - Search quizzes
- `POST /quizzes` - Create quiz (ADMIN)
- `PUT /quizzes/{id}` - Update quiz (ADMIN)
- `PATCH /quizzes/{id}/toggle-active` - Toggle status (ADMIN)
- `DELETE /quizzes/{id}` - Delete quiz (ADMIN)

### Questions (`/api/v1/questions`)

- `GET /questions` - Get all questions
- `GET /questions/{id}` - Get question details
- `GET /questions/search` - Search questions
- `POST /questions` - Create question (ADMIN)
- `PUT /questions/{id}` - Update question (ADMIN)
- `DELETE /questions/{id}` - Delete question (ADMIN)

### Exam (`/api/v1/exam`)

- `POST /exam/submit` - Submit exam answers

### Users (`/api/v1/users`)

- `GET /users` - Get all users (ADMIN)
- `GET /users/search` - Search users (ADMIN)

### Roles (`/api/v1/roles`)

- `GET /roles` - Get all roles (ADMIN)

## 🎯 Performance Features Tested

### Spring Cache with Redis

- **Roles Cache:** TTL 24 hours
- **Quizzes Cache:** TTL 1 hour
- **Questions Cache:** TTL 1 hour
- **Cache Eviction:** On update/delete operations

### Redisson Rate Limiting

- **Auth Endpoints:** 5 requests/minute
- **API Endpoints:** 100 requests/minute

## 🐛 Troubleshooting

### Common Issues

#### 1. "no such service: quiz-postgres" Error

**Problem:** Docker service names mismatch

**Solution:**

```bash
# The service names in docker-compose.yml are 'postgres' and 'redis'
# Container names are 'quiz-postgres' and 'quiz-redis'

# Start with correct service names:
cd ..
docker-compose up -d postgres redis
```

#### 2. "Container name already in use" Error

**Problem:** Zombie containers from previous runs

**Solution:**

```bash
# Force remove old containers
docker rm -f quiz-postgres quiz-redis

# Then restart
docker-compose up -d postgres redis
```

#### 3. Application Not Running

```bash
cd server
./gradlew bootRun
```

### Docker Containers Not Running

```bash
cd ..
docker-compose up -d postgres redis
```

Check container status:

```bash
docker ps | grep quiz
```

### Database Issues

```bash
./reset-database.sh
```

### View Application Logs

```bash
tail -f logs/application.log
```

### Check Redis Cache

```bash
docker exec -it quiz-redis redis-cli
> KEYS *
> GET users::rex@dinoquiz.academy
```

### Check PostgreSQL Database

```bash
docker exec -it quiz-postgres psql -U postgres -d quiz_db
quiz_db=# \dt
quiz_db=# SELECT * FROM users;
```

## 📊 CI/CD Integration

These scripts are designed for CI/CD pipelines:

```yaml
# .github/workflows/api-tests.yml
- name: Run Database Reset
  run: ./server/reset-database.sh

- name: Start Application
  run: ./server/gradlew bootRun &

- name: Wait for Application
  run: sleep 30

- name: Run API Tests
  run: ./server/test-all-apis.sh
```

## 🔒 Security Notes

- All passwords in test scripts are for **development only**
- Change default credentials in production
- JWT secrets should be environment variables
- Refresh tokens use HttpOnly cookies
- Rate limiting protects against abuse

## 📈 Expected Results

When all tests pass, you should see:

```
🎉 ALL API TESTS PASSED! 🎉

✅ Registration Flow: Complete
✅ Student Flow: Complete
✅ Admin Flow: Complete

🚀 Dino Quiz Platform: PRODUCTION READY!
```

## 🆘 Support

If tests fail:

1. Check application logs
2. Verify Docker containers are running
3. Ensure database is seeded
4. Try resetting database with `./reset-database.sh`
5. Check Redis connectivity

## 📝 Notes

- Tests use existing seeded user `rex@dinoquiz.academy`
- New users are created with random emails
- Quizzes and questions created during admin tests are cleaned up
- Each test suite is independent and can run separately
- All scripts have colored output for better readability
