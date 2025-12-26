package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.users.AuthResponseDTO;
import fpt.kiennt169.springboot.dtos.users.LoginRequestDTO;
import fpt.kiennt169.springboot.dtos.users.RegisterRequestDTO;

/**
 * Service interface for authentication and authorization
 * 
 * Provides business logic for:
 * - User login and registration
 * - JWT token generation and validation
 * - Refresh token management
 * - User session handling
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface AuthService {
    
    /**
     * Authenticate user and generate access/refresh tokens
     * 
     * @param loginRequest the login credentials (email and password)
     * @return authentication response with tokens and user details
     */
    AuthResponseDTO login(LoginRequestDTO loginRequest);
    
    /**
     * Register a new user account
     * 
     * @param registerRequest the registration data
     * @return authentication response with tokens and user details
     */
    AuthResponseDTO register(RegisterRequestDTO registerRequest);
    
    /**
     * Refresh access token using refresh token
     * 
     * @param refreshToken the refresh token
     * @return authentication response with new access token
     */
    AuthResponseDTO refresh(String refreshToken);
    
    /**
     * Logout current user and invalidate refresh token
     */
    void logout();
}
