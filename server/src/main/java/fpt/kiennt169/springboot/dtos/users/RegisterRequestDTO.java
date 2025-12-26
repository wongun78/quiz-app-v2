package fpt.kiennt169.springboot.dtos.users;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "User registration request")
public record RegisterRequestDTO(
    
    @Schema(description = "User email address (must be unique)", example = "newuser@quiz.com")
    @NotBlank(message = "{validation.email.notblank}")
    @Email(message = "{validation.email.invalid}")
    String email,
    
    @Schema(description = "User password (minimum 6 characters)", example = "password123", minLength = 6)
    @NotBlank(message = "{validation.password.notblank}")
    @Size(min = 6, message = "{validation.password.size}")
    String password,
    
    @Schema(description = "User full name", example = "John Doe", maxLength = 100)
    @NotBlank(message = "{validation.fullname.notblank}")
    @Size(max = 100, message = "{validation.fullname.size}")
    String fullName
) {}
