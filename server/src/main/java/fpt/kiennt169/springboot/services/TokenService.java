package fpt.kiennt169.springboot.services;

import java.util.Set;

import org.springframework.security.core.Authentication;

import fpt.kiennt169.springboot.entities.User;

/**
 * Service interface for JWT token operations
 * 
 * Provides business logic for:
 * - Generating access and refresh tokens
 * - Validating JWT tokens
 * - Extracting user information from tokens
 * - Creating Authentication objects from tokens
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface TokenService {
    /**
     * Generate JWT access token for authenticated user
     * 
     * @param user the authenticated user
     * @param roles the user's roles
     * @return JWT access token string
     */
    String generateToken(User user, Set<String> roles);
    
    /**
     * Generate secure random refresh token
     * Uses UUID for cryptographically strong random token
     * 
     * @return secure random refresh token string
     */
    String generateRefreshToken();

    /**
     * Create Authentication object from JWT token
     * 
     * @param token the JWT access token
     * @return Authentication object with user details and authorities
     */
    Authentication getAuthenticationFromToken(String token);
}
