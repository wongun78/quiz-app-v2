package fpt.kiennt169.springboot.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Rate Limiting Configuration Properties
 * 
 * Defines rate limits for different endpoint categories:
 * - Auth endpoints (login, register): Strict limits to prevent brute force
 * - API endpoints: General limits for normal API usage
 * 
 * @author Quiz Team
 * @version 2.0.0
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    private AuthRateLimit auth = new AuthRateLimit();
    private ApiRateLimit api = new ApiRateLimit();

    @Data
    public static class AuthRateLimit {
        private boolean enabled = true;
        private int capacity = 5; // Max 5 requests
        private int refillTokens = 5; // Refill 5 tokens
        private int refillPeriodMinutes = 1; // Every 1 minute
    }

    @Data
    public static class ApiRateLimit {
        private boolean enabled = true;
        private int capacity = 100; // Max 100 requests
        private int refillTokens = 100; // Refill 100 tokens
        private int refillPeriodMinutes = 1; // Every 1 minute
    }
}
