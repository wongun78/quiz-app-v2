package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.util.Set;
import java.util.UUID;

@Schema(description = "User creation/update request payload")
public record UserRequestDTO(
    
    @Schema(description = "User email address (unique)", example = "nguyenvana@example.com")
    @NotBlank(message = "{validation.email.notblank}")
    @Email(message = "{validation.email.invalid}")
    String email,
    
    @Schema(description = "User password (min 8 characters)", example = "SecureP@ss123", minLength = 8)
    @NotBlank(message = "{validation.password.notblank}")
    @Size(min = 8, message = "{validation.password.size}")
    String password,
    
    @Schema(description = "User full name", example = "Nguyen Van A", maxLength = 100)
    @NotBlank(message = "{validation.fullname.notblank}")
    @Size(max = 100, message = "{validation.fullname.size}")
    String fullName,
    
    @Schema(description = "Whether the user account is active", example = "true")
    Boolean active,
    
    @Schema(description = "Set of role IDs to assign to the user", example = "[\"123e4567-e89b-12d3-a456-426614174000\"]")
    Set<UUID> roleIds
) {}
