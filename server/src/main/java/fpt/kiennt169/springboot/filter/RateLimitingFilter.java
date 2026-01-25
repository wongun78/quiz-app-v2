package fpt.kiennt169.springboot.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import fpt.kiennt169.springboot.config.RateLimitProperties;

import java.io.IOException;
import java.time.Duration;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ProxyManager<String> proxyManager;
    private final RateLimitProperties rateLimitProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        if (shouldSkipRateLimit(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean isAuth = isAuthEndpoint(path);
        Object configObj = isAuth ? rateLimitProperties.getAuth() : rateLimitProperties.getApi();
        String bucketKeyPrefix = isAuth ? "rate_limit:auth:" : "rate_limit:api:";
        
        boolean isEnabled = isAuth 
            ? rateLimitProperties.getAuth().isEnabled() 
            : rateLimitProperties.getApi().isEnabled();
            
        if (!isEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientId = getClientIP(request);
        String bucketKey = bucketKeyPrefix + clientId;

        Bucket bucket = proxyManager.builder().build(bucketKey, getBucketConfiguration(configObj, isAuth));

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for client: {} on path: {}", clientId, path);
            
            int refillPeriodMinutes = isAuth 
                ? rateLimitProperties.getAuth().getRefillPeriodMinutes()
                : rateLimitProperties.getApi().getRefillPeriodMinutes();
            
            response.setStatus(429); 
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                "{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Please try again later.\",\"retryAfter\":%d}",
                refillPeriodMinutes * 60
            ));
        }
    }

    private Supplier<BucketConfiguration> getBucketConfiguration(Object config, boolean isAuth) {
        return () -> {
            int capacity;
            int refillTokens;
            int refillPeriodMinutes;
            
            if (isAuth) {
                RateLimitProperties.AuthRateLimit authConfig = (RateLimitProperties.AuthRateLimit) config;
                capacity = authConfig.getCapacity();
                refillTokens = authConfig.getRefillTokens();
                refillPeriodMinutes = authConfig.getRefillPeriodMinutes();
            } else {
                RateLimitProperties.ApiRateLimit apiConfig = (RateLimitProperties.ApiRateLimit) config;
                capacity = apiConfig.getCapacity();
                refillTokens = apiConfig.getRefillTokens();
                refillPeriodMinutes = apiConfig.getRefillPeriodMinutes();
            }
            
            Bandwidth limit = Bandwidth.builder()
                    .capacity(capacity)
                    .refillIntervally(refillTokens, Duration.ofMinutes(refillPeriodMinutes))
                    .build();
            
            return BucketConfiguration.builder()
                    .addLimit(limit)
                    .build();
        };
    }

    private boolean isAuthEndpoint(String path) {
        return path.startsWith("/api/v1/auth/login") || 
               path.startsWith("/api/v1/auth/register");
    }

    private boolean shouldSkipRateLimit(String path) {
        return path.startsWith("/swagger-ui") ||
               path.startsWith("/api-docs") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/actuator");
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
