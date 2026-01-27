package fpt.kiennt169.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@EnableCaching
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    @Value("${spring.data.redis.database:0}")
    private int redisDatabase;

    @Bean
    @Primary
    public RedisConnectionFactory redisConnectionFactory() {
        log.info("Initializing Lettuce connection factory - Host: {}, Port: {}, DB: {}", 
            redisHost, redisPort, redisDatabase);
        
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisHost);
        config.setPort(redisPort);
        config.setDatabase(redisDatabase);
        
        if (redisPassword != null && !redisPassword.isEmpty()) {
            config.setPassword(redisPassword);
            log.debug("Redis password configured");
        }
        
        LettuceConnectionFactory factory = new LettuceConnectionFactory(config);
        
        log.info("Lettuce connection factory initialized successfully");
        return factory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        log.info("Creating RedisTemplate with JSON serialization");
        
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        BasicPolymorphicTypeValidator typeValidator = BasicPolymorphicTypeValidator.builder()
            .allowIfBaseType(Object.class)
            .build();
        objectMapper.activateDefaultTyping(
            typeValidator,
            ObjectMapper.DefaultTyping.NON_FINAL
        );
        
        RedisSerializer<Object> jsonSerializer = new CustomJacksonRedisSerializer(objectMapper);
        
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        
        template.setKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setHashValueSerializer(jsonSerializer);
        
        template.afterPropertiesSet();
        
        log.info("RedisTemplate configured successfully");
        return template;
    }


    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        log.info("Configuring Spring Cache Manager with Redis");
        
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        BasicPolymorphicTypeValidator typeValidator = BasicPolymorphicTypeValidator.builder()
            .allowIfBaseType(Object.class)
            .build();
        objectMapper.activateDefaultTyping(typeValidator, ObjectMapper.DefaultTyping.NON_FINAL);
        
        CustomJacksonRedisSerializer cacheSerializer = new CustomJacksonRedisSerializer(objectMapper);
        
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                )
                .serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(cacheSerializer)
                )
                .disableCachingNullValues();
        
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        cacheConfigurations.put("roles", 
            defaultConfig.entryTtl(Duration.ofHours(24)));
        
        cacheConfigurations.put("users", 
            defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        cacheConfigurations.put("quizzes", 
            defaultConfig.entryTtl(Duration.ofHours(1)));
        
        cacheConfigurations.put("questions", 
            defaultConfig.entryTtl(Duration.ofHours(1)));
        
        RedisCacheManager cacheManager = RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware() 
                .build();
        
        log.info("Cache Manager initialized with custom TTL policies");
        log.debug("Cache TTLs - roles:24h, users:15m, quizzes:1h, questions:1h, default:30m");
        
        return cacheManager;
    }

}
