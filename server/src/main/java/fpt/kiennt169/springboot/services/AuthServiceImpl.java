package fpt.kiennt169.springboot.services;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fpt.kiennt169.springboot.dtos.users.AuthResponseDTO;
import fpt.kiennt169.springboot.dtos.users.LoginRequestDTO;
import fpt.kiennt169.springboot.dtos.users.RegisterRequestDTO;
import fpt.kiennt169.springboot.dtos.users.UserResponseDTO;
import fpt.kiennt169.springboot.entities.RefreshToken;
import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.entities.User;
import fpt.kiennt169.springboot.enums.RoleEnum;
import fpt.kiennt169.springboot.exceptions.ResourceAlreadyExistsException;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.mappers.UserMapper;
import fpt.kiennt169.springboot.repositories.RoleRepository;
import fpt.kiennt169.springboot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpiration;

    @Override
    @Transactional
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        log.debug("Attempting login for user: {}", loginRequest.email());
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );
            
            User user = userRepository.findByEmail(loginRequest.email())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.email()));

            int roleCount = user.getRoles().size(); 
            log.debug("User has {} roles", roleCount);
            
            Set<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet());
            
            UserResponseDTO userResponseDTO = new UserResponseDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getFullName(),
                    user.getDateOfBirth(),
                    user.getPhoneNumber(),
                    user.getActive(),
                    roleNames  
            );
            
            String token = tokenService.generateToken(user, roleNames);
            String refreshTokenString = tokenService.generateRefreshToken();
            
            RefreshToken refreshToken = RefreshToken.builder()
                    .token(refreshTokenString)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .roles(roleNames)
                    .createdAt(Instant.now())
                    .expiresAt(Instant.now().plusMillis(refreshTokenExpiration))
                    .build();
            
            refreshTokenService.saveRefreshToken(refreshToken, refreshTokenExpiration / 1000);

            log.info("User logged in successfully: {}", user.getEmail());

            return new AuthResponseDTO(
                    token,
                    refreshTokenString,
                    userResponseDTO, 
                    roleNames
            );

        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for user: {}", loginRequest.email());
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        log.debug("Attempting registration for email: {}", registerRequest.email());

        if (registerRequest.email() != null && userRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already registered: " + registerRequest.email());
        }

        if (!registerRequest.password().equals(registerRequest.confirmPassword())) {
            throw new BadCredentialsException("Password confirmation does not match");
        }

        User user = new User();
        user.setEmail(registerRequest.email());
        
        user.setUsername(registerRequest.username());
        
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setFirstName(registerRequest.firstName().trim());
        user.setLastName(registerRequest.lastName().trim());
        
        String fullName = registerRequest.firstName().trim() + " " + registerRequest.lastName().trim();
        user.setFullName(fullName);
        
        user.setDateOfBirth(registerRequest.dateOfBirth());
        user.setPhoneNumber(registerRequest.phoneNumber());
        user.setActive(true);

        Role userRole = roleRepository.findByName(RoleEnum.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_USER"));
        
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        
        Set<String> roleNames = savedUser.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        
        String accessToken = tokenService.generateToken(savedUser, roleNames);
        String refreshTokenString = tokenService.generateRefreshToken();
        
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenString)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .roles(roleNames)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiration))
                .build();
        
        refreshTokenService.saveRefreshToken(refreshToken, refreshTokenExpiration / 1000);
        
        log.info("User registered successfully: {}", savedUser.getEmail());
        
        return new AuthResponseDTO(
                accessToken,
                refreshTokenString,
                userMapper.toResponseDTO(savedUser),
                roleNames
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponseDTO refresh(String refreshTokenString) {
        log.debug("Attempting to refresh token");
        
        if (refreshTokenString == null || refreshTokenString.isBlank()) {
            throw new BadCredentialsException("Refresh token cannot be null or empty");
        }
        
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenString)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found or expired"));
        
        if (refreshToken.isExpired()) {
            refreshTokenService.deleteToken(refreshTokenString);
            throw new BadCredentialsException("Refresh token has expired");
        }
        
        User user = userRepository.findByEmail(refreshToken.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", refreshToken.getEmail()));
        
        Set<String> currentRoles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        
        String newAccessToken = tokenService.generateToken(user, currentRoles);
        String newRefreshTokenString = tokenService.generateRefreshToken();
        
        refreshTokenService.deleteToken(refreshTokenString);
        
        RefreshToken newRefreshToken = RefreshToken.builder()
                .token(newRefreshTokenString)
                .userId(user.getId())
                .email(user.getEmail())
                .roles(currentRoles)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiration))
                .build();
        
        refreshTokenService.saveRefreshToken(newRefreshToken, refreshTokenExpiration / 1000);
        
        log.info("Token refreshed successfully for user: {}", user.getEmail());
        
        return new AuthResponseDTO(
                newAccessToken,
                newRefreshTokenString,
                userMapper.toResponseDTO(user),
                currentRoles
        );
    }

    @Override
    @Transactional
    public void logout() {
        log.debug("Attempting logout");
        
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        
        if (email == null || email.equals("anonymousUser")) {
            throw new BadCredentialsException("User not authenticated");
        }
        
        refreshTokenService.findByEmail(email).ifPresent(refreshToken -> {
            refreshTokenService.deleteToken(refreshToken.getToken());
            log.info("Refresh token deleted for user: {}", email);
        });
        
        log.info("User logged out successfully: {}", email);
    }
}
