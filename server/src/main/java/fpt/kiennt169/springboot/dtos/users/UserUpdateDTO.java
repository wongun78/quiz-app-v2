package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.util.Set;
import java.util.UUID;

@Schema(description = "User update request payload - password is optional")
public record UserUpdateDTO(
    
    @Schema(description = "User email address (unique)", example = "newuser@quiz.com")
    @NotBlank(message = "{validation.email.notblank}")
    @Email(message = "{validation.email.invalid}")
    String email,
    
    @Schema(description = "New password (optional - only include to change password)", 
            example = "NewPass@123", 
            minLength = 8)
    String password,
    
    @Schema(description = "User full name", example = "Test User", maxLength = 100)
    @NotBlank(message = "{validation.fullname.notblank}")
    @Size(max = 100, message = "{validation.fullname.size}")
    String fullName,
    
    @Schema(description = "Whether the user account is active", example = "true")
    Boolean active,
    
    @Schema(description = "Set of role IDs to assign to the user", example = "[\"123e4567-e89b-12d3-a456-426614174000\"]")
    Set<UUID> roleIds
) {}
