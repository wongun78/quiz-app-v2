# Performance Testing Suite for Quiz App with Redis

## Prerequisites

### Install k6 (Load Testing Tool)

```bash
# macOS
brew install k6

# Or via official installer
brew install k6
```

### Ensure Services are Running

```bash
# Check Docker containers
docker ps

# Should see:
# - quiz-postgres (PostgreSQL)
# - quiz-redis (Redis)

# Start application
cd /Users/wongun78/Vault/cong2008/quiz-app-v2/server
./gradlew bootRun
```

## Test Suites

### 1. Cache Performance Test

Tests Redis caching effectiveness for roles, users, quizzes, and questions.

```bash
cd /Users/wongun78/Vault/cong2008/quiz-app-v2/server/performance-tests
k6 run test-cache.js
```

**What it tests:**

- Response time for cached vs non-cached requests
- Cache hit rate
- Performance under load (10 → 50 → 100 concurrent users)

**Expected Results:**

- First request: 100-300ms (database query)
- Cached requests: 10-50ms (Redis)
- 95th percentile < 500ms

---

### 2. Rate Limiting Test

Tests Bucket4j + Redisson rate limiting for auth and API endpoints.

```bash
k6 run test-rate-limit.js
```

**What it tests:**

- Auth rate limit: 5 requests/minute per IP
- API rate limit: 100 requests/minute per IP
- Proper 429 (Too Many Requests) responses
- Rate limit headers (X-RateLimit-Remaining)

**Expected Results:**

- Auth: After 5 requests, should return 429
- API: After 100 requests, should return 429
- Rate limit headers present in response

---

### 3. Token Refresh Performance Test

Tests refresh token caching in Redis.

```bash
k6 run test-token-refresh.js
```

**What it tests:**

- Refresh token validation speed (cached in Redis)
- Token refresh under load (20 → 50 concurrent users)
- Response time < 100ms (Redis cache)

**Expected Results:**

- Token refresh: < 100ms (Redis cached)
- High throughput (500+ req/s)
- No token validation errors

---

### 4. Cache Comparison Test (Most Important!)

Compares performance with cold cache vs warm cache.

```bash
k6 run compare-with-without-cache.js
```

**What it tests:**

- Cold cache (first request → database)
- Warm cache (subsequent requests → Redis)
- Performance improvement percentage

**Expected Results:**

```
❄️  Testing COLD cache (first request - will hit database)
   📈 First request (DB): 250ms
   ⚡ Second request (Cache): 25ms
   🎯 Performance improvement: 90.0%
```

---

## Monitoring During Tests

### 1. Monitor Redis Cache in Real-time

Open a new terminal and run:

```bash
# Watch Redis commands
docker exec -it quiz-redis redis-cli MONITOR

# Or check cache statistics
docker exec -it quiz-redis redis-cli INFO stats
```

### 2. Monitor Application Logs

```bash
tail -f /Users/wongun78/Vault/cong2008/quiz-app-v2/server/logs/application.log
```

### 3. Spring Boot Actuator Metrics

Open browser:

```
http://localhost:8080/actuator/metrics/cache.gets
http://localhost:8080/actuator/metrics/cache.puts
http://localhost:8080/actuator/health
```

### 4. Redis Insight (GUI Tool - Optional)

```bash
brew install --cask redisinsight

# Connect to: localhost:6379
```

---

## Full Test Sequence

Run all tests in order:

```bash
# 1. Cache comparison (warm up + measure)
k6 run compare-with-without-cache.js

# 2. Full cache load test
k6 run test-cache.js

# 3. Token refresh performance
k6 run test-token-refresh.js

# 4. Rate limiting test
k6 run test-rate-limit.js
```

---

## Understanding k6 Output

### Key Metrics:

```
http_req_duration..............: avg=45ms  min=10ms med=35ms max=150ms p(90)=80ms p(95)=100ms
  ✓ { expected_response:true }.: avg=45ms  min=10ms med=35ms max=150ms p(90)=80ms p(95)=100ms

http_reqs......................: 12543   209.05/s
```

**What this means:**

- **avg**: Average response time (45ms) ← Should be low with cache
- **p(95)**: 95% of requests < 100ms ← Important threshold
- **http_reqs**: Total requests (12,543) at 209 req/s ← Throughput

### Success Criteria:

✅ **With Redis Cache:**

- Cached requests: < 50ms
- p(95) < 100ms
- Throughput: > 200 req/s

❌ **Without Cache (comparison):**

- Database requests: 200-500ms
- p(95) > 300ms
- Throughput: < 50 req/s

---

## Advanced: JMeter Test Plan (Optional)

If you prefer GUI tool:

1. Install JMeter:

```bash
brew install jmeter
jmeter
```

2. Create test plan with:
   - Thread Group (100 users)
   - HTTP Request (GET /api/quizzes)
   - View Results Tree
   - Summary Report
   - Graph Results

---

## Cleanup After Tests

```bash
# Clear Redis cache to start fresh
docker exec -it quiz-redis redis-cli FLUSHDB

# Restart application
./gradlew bootRun
```

---

## Troubleshooting

### Issue: "Connection refused"

```bash
# Check if app is running
curl http://localhost:8080/actuator/health

# Check if Redis is running
docker ps | grep quiz-redis
```

### Issue: "401 Unauthorized"

- Update credentials in test files
- Check `rex@dinoquiz.academy` / `Dino@2026`

### Issue: "429 Too Many Requests" immediately

- Rate limit bucket not reset
- Clear Redis: `docker exec -it quiz-redis redis-cli FLUSHDB`

---

## Expected Performance Improvements

| Metric              | Without Redis | With Redis | Improvement       |
| ------------------- | ------------- | ---------- | ----------------- |
| Response Time (avg) | 250ms         | 25ms       | **90%**           |
| Throughput          | 50 req/s      | 500+ req/s | **10x**           |
| Database Load       | 100%          | 10%        | **90% reduction** |
| Token Validation    | 100ms         | 10ms       | **90%**           |
| Rate Limit Check    | N/A           | 5ms        | Distributed       |

---

## Next Steps

1. Run `compare-with-without-cache.js` first to see dramatic improvement
2. Monitor Redis with `redis-cli MONITOR`
3. Check Spring Boot Actuator for cache metrics
4. Run full load test suite
5. Document your results!

Happy Testing! 🚀
