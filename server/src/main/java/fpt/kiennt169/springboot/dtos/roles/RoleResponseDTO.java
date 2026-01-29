package fpt.kiennt169.springboot.dtos.roles;

import fpt.kiennt169.springboot.enums.RoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Role information response")
public class RoleResponseDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "Role ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;
    
    @Schema(description = "Role name", example = "ROLE_ADMIN")
    private RoleEnum name;
    
    @Schema(description = "Role description", example = "Full system access with all administrative privileges")
    private String description;
    
    @Schema(description = "Created timestamp", example = "2025-12-26T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Updated timestamp", example = "2025-12-26T15:45:00")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Whether the role is deleted (soft delete)", example = "false")
    private Boolean isDeleted;
}
