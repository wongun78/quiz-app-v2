package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Schema(description = "User information response (with roles)")
public record UserResponseDTO(
    @Schema(description = "User ID")
    UUID id,
    
    @Schema(description = "User email address", example = "nguyenvana@example.com")
    String email,
    
    @Schema(description = "Username", example = "nguyenvana")
    String username,
    
    @Schema(description = "User first name", example = "Nguyen")
    String firstName,
    
    @Schema(description = "User last name", example = "Van A")
    String lastName,
    
    @Schema(description = "User full name", example = "Nguyen Van A")
    String fullName,
    
    @Schema(description = "Date of birth", example = "1990-01-15")
    LocalDate dateOfBirth,
    
    @Schema(description = "Phone number", example = "+84987654321")
    String phoneNumber,
    
    @Schema(description = "Whether the user account is active", example = "true")
    Boolean active,
    
    @Schema(description = "Set of roles assigned to this user", example = "[ROLE_ADMIN, ROLE_USER]")
    Set<String> roles
) {}
