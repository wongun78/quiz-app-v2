package fpt.kiennt169.springboot.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.spring.data.connection.RedissonConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**
 * Redisson Configuration for Distributed Rate Limiting
 * 
 * Purpose: Configure Redisson client for Bucket4j rate limiting
 * 
 * Why Redisson for Rate Limiting:
 * - Built-in distributed rate limiter support
 * - Atomic operations for bucket tokens
 * - High performance for rate limiting use case
 * - Thread-safe across multiple instances
 * 
 * Separate from Lettuce (refresh tokens) because:
 * - Lettuce: Simple CRUD operations, native Spring integration
 * - Redisson: Advanced features (rate limiting, distributed locks)
 * 
 * @author Quiz Team
 * @version 2.0.0
 */
@Slf4j
@Configuration
public class RedissonConfig {

    /**
     * Create RedissonClient for rate limiting operations
     * Loads configuration from redisson-config.yml
     * 
     * @return configured RedissonClient instance
     * @throws IOException if config file cannot be read
     */
    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() throws IOException {
        log.info("Initializing Redisson client for rate limiting");
        
        Config config = Config.fromYAML(new ClassPathResource("redisson-config.yml").getInputStream());
        
        RedissonClient client = Redisson.create(config);
        
        log.info("Redisson client initialized successfully");
        return client;
    }

    /**
     * Optional: RedissonConnectionFactory for Spring Data Redis compatibility
     * Only create if you need Redisson features with Spring Data Redis
     * 
     * @param redissonClient the Redisson client
     * @return RedissonConnectionFactory
     */
    @Bean
    public RedissonConnectionFactory redissonConnectionFactory(RedissonClient redissonClient) {
        return new RedissonConnectionFactory(redissonClient);
    }
}
