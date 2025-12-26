package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.users.UserRequestDTO;
import fpt.kiennt169.springboot.dtos.users.UserResponseDTO;
import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.entities.User;
import fpt.kiennt169.springboot.exceptions.EmailAlreadyExistsException;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.mappers.UserMapper;
import fpt.kiennt169.springboot.repositories.RoleRepository;
import fpt.kiennt169.springboot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        if (userRepository.existsByEmail(requestDTO.email())) {
            throw new EmailAlreadyExistsException(requestDTO.email());
        }
        
        User user = userMapper.toEntity(requestDTO);
        user.setPassword(passwordEncoder.encode(requestDTO.password()));
        
        if (user.getActive() == null) {
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
        Page<User> userPage;
        
        if (fullName != null && active != null) {
            userPage = userRepository.findByFullNameContainingIgnoreCaseAndActive(fullName, active, pageable);
        } else if (fullName != null) {
            userPage = userRepository.findByFullNameContainingIgnoreCase(fullName, pageable);
        } else if (active != null) {
            userPage = userRepository.findByActive(active, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
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
    public UserResponseDTO getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO update(UUID id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        if (requestDTO.email() != null && !user.getEmail().equals(requestDTO.email())) {
            if (userRepository.existsByEmail(requestDTO.email())) {
                throw new EmailAlreadyExistsException(requestDTO.email());
            }
        }
        
        userMapper.updateEntityFromDTO(requestDTO, user);
        
        if (requestDTO.password() != null) {
            user.setPassword(passwordEncoder.encode(requestDTO.password()));
        }
        
        assignRolesToUser(user, requestDTO.roleIds());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Override
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
