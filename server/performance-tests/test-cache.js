import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const cacheHitRate = new Rate("cache_hits");

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // Ramp up to 10 users
    { duration: "1m", target: 50 }, // Stay at 50 users
    { duration: "30s", target: 100 }, // Spike to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"], // Error rate should be below 1%
  },
};

const BASE_URL = "http://localhost:8080/api/v1";

export function setup() {
  // Login to get token
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: "rex@dinoquiz.academy",
      password: "Dino@2026",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  return { token: loginRes.json("accessToken") };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": "application/json",
  };

  // Test 1: Get all quizzes (should be cached after first request)
  const quizzesRes = http.get(`${BASE_URL}/admin/quizzes`, { headers });
  check(quizzesRes, {
    "quizzes status is 200": (r) => r.status === 200,
    "quizzes response time < 200ms": (r) => r.timings.duration < 200,
  });

  // Track cache performance (first request slower, subsequent faster)
  cacheHitRate.add(quizzesRes.timings.duration < 100);

  sleep(1);

  // Test 2: Get roles (should be cached, 24h TTL)
  const rolesRes = http.get(`${BASE_URL}/admin/roles`, { headers });
  check(rolesRes, {
    "roles status is 200": (r) => r.status === 200,
    "roles response time < 100ms": (r) => r.timings.duration < 100,
  });

  sleep(1);

  // Test 3: Get single quiz by ID (should be cached)
  const quizId = 1; // Replace with actual quiz ID
  const quizRes = http.get(`${BASE_URL}/quizzes/${quizId}`, { headers });
  check(quizRes, {
    "quiz detail status is 200": (r) => r.status === 200,
    "quiz detail response time < 150ms": (r) => r.timings.duration < 150,
  });

  sleep(1);

  // Test 4: Get questions for quiz (should be cached)
  const questionsRes = http.get(
    `${BASE_URL}/api/admin/questions?quizId=${quizId}`,
    { headers },
  );
  check(questionsRes, {
    "questions status is 200": (r) => r.status === 200,
    "questions response time < 150ms": (r) => r.timings.duration < 150,
  });

  sleep(2);
}

export function teardown(data) {
  console.log("Test completed");
}
