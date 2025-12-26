package fpt.kiennt169.springboot.services;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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
    private final UserMapper userMapper;

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

            Set<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet());
            
            String token = tokenService.generateToken(user, roleNames);
            String refreshToken = tokenService.generateRefreshToken(user);
            
            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            log.info("User logged in successfully: {}", user.getEmail());

            return new AuthResponseDTO(
                    token,
                    refreshToken,
                    userMapper.toResponseDTO(user),
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

        if (userRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already registered: " + registerRequest.email());
        }

        User user = new User();
        user.setEmail(registerRequest.email());
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setFullName(registerRequest.fullName());
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
        
        String token = tokenService.generateToken(savedUser, roleNames);
        String refreshToken = tokenService.generateRefreshToken(savedUser);
        
        savedUser.setRefreshToken(refreshToken);
        userRepository.save(savedUser);

        return new AuthResponseDTO(
                token,
                refreshToken,
                userMapper.toResponseDTO(savedUser),
                roleNames
        );
    }
    
    @Override
    @Transactional
    public AuthResponseDTO refresh(String refreshToken) {
        log.debug("Attempting to refresh token");
        
        if (!tokenService.validateRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }
        
        String email = tokenService.getEmailFromRefreshToken(refreshToken);
        if (email == null) {
            throw new BadCredentialsException("Cannot extract email from refresh token");
        }
        
        User user = userRepository.findByRefreshTokenAndEmail(refreshToken, email)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found or does not match"));
        
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        
        String newAccessToken = tokenService.generateToken(user, roleNames);
        String newRefreshToken = tokenService.generateRefreshToken(user);
        
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);
        
        log.info("Token refreshed successfully for user: {}", user.getEmail());
        
        return new AuthResponseDTO(
                newAccessToken,
                newRefreshToken,
                userMapper.toResponseDTO(user),
                roleNames
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
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        user.setRefreshToken(null);
        userRepository.save(user);
        
        log.info("User logged out successfully: {}", email);
    }
}
