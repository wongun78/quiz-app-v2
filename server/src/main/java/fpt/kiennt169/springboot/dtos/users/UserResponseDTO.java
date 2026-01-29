package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User information response (with roles)")
public class UserResponseDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "User ID")
    private UUID id;
    
    @Schema(description = "User email address", example = "nguyenvana@example.com")
    private String email;
    
    @Schema(description = "Username", example = "nguyenvana")
    private String username;
    
    @Schema(description = "User first name", example = "Nguyen")
    private String firstName;
    
    @Schema(description = "User last name", example = "Van A")
    private String lastName;
    
    @Schema(description = "User full name", example = "Nguyen Van A")
    private String fullName;
    
    @Schema(description = "Date of birth", example = "1990-01-15")
    private LocalDate dateOfBirth;
    
    @Schema(description = "Phone number", example = "+84987654321")
    private String phoneNumber;
    
    @Schema(description = "Whether the user account is active", example = "true")
    private Boolean active;
    
    @Schema(description = "Set of roles assigned to this user", example = "[ROLE_ADMIN, ROLE_USER]")
    private Set<String> roles;
}
