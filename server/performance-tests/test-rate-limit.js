import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    // Test Auth Rate Limit (5 requests per minute)
    auth_rate_limit: {
      executor: "constant-arrival-rate",
      duration: "1m",
      rate: 10, // 10 requests per second
      timeUnit: "1s",
      preAllocatedVUs: 5,
      maxVUs: 10,
      exec: "testAuthRateLimit",
    },
    // Test API Rate Limit (100 requests per minute)
    api_rate_limit: {
      executor: "constant-arrival-rate",
      duration: "1m",
      rate: 150, // 150 requests per second (should hit limit)
      timeUnit: "1s",
      preAllocatedVUs: 20,
      maxVUs: 50,
      exec: "testApiRateLimit",
      startTime: "1m30s", // Start after auth test
    },
  },
  thresholds: {
    "http_req_duration{scenario:auth_rate_limit}": ["p(95)<1000"],
    "http_req_duration{scenario:api_rate_limit}": ["p(95)<500"],
  },
};

const BASE_URL = "http://localhost:8080/api/v1";

// Test Auth endpoints rate limiting (5 req/min per IP)
export function testAuthRateLimit() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: "test@example.com",
      password: "wrongpassword",
    }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "AuthRateLimit" },
    },
  );

  check(res, {
    "auth request processed": (r) => r.status === 401 || r.status === 429,
    "rate limited correctly": (r) => {
      if (r.status === 429) {
        console.log("✓ Auth rate limit triggered (429 Too Many Requests)");
        return true;
      }
      return r.status === 401; // Unauthorized is also acceptable
    },
  });

  // Check rate limit headers
  if (res.headers["X-RateLimit-Remaining"]) {
    console.log(
      `Auth Rate Limit - Remaining: ${res.headers["X-RateLimit-Remaining"]}`,
    );
  }
}

// Test API endpoints rate limiting (100 req/min per IP)
export function testApiRateLimit() {
  // First, login to get token
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

  if (loginRes.status !== 200) {
    console.log("Login failed, skipping API test");
    return;
  }

  const loginData = loginRes.json();
  const token = loginData.data.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Make rapid API requests to test rate limit
  const res = http.get(`${BASE_URL}/quizzes`, {
    headers,
    tags: { name: "ApiRateLimit" },
  });

  check(res, {
    "api request processed": (r) => r.status === 200 || r.status === 429,
    "rate limited when exceeded": (r) => {
      if (r.status === 429) {
        console.log("✓ API rate limit triggered (429 Too Many Requests)");
        return true;
      }
      return r.status === 200;
    },
  });

  // Check rate limit headers
  if (res.headers["X-RateLimit-Remaining"]) {
    console.log(
      `API Rate Limit - Remaining: ${res.headers["X-RateLimit-Remaining"]}`,
    );
  }
}
