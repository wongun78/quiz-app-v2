package fpt.kiennt169.springboot.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fpt.kiennt169.springboot.dtos.ApiResponse;
import fpt.kiennt169.springboot.dtos.users.AuthResponseDTO;
import fpt.kiennt169.springboot.dtos.users.LoginRequestDTO;
import fpt.kiennt169.springboot.dtos.users.RegisterRequestDTO;
import fpt.kiennt169.springboot.services.AuthService;
import fpt.kiennt169.springboot.util.MessageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Authentication", description = "Authentication management APIs - Login, Register, Token Refresh, Logout")
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MessageUtil messageUtil;
    
    @Value("${cookie.refresh-token.name}")
    private String refreshTokenCookieName;
    
    @Value("${cookie.refresh-token.max-age}")
    private int refreshTokenMaxAge; 

    @Operation(
        summary = "User login",
        description = "Authenticate user with email and password. Returns JWT access token (24h) and refresh token in HttpOnly cookie (7 days)"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Login successful",
            content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Invalid credentials",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Validation error",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Parameter(description = "Login credentials")
            @Valid @RequestBody LoginRequestDTO loginRequest) {
        log.info("Login request received for email: {}", loginRequest.email());
        
        AuthResponseDTO response = authService.login(loginRequest);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, createRefreshTokenCookie(response.refreshToken()).toString())
                .body(ApiResponse.success(response, messageUtil.getMessage("success.auth.login")));
    }

    @Operation(
        summary = "User registration",
        description = "Register a new user account. Automatically assigns ROLE_USER. Returns JWT tokens."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "User registered successfully",
            content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))
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
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(
            @Parameter(description = "Registration details")
            @Valid @RequestBody RegisterRequestDTO registerRequest) {
        log.info("Registration request received for email: {}", registerRequest.email());
        
        AuthResponseDTO response = authService.register(registerRequest);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, createRefreshTokenCookie(response.refreshToken()).toString())
                .body(ApiResponse.created(response, messageUtil.getMessage("success.auth.register")));
    }
    
    @Operation(
        summary = "Refresh access token",
        description = "Get new access token using refresh token from HttpOnly cookie. Implements token rotation - returns new refresh token."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Token refreshed successfully",
            content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Invalid or expired refresh token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> refresh(
            @Parameter(description = "Refresh token from HttpOnly cookie", hidden = true)
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {
        log.info("Token refresh request received");
        
        AuthResponseDTO response = authService.refresh(refreshToken);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, createRefreshTokenCookie(response.refreshToken()).toString())
                .body(ApiResponse.success(response, messageUtil.getMessage("success.auth.refresh")));
    }
    
    @Operation(
        summary = "User logout",
        description = "Logout current user. Invalidates refresh token in database and deletes HttpOnly cookie."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Logout successful"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing access token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        log.info("Logout request received");
        
        authService.logout();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie().toString())
                .body(ApiResponse.success(null, messageUtil.getMessage("success.auth.logout")));
    }
    
    private ResponseCookie createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie
                .from(refreshTokenCookieName, refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenMaxAge)
                .sameSite("Strict")
                .build();
    }
    
    private ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie
                .from(refreshTokenCookieName, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
    }
}
