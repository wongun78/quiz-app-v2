package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.entities.RefreshToken;
import fpt.kiennt169.springboot.exceptions.TokenServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String TOKEN_PREFIX = "refresh_token:";
    private static final String USER_TOKENS_PREFIX = "refresh_token:user:";
    private static final String EMAIL_TOKEN_PREFIX = "refresh_token:email:";

    @Override
    public void saveRefreshToken(RefreshToken refreshToken, long ttlSeconds) {
        String tokenKey = TOKEN_PREFIX + refreshToken.getToken();
        String userTokensKey = USER_TOKENS_PREFIX + refreshToken.getUserId();
        String emailTokenKey = EMAIL_TOKEN_PREFIX + refreshToken.getEmail();

        try {
            redisTemplate.opsForValue().set(tokenKey, refreshToken, ttlSeconds, TimeUnit.SECONDS);

            redisTemplate.opsForHash().put(userTokensKey, 
                refreshToken.getToken(), 
                refreshToken.getCreatedAt().toString());
            redisTemplate.expire(userTokensKey, ttlSeconds, TimeUnit.SECONDS);

            String previousToken = (String) redisTemplate.opsForValue().get(emailTokenKey);
            
            if (previousToken != null && !previousToken.equals(refreshToken.getToken())) {
                log.debug("Deleting previous token for email: {}", refreshToken.getEmail());
                deleteToken(previousToken);
            }
            
            redisTemplate.opsForValue().set(emailTokenKey, refreshToken.getToken(), 
                ttlSeconds, TimeUnit.SECONDS);
            
            log.debug("Refresh token saved to Redis - Email: {}, TTL: {}s", 
                refreshToken.getEmail(), ttlSeconds);

        } catch (Exception e) {
            log.error("Failed to save refresh token to Redis", e);
            throw new TokenServiceException("Failed to save refresh token", e);
        }
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        String tokenKey = TOKEN_PREFIX + token;

        try {
            RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(tokenKey);

            if (refreshToken != null) {
                log.debug("Refresh token found in Redis: {}", token.substring(0, 10) + "...");
                
                if (refreshToken.isExpired()) {
                    log.warn("Found expired token in Redis, deleting: {}", token.substring(0, 10) + "...");
                    deleteToken(token);
                    return Optional.empty();
                }
                
                return Optional.of(refreshToken);
            }

            log.debug("Refresh token not found in Redis: {}", token.substring(0, 10) + "...");
            return Optional.empty();

        } catch (Exception e) {
            log.error("Failed to retrieve refresh token from Redis", e);
            return Optional.empty();
        }
    }

    @Override
    public Optional<RefreshToken> findByEmail(String email) {
        String emailTokenKey = EMAIL_TOKEN_PREFIX + email;

        try {
            String token = (String) redisTemplate.opsForValue().get(emailTokenKey);
            if (token != null) {
                log.debug("Found token for email: {}", email);
                return findByToken(token);
            }

            log.debug("No token found for email: {}", email);
            return Optional.empty();

        } catch (Exception e) {
            log.error("Failed to retrieve token by email from Redis", e);
            return Optional.empty();
        }
    }

    @Override
    public void deleteToken(String token) {
        try {
            String tokenKey = TOKEN_PREFIX + token;
            
            RefreshToken refreshToken = (RefreshToken) redisTemplate.opsForValue().get(tokenKey);

            if (refreshToken != null) {
                String userTokensKey = USER_TOKENS_PREFIX + refreshToken.getUserId();
                String emailTokenKey = EMAIL_TOKEN_PREFIX + refreshToken.getEmail();

                redisTemplate.delete(tokenKey);

                redisTemplate.opsForHash().delete(userTokensKey, token);

                String currentEmailToken = (String) redisTemplate.opsForValue().get(emailTokenKey);
                if (token.equals(currentEmailToken)) {
                    redisTemplate.delete(emailTokenKey);
                }
                
                log.info("Refresh token deleted from Redis - User: {}", refreshToken.getEmail());
            } else {
                log.debug("Token already deleted or expired: {}", token.substring(0, 10) + "...");
            }

        } catch (Exception e) {
            log.error("Failed to delete refresh token from Redis", e);
        }
    }
}
