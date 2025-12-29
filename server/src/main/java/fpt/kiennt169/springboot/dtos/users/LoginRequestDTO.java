package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Login request payload")
public record LoginRequestDTO(
    
    @Schema(description = "User email address", example = "admin@quiz.com")
    @NotBlank(message = "{validation.email.notblank}")
    @Email(message = "{validation.email.invalid}")
    String email,
    
    @Schema(description = "User password (Admin: Admin@123, User: User@123)", example = "Admin@123", minLength = 8)
    @NotBlank(message = "{validation.password.notblank}")
    String password
) {}
