package fpt.kiennt169.springboot.dtos.users;

import fpt.kiennt169.springboot.validation.StrongPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "User registration request")
public record RegisterRequestDTO(
    
    @Schema(description = "User first name", example = "New", maxLength = 50)
    @NotBlank(message = "{validation.firstname.notblank}")
    @Size(max = 50, message = "{validation.firstname.size}")
    String firstName,
    
    @Schema(description = "User last name", example = "User", maxLength = 50)
    @NotBlank(message = "{validation.lastname.notblank}")
    @Size(max = 50, message = "{validation.lastname.size}")
    String lastName,
    
    @Schema(description = "User email address (must be unique)", example = "newuser@quiz.com")
    @NotBlank(message = "{validation.email.notblank}")
    @Email(message = "{validation.email.invalid}")
    String email,
    
    @Schema(description = "Strong password (min 8 chars, uppercase, lowercase, digit, special char)", 
            example = "NewUser@123", 
            minLength = 8)
    @StrongPassword
    String password,
    
    @Schema(description = "Confirm password (must match password)", example = "NewUser@123")
    @NotBlank(message = "{validation.confirmpassword.notblank}")
    String confirmPassword
) {}
