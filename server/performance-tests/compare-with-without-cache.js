import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

// Custom metrics to compare
const firstRequestTime = new Trend("first_request_duration");
const cachedRequestTime = new Trend("cached_request_duration");

export const options = {
  scenarios: {
    // Scenario 1: Test cache cold start
    cold_cache: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
      exec: "testColdCache",
    },
    // Scenario 2: Test with warm cache
    warm_cache: {
      executor: "constant-vus",
      vus: 50,
      duration: "2m",
      exec: "testWarmCache",
      startTime: "10s", // Start after cold cache test
    },
  },
};

const BASE_URL = "http://localhost:8080/api/v1";
let authToken = "";

export function setup() {
  console.log("🚀 Starting cache performance comparison test");
  console.log("📊 This will measure:");
  console.log("   - Cold cache performance (first request)");
  console.log("   - Warm cache performance (subsequent requests)");
  console.log("   - Cache hit ratio");
  console.log("");

  // Login to get token
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: "rex@dinoquiz.academy",
      password: "Dino@2026",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  const loginData = loginRes.json();

  // Debug: log response structure
  console.log(`Login response status: ${loginRes.status}`);
  console.log(
    `Login response body:`,
    JSON.stringify(loginData).substring(0, 200),
  );

  if (!loginData || !loginData.data || !loginData.data.token) {
    console.error("❌ Failed to get token from login response");
    console.error("Response:", JSON.stringify(loginData));
    throw new Error("Login failed - no token received");
  }

  authToken = loginData.data.token;
  console.log(`✓ Login successful, token obtained`);
  return { token: authToken };
}

// Test with cold cache (first requests will be slow - hitting database)
export function testColdCache(data) {
  console.log("❄️  Testing COLD cache (first request - will hit database)");

  const headers = {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": "application/json",
  };

  // First request - should hit database
  const startTime = Date.now();
  const res1 = http.get(`${BASE_URL}/admin/quizzes`, { headers });
  const duration1 = Date.now() - startTime;

  firstRequestTime.add(duration1);

  check(res1, {
    "cold cache - status 200": (r) => r.status === 200,
  });

  console.log(`   📈 First request (DB): ${duration1}ms`);

  sleep(1);

  // Second request - should be cached
  const startTime2 = Date.now();
  const res2 = http.get(`${BASE_URL}/admin/quizzes`, { headers });
  const duration2 = Date.now() - startTime2;

  cachedRequestTime.add(duration2);

  check(res2, {
    "warm cache - status 200": (r) => r.status === 200,
    "warm cache much faster": (r) => duration2 < duration1 * 0.5, // At least 50% faster
  });

  console.log(`   ⚡ Second request (Cache): ${duration2}ms`);
  console.log(
    `   🎯 Performance improvement: ${((1 - duration2 / duration1) * 100).toFixed(1)}%`,
  );
  console.log("");
}

// Test with warm cache (all requests should be fast)
export function testWarmCache(data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": "application/json",
  };

  // Test different cached endpoints
  const endpoints = [
    { url: `${BASE_URL}/admin/quizzes`, name: "quizzes" },
    { url: `${BASE_URL}/admin/roles`, name: "roles" },
    { url: `${BASE_URL}/admin/users`, name: "users" },
  ];

  endpoints.forEach((endpoint) => {
    const res = http.get(endpoint.url, { headers });

    cachedRequestTime.add(res.timings.duration);

    check(res, {
      [`${endpoint.name} cached - status 200`]: (r) => r.status === 200,
      [`${endpoint.name} cached - fast response`]: (r) =>
        r.timings.duration < 100,
    });
  });

  sleep(1);
}

export function teardown(data) {
  console.log("");
  console.log("✅ Cache performance test completed!");
  console.log("");
  console.log("📊 Check k6 output above for:");
  console.log("   - first_request_duration: Cold cache performance");
  console.log("   - cached_request_duration: Warm cache performance");
  console.log("   - Cache hit improvement ratio");
}
