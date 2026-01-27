package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.users.UserRequestDTO;
import fpt.kiennt169.springboot.dtos.users.UserUpdateDTO;
import fpt.kiennt169.springboot.dtos.users.UserResponseDTO;
import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.entities.User;
import fpt.kiennt169.springboot.exceptions.EmailAlreadyExistsException;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.mappers.UserMapper;
import fpt.kiennt169.springboot.repositories.RoleRepository;
import fpt.kiennt169.springboot.repositories.UserRepository;
import fpt.kiennt169.springboot.specifications.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO create(UserRequestDTO requestDTO) {
        if (requestDTO.email() != null && userRepository.existsByEmail(requestDTO.email())) {
            throw new EmailAlreadyExistsException(requestDTO.email());
        }
        
        User user = userMapper.toEntity(requestDTO);
        
        user.setEmail(requestDTO.email());
        user.setFirstName(requestDTO.firstName());
        user.setLastName(requestDTO.lastName());
        user.setUsername(requestDTO.username()); 
        user.setFullName(requestDTO.firstName() + " " + requestDTO.lastName());
        user.setDateOfBirth(requestDTO.dateOfBirth());
        user.setPhoneNumber(requestDTO.phoneNumber());
        user.setPassword(passwordEncoder.encode(requestDTO.password()));
        
        if (requestDTO.active() != null) {
            user.setActive(requestDTO.active());
        } else {
            user.setActive(true);
        }
        
        assignRolesToUser(user, requestDTO.roleIds());
        
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<UserResponseDTO> getWithPaging(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        Page<UserResponseDTO> responsePage = userPage.map(userMapper::toResponseDTO);
        return PageResponseDTO.from(responsePage);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<UserResponseDTO> searchWithPaging(String fullName, Boolean active, Pageable pageable) {
        Specification<User> spec = Specification
                .where(UserSpecification.hasFullName(fullName))
                .and(UserSpecification.isActive(active));
        
        Page<User> userPage = userRepository.findAll(spec, pageable);
        
        Page<UserResponseDTO> responsePage = userPage.map(userMapper::toResponseDTO);
        return PageResponseDTO.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getByEmail(String email) {        if (email == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
                User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO update(UUID id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        if (requestDTO.username() != null && !requestDTO.username().equals(user.getUsername())) {
            user.setUsername(requestDTO.username());
        }
        
        if (requestDTO.firstName() != null) {
            user.setFirstName(requestDTO.firstName());
        }
        if (requestDTO.lastName() != null) {
            user.setLastName(requestDTO.lastName());
        }
        user.setFullName(user.getFirstName() + " " + user.getLastName());
        
        if (requestDTO.dateOfBirth() != null) {
            user.setDateOfBirth(requestDTO.dateOfBirth());
        }
        if (requestDTO.phoneNumber() != null) {
            user.setPhoneNumber(requestDTO.phoneNumber());
        }
        
        UserUpdateDTO updateDTO = new UserUpdateDTO(
            requestDTO.email(),
            requestDTO.password(),
            user.getFullName(),
            requestDTO.active(),
            requestDTO.roleIds()
        );
        
        return updateWithDTO(user, updateDTO);
    }
    
    @Caching(evict = {
        @CacheEvict(value = "users", key = "#user.id"),
        @CacheEvict(value = "users", key = "#user.email")
    })
    private UserResponseDTO updateWithDTO(User user, UserUpdateDTO updateDTO) {
        if (updateDTO.email() != null && !user.getEmail().equals(updateDTO.email()) && userRepository.existsByEmail(updateDTO.email())) {
            throw new EmailAlreadyExistsException(updateDTO.email());
        }
        
        user.setEmail(updateDTO.email());
        user.setFullName(updateDTO.fullName());
        if (updateDTO.active() != null) {
            user.setActive(updateDTO.active());
        }
        
        if (updateDTO.password() != null && !updateDTO.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDTO.password()));
        }
        
        assignRolesToUser(user, updateDTO.roleIds());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Override
    @CacheEvict(value = "users", key = "#id")
    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }
    
    private void assignRolesToUser(User user, Set<UUID> roleIds) {
        if (roleIds != null && !roleIds.isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (UUID roleId : roleIds) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));
                roles.add(role);
            }
            user.setRoles(roles);
        }
    }
}
