import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 20 }, // Ramp up to 20 users
    { duration: "2m", target: 50 }, // Stay at 50 users
    { duration: "1m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<300"], // 95% should be under 300ms
    "http_req_duration{endpoint:refresh}": ["p(95)<100"], // Refresh should be fast (cached)
  },
};

const BASE_URL = "http://localhost:8080/api/v1";

export function setup() {
  // Login to get initial tokens
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

  const cookies = loginRes.cookies;
  let refreshToken = "";

  for (let key in cookies) {
    if (cookies[key][0].name === "refresh_token") {
      refreshToken = cookies[key][0].value;
      break;
    }
  }

  return {
    accessToken: loginRes.json("accessToken"),
    refreshToken: refreshToken,
  };
}

export default function (data) {
  // Test 1: Use access token to make API request
  const headers = {
    Authorization: `Bearer ${data.accessToken}`,
    "Content-Type": "application/json",
  };

  const quizzesRes = http.get(`${BASE_URL}/quizzes`, {
    headers,
    tags: { endpoint: "api" },
  });

  check(quizzesRes, {
    "api call successful": (r) => r.status === 200,
    "api response fast": (r) => r.timings.duration < 200,
  });

  sleep(2);

  // Test 2: Refresh token (should be cached in Redis)
  const refreshRes = http.post(`${BASE_URL}/auth/refresh-token`, null, {
    cookies: { refresh_token: data.refreshToken },
    tags: { endpoint: "refresh" },
  });

  check(refreshRes, {
    "token refresh successful": (r) => r.status === 200,
    "refresh very fast (Redis cached)": (r) => {
      const isFast = r.timings.duration < 100;
      if (isFast) {
        console.log(
          `✓ Fast refresh: ${r.timings.duration.toFixed(2)}ms (Redis cache hit)`,
        );
      }
      return isFast;
    },
    "new access token received": (r) => r.json("accessToken") !== undefined,
  });

  // Update access token if refresh successful
  if (refreshRes.status === 200) {
    const refreshData = refreshRes.json();
    data.accessToken = refreshData.data.token;
  }

  sleep(3);
}

export function teardown(data) {
  console.log("Token refresh test completed");
}
