package fpt.kiennt169.springboot.controllers;

import fpt.kiennt169.springboot.dtos.ApiResponse;
import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.roles.RoleRequestDTO;
import fpt.kiennt169.springboot.dtos.roles.RoleResponseDTO;
import fpt.kiennt169.springboot.services.RoleService;
import fpt.kiennt169.springboot.util.MessageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@Tag(name = "Roles", description = "Role management APIs - CRUD operations")
@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    private final MessageUtil messageUtil;

    @Operation(
        summary = "Create new role",
        description = "Create a new role"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "Role created successfully",
            content = @Content(schema = @Schema(implementation = RoleResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Validation error",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> createRole(
            @Parameter(description = "Role details", required = true)
            @Valid @RequestBody RoleRequestDTO requestDTO) {
        RoleResponseDTO response = roleService.create(requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, messageUtil.getMessage("success.role.created")));
    }

    @Operation(
        summary = "Get all roles",
        description = "Retrieve paginated list of roles with pagination and sorting support"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Roles retrieved successfully",
            content = @Content(schema = @Schema(implementation = PageResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponseDTO<RoleResponseDTO>>> getAllRoles(
            @ParameterObject
            @PageableDefault(size = 10, sort = "name", direction = org.springframework.data.domain.Sort.Direction.ASC)
            Pageable pageable) {
        PageResponseDTO<RoleResponseDTO> response = roleService.getAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.role.retrieved.all")));
    }
    
    @Operation(
        summary = "Search roles with pagination",
        description = "Search roles by name with pagination support"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Roles searched successfully",
            content = @Content(schema = @Schema(implementation = PageResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponseDTO<RoleResponseDTO>>> searchRoles(
            @Parameter(description = "Role name to search for")
            @RequestParam(required = false) String name,
            @ParameterObject
            @PageableDefault(size = 10, sort = "name", direction = org.springframework.data.domain.Sort.Direction.ASC)
            Pageable pageable) {
        PageResponseDTO<RoleResponseDTO> response = roleService.search(name, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.role.retrieved.all")));
    }

    @Operation(
        summary = "Get role by ID",
        description = "Retrieve role information by ID"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Role found",
            content = @Content(schema = @Schema(implementation = RoleResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Role not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> getRoleById(
            @Parameter(description = "Role ID", required = true)
            @PathVariable("id") UUID id) {
        RoleResponseDTO response = roleService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.role.retrieved")));
    }

    @Operation(
        summary = "Update role",
        description = "Update role information"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Role updated successfully",
            content = @Content(schema = @Schema(implementation = RoleResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Role not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> updateRole(
            @Parameter(description = "Role ID", required = true)
            @PathVariable("id") UUID id,
            @Parameter(description = "Updated role details", required = true)
            @Valid @RequestBody RoleRequestDTO requestDTO) {
        RoleResponseDTO response = roleService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.role.updated")));
    }

    @Operation(
        summary = "Delete role",
        description = "Soft delete a role (sets is_deleted = true, does not remove from database)"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Role deleted successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Role not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRole(
            @Parameter(description = "Role ID", required = true)
            @PathVariable("id") UUID id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, messageUtil.getMessage("success.role.deleted")));
    }
}
