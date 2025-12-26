package fpt.kiennt169.springboot.controllers;

import fpt.kiennt169.springboot.dtos.ApiResponse;
import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.users.UserRequestDTO;
import fpt.kiennt169.springboot.dtos.users.UserResponseDTO;
import fpt.kiennt169.springboot.services.UserService;
import fpt.kiennt169.springboot.util.MessageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Users", description = "User management APIs - CRUD operations and role assignment (Admin only)")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final MessageUtil messageUtil;

    @Operation(
        summary = "Create new user",
        description = "Create a user with email, password, full name, and role assignments. Email must be unique."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "User created successfully",
            content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "Email already exists",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
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
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(
            @Parameter(description = "User details with role assignments", required = true)
            @Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO response = userService.create(requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, messageUtil.getMessage("success.user.created")));
    }

    @Operation(
        summary = "Get all users",
        description = "Retrieve paginated list of all users. Admin only."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Users retrieved successfully",
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
    public ResponseEntity<ApiResponse<PageResponseDTO<UserResponseDTO>>> getAllUsers(
            @Parameter(description = "Pagination parameters", example = "page=0&size=10&sort=createdAt,desc")
            Pageable pageable) {
        PageResponseDTO<UserResponseDTO> response = userService.getWithPaging(pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.user.retrieved.all")));
    }
    
    @Operation(
        summary = "Search users with pagination",
        description = "Search users by full name and/or active status with pagination support"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Users searched successfully",
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
    public ResponseEntity<ApiResponse<PageResponseDTO<UserResponseDTO>>> searchUsers(
            @Parameter(description = "Full name to search for")
            @RequestParam(required = false) String fullName,
            @Parameter(description = "Active status filter")
            @RequestParam(required = false) Boolean active,
            @Parameter(description = "Pagination parameters", example = "page=0&size=10&sort=createdAt,desc")
            Pageable pageable) {
        PageResponseDTO<UserResponseDTO> response = userService.searchWithPaging(fullName, active, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.user.retrieved.all")));
    }

    @Operation(
        summary = "Get user by ID",
        description = "Retrieve user details by user ID"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "User found",
            content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID id) {
        UserResponseDTO response = userService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.user.retrieved")));
    }

    @Operation(
        summary = "Get user by email",
        description = "Retrieve user details by email address"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "User found",
            content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserByEmail(
            @Parameter(description = "User email address", required = true, example = "user@example.com")
            @PathVariable String email) {
        UserResponseDTO response = userService.getByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.user.retrieved")));
    }

    @Operation(
        summary = "Update user",
        description = "Update user details including email, password, full name, and roles. Email must remain unique."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "User updated successfully",
            content = @Content(schema = @Schema(implementation = UserResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "Email already exists",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Validation error",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Updated user details", required = true)
            @Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO response = userService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.user.updated")));
    }

    @Operation(
        summary = "Delete user",
        description = "Soft delete a user. Admin only."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "User deleted successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User not found",
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
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, messageUtil.getMessage("success.user.deleted")));
    }
}
