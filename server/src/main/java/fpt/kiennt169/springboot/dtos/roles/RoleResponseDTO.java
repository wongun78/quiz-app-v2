package fpt.kiennt169.springboot.dtos.roles;

import fpt.kiennt169.springboot.enums.RoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Role information response")
public record RoleResponseDTO(
    
    @Schema(description = "Role ID", example = "123e4567-e89b-12d3-a456-426614174000")
    UUID id,
    
    @Schema(description = "Role name", example = "ROLE_ADMIN")
    RoleEnum name,
    
    @Schema(description = "Role description", example = "Full system access with all administrative privileges")
    String description,
    
    @Schema(description = "Created timestamp", example = "2025-12-26T10:30:00")
    LocalDateTime createdAt,
    
    @Schema(description = "Updated timestamp", example = "2025-12-26T15:45:00")
    LocalDateTime updatedAt,
    
    @Schema(description = "Whether the role is deleted (soft delete)", example = "false")
    Boolean isDeleted
) {}
