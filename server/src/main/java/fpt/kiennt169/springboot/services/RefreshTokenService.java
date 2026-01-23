package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.entities.RefreshToken;

import java.util.Optional;

/**
 * RefreshTokenService Interface
 * 
 * Manages refresh tokens in Redis with TTL and automatic cleanup
 * 
 * @author Quiz Team
 * @version 2.0.0
 */
public interface RefreshTokenService {

    /**
     * Save refresh token to Redis with TTL
     * 
     * @param refreshToken the refresh token to save
     * @param ttlSeconds Time-To-Live in seconds
     */
    void saveRefreshToken(RefreshToken refreshToken, long ttlSeconds);

    /**
     * Find refresh token by token string
     * 
     * @param token the token string
     * @return Optional containing RefreshToken if found
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Find refresh token by email
     * Useful for finding active sessions by user
     * 
     * @param email user email
     * @return Optional containing RefreshToken if found
     */
    Optional<RefreshToken> findByEmail(String email);

    /**
     * Delete refresh token
     * Called on logout or when token is compromised
     * 
     * @param token the token string to delete
     */
    void deleteToken(String token);
}
