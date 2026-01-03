package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;
import java.util.UUID;

@Schema(description = "User information response (with roles)")
public record UserResponseDTO(
    @Schema(description = "User ID")
    UUID id,
    
    @Schema(description = "User email address", example = "nguyenvana@example.com")
    String email,
    
    @Schema(description = "User full name", example = "Nguyen Van A")
    String fullName,
    
    @Schema(description = "Whether the user account is active", example = "true")
    Boolean active,
    
    @Schema(description = "Set of roles assigned to this user", example = "[ROLE_ADMIN, ROLE_USER]")
    Set<String> roles
) {}
