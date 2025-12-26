package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Set;

@Schema(description = "Authentication response with JWT tokens and user details")
public record AuthResponseDTO(
    
    @Schema(description = "JWT access token (24h validity)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    String token,
    
    @Schema(description = "JWT refresh token (7 days validity, HttpOnly cookie)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    String refreshToken,
    
    @Schema(description = "User information")
    UserResponseDTO user,
    
    @Schema(description = "User role names", example = "[\"ROLE_ADMIN\", \"ROLE_USER\"]")
    Set<String> roles
) {}
