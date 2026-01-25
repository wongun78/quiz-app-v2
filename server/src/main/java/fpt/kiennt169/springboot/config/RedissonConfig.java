package fpt.kiennt169.springboot.config;

import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.redisson.cas.RedissonBasedProxyManager;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.spring.data.connection.RedissonConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
@Configuration
public class RedissonConfig {

    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() throws IOException {
        log.info("Initializing Redisson client for rate limiting");
        
        Config config = Config.fromYAML(new ClassPathResource("redisson-config.yml").getInputStream());
        
        RedissonClient client = Redisson.create(config);
        
        log.info("Redisson client initialized successfully");
        return client;
    }

    @Bean
    public RedissonConnectionFactory redissonConnectionFactory(RedissonClient redissonClient) {
        return new RedissonConnectionFactory(redissonClient);
    }

    @Bean
    public ProxyManager<String> bucket4jProxyManager(RedissonClient redissonClient) {
        log.info("Creating Bucket4j ProxyManager with Redisson backend");
        
        Redisson redisson = (Redisson) redissonClient;
        
        return RedissonBasedProxyManager.builderFor(redisson.getCommandExecutor())
                .build();
    }
}
