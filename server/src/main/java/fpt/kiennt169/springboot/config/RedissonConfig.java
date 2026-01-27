package fpt.kiennt169.springboot.config;

import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.redisson.cas.RedissonBasedProxyManager;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.codec.JsonJacksonCodec;
import org.redisson.config.Config;
import org.redisson.spring.data.connection.RedissonConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class RedissonConfig {

    @Value("${REDIS_HOST:localhost}")
    private String redisHost;

    @Value("${REDIS_PORT:6379}")
    private String redisPort;

    @Value("${REDIS_PASSWORD:}")
    private String redisPassword;

    @Value("${REDIS_DATABASE:0}")
    private int redisDatabase;

    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() {
        log.info("Initializing Redisson client for rate limiting");
        
        Config config = new Config();
        String address = "redis://" + redisHost + ":" + redisPort;
        
        config.useSingleServer()
                .setAddress(address)
                .setPassword(redisPassword.isEmpty() ? null : redisPassword)
                .setDatabase(redisDatabase)
                .setConnectionPoolSize(32)
                .setConnectionMinimumIdleSize(8)
                .setTimeout(3000)
                .setConnectTimeout(10000)
                .setRetryAttempts(3)
                .setRetryInterval(1500);
        
        config.setCodec(new JsonJacksonCodec());
        config.setThreads(16);
        config.setNettyThreads(32);
        
        RedissonClient client = Redisson.create(config);
        
        log.info("Redisson client initialized successfully with address: {}", address);
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
