package fpt.kiennt169.springboot.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    private AuthRateLimit auth = new AuthRateLimit();
    private ApiRateLimit api = new ApiRateLimit();

    @Data
    public static class AuthRateLimit {
        private boolean enabled = true;
        private int capacity = 5; 
        private int refillTokens = 5; 
        private int refillPeriodMinutes = 1; 
    }

    @Data
    public static class ApiRateLimit {
        private boolean enabled = true;
        private int capacity = 100; 
        private int refillTokens = 100;
        private int refillPeriodMinutes = 1;
    }
}
