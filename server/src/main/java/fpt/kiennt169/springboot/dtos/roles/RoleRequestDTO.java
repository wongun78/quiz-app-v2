package fpt.kiennt169.springboot.dtos.roles;

import fpt.kiennt169.springboot.enums.RoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Role request for create/update")
public record RoleRequestDTO(
    
    @Schema(description = "Role name", example = "ROLE_ADMIN")
    @NotNull(message = "Role name is required")
    RoleEnum name,
    
    @Schema(description = "Role description", example = "Full system access with all administrative privileges", maxLength = 200)
    @Size(max = 200, message = "Description must be less than 200 characters")
    String description
) {}
