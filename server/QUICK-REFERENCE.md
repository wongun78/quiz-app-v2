# 🦕 Test Scripts - Quick Reference

## 📁 Available Scripts

| Script                 | Purpose                                | Time    |
| ---------------------- | -------------------------------------- | ------- |
| `quick-start.sh`       | **ONE COMMAND** - Reset + Start + Test | ~2 min  |
| `reset-database.sh`    | Reset PostgreSQL + Redis               | ~10 sec |
| `test-all-apis.sh`     | Run all test suites                    | ~30 sec |
| `test-registration.sh` | Test user registration                 | ~5 sec  |
| `test-student-flow.sh` | Test student (ROLE_USER) flow          | ~10 sec |
| `test-admin-flow.sh`   | Test admin (ROLE_ADMIN) flow           | ~15 sec |

## ⚡ Quick Commands

### First Time Setup

```bash
cd server
./quick-start.sh
```

### Daily Development

```bash
# 1. Start containers
cd ..
docker-compose up -d postgres redis

# 2. Reset DB
cd server
./reset-database.sh

# 3. Start app (different terminal)
./gradlew bootRun

# 4. Run tests
./test-all-apis.sh
```

### Individual Tests

```bash
./test-registration.sh  # Test user registration
./test-student-flow.sh  # Test student features
./test-admin-flow.sh    # Test admin features
```

## 🔧 Common Fixes

### Fix 1: Service Name Error

```bash
# ❌ Wrong: docker-compose up -d quiz-postgres quiz-redis
# ✅ Right: docker-compose up -d postgres redis
```

### Fix 2: Zombie Containers

```bash
docker rm -f quiz-postgres quiz-redis
docker-compose up -d postgres redis
```

### Fix 3: Port Already in Use

```bash
# Find process using port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in application.properties:
# server.port=8081
```

### Fix 4: Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep quiz-postgres

# Check logs
docker logs quiz-postgres

# Restart if needed
docker restart quiz-postgres
```

## 📊 Expected Test Results

### All Passing ✅

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ALL API TESTS PASSED! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Registration Flow: Complete
✅ Student Flow: Complete
✅ Admin Flow: Complete

Total Test Suites: 3
✓ Passed: 3
✗ Failed: 0

Success Rate: 100%
```

### Individual Test Summary

```
Registration: 6/6 steps ✓
Student Flow: 9/9 steps ✓
Admin Flow: 12/12 steps ✓
```

## 🎯 Test Coverage

### Authentication & Authorization

- ✅ User registration with validation
- ✅ Login with JWT tokens
- ✅ Token refresh mechanism
- ✅ Role-based access control
- ✅ 403 Forbidden for unauthorized access

### Quiz Management

- ✅ Browse public quizzes
- ✅ Search by keyword
- ✅ View quiz details
- ✅ Create/Update/Delete (Admin)
- ✅ Toggle active status (Admin)

### Question Management

- ✅ CRUD operations (Admin only)
- ✅ Multiple question types
- ✅ Difficulty levels
- ✅ Points assignment

### Exam System

- ✅ Submit answers
- ✅ Automatic scoring
- ✅ Pass/Fail calculation
- ✅ Result viewing

### Performance Features

- ✅ Spring Cache with Redis
- ✅ Cache eviction on updates
- ✅ Redisson rate limiting
- ✅ 65% performance improvement

## 🔑 Default Test Accounts

### Student Account

```
Email: rex@dinoquiz.academy
Password: Rex@2024
Roles: ROLE_USER, ROLE_ADMIN
```

### New Registered User

```
Email: testuser{timestamp}@dinoquiz.com
Password: Password123
Roles: ROLE_USER (default)
```

## 📈 Performance Metrics

With Redis caching enabled:

- **Cold cache:** ~20ms first request
- **Warm cache:** ~7ms average
- **Improvement:** 65% faster
- **Throughput:** 135+ req/s

## 🚨 Emergency Commands

### Nuclear Option (Reset Everything)

```bash
# Stop all
docker-compose down -v
pkill -f java

# Clean
docker system prune -f
rm -rf build/

# Restart
docker-compose up -d postgres redis
./gradlew clean build bootRun
```

### Check Everything

```bash
# Docker
docker ps
docker logs quiz-postgres
docker logs quiz-redis

# Application
curl http://localhost:8080/actuator/health
curl http://localhost:8080/api/v1/quizzes

# Database
docker exec -it quiz-postgres psql -U postgres -d quiz_db -c "\dt"

# Redis
docker exec -it quiz-redis redis-cli KEYS "*"
```

## 📚 More Info

- Full documentation: [TEST-README.md](./TEST-README.md)
- API documentation: http://localhost:8080/swagger-ui.html
- Actuator health: http://localhost:8080/actuator/health
