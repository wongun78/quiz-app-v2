package fpt.kiennt169.springboot.dtos.users;

import fpt.kiennt169.springboot.validation.StrongPassword;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

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
    
    @Schema(description = "Username (unique, 3-50 chars, alphanumeric and underscore only)", 
            example = "newuser", 
            minLength = 3,
            maxLength = 50)
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    String username,
    
    @Schema(description = "Strong password (min 8 chars, uppercase, lowercase, digit, special char)", 
            example = "********", 
            minLength = 8)
    @StrongPassword
    String password,
    
    @Schema(description = "Confirm password (must match password)", example = "********")
    @NotBlank(message = "{validation.confirmpassword.notblank}")
    String confirmPassword,
    
    @Schema(description = "Date of birth", example = "1990-01-15")
    LocalDate dateOfBirth,
    
    @Schema(description = "Phone number", example = "+84987654321", maxLength = 20)
    @Size(max = 20, message = "{validation.phonenumber.size}")
    String phoneNumber
) {}
