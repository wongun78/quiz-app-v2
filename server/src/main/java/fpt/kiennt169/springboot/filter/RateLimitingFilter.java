package fpt.kiennt169.springboot.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.redisson.cas.RedissonBasedProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RedissonClient;
import org.redisson.command.CommandSyncService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import fpt.kiennt169.springboot.config.RateLimitProperties;

import java.io.IOException;
import java.time.Duration;
import java.util.function.Supplier;

/**
 * Rate Limiting Filter using Bucket4j + Redisson
 * 
 * Implements Token Bucket algorithm with distributed storage in Redis:
 * - Each client (by IP) gets a bucket with limited tokens
 * - Each request consumes 1 token
 * - Tokens refill at configured rate
 * - If bucket empty → 429 Too Many Requests
 * 
 * Endpoint Categories:
 * - /api/v1/auth/** → Strict limits (prevent brute force attacks)
 * - Other APIs → General limits (prevent abuse)
 * 
 * @author Quiz Team
 * @version 2.0.0
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RedissonClient redissonClient;
    private final RateLimitProperties rateLimitProperties;

    private ProxyManager<String> proxyManager;

    @Override
    protected void initFilterBean() {
        // Initialize Redisson-based ProxyManager for distributed buckets
        CommandSyncService commandSyncService = new CommandSyncService(redissonClient.getConnectionManager());
        this.proxyManager = RedissonBasedProxyManager.builderFor(commandSyncService)
                .build();
        
        log.info("Rate limiting filter initialized with Redisson proxy manager");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // Skip rate limiting for public endpoints
        if (shouldSkipRateLimit(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Determine which rate limit config to use
        RateLimitProperties.AuthRateLimit config;
        String bucketKeyPrefix;
        
        if (isAuthEndpoint(path)) {
            config = rateLimitProperties.getAuth();
            bucketKeyPrefix = "rate_limit:auth:";
            
            if (!config.isEnabled()) {
                filterChain.doFilter(request, response);
                return;
            }
        } else {
            config = rateLimitProperties.getApi();
            bucketKeyPrefix = "rate_limit:api:";
            
            if (!config.isEnabled()) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        // Get client identifier (IP address)
        String clientId = getClientIP(request);
        String bucketKey = bucketKeyPrefix + clientId;

        // Get or create bucket for this client
        Bucket bucket = proxyManager.builder().build(bucketKey, getBucketConfiguration(config));

        // Try to consume 1 token
        if (bucket.tryConsume(1)) {
            // Token available - allow request
            filterChain.doFilter(request, response);
        } else {
            // No tokens available - rate limit exceeded
            log.warn("Rate limit exceeded for client: {} on path: {}", clientId, path);
            
            response.setStatus(HttpServletResponse.SC_TOO_MANY_REQUESTS);
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                "{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Please try again later.\",\"retryAfter\":%d}",
                config.getRefillPeriodMinutes() * 60
            ));
        }
    }

    /**
     * Create bucket configuration based on rate limit settings
     */
    private Supplier<BucketConfiguration> getBucketConfiguration(RateLimitProperties.AuthRateLimit config) {
        return () -> {
            Bandwidth limit = Bandwidth.builder()
                    .capacity(config.getCapacity())
                    .refillIntervally(config.getRefillTokens(), 
                                     Duration.ofMinutes(config.getRefillPeriodMinutes()))
                    .build();
            
            return BucketConfiguration.builder()
                    .addLimit(limit)
                    .build();
        };
    }

    /**
     * Check if path is authentication endpoint
     */
    private boolean isAuthEndpoint(String path) {
        return path.startsWith("/api/v1/auth/login") || 
               path.startsWith("/api/v1/auth/register");
    }

    /**
     * Skip rate limiting for these endpoints
     */
    private boolean shouldSkipRateLimit(String path) {
        return path.startsWith("/swagger-ui") ||
               path.startsWith("/api-docs") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/actuator");
    }

    /**
     * Extract client IP address from request
     * Considers X-Forwarded-For header for proxy/load balancer scenarios
     */
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // X-Forwarded-For can contain multiple IPs, take the first one
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
