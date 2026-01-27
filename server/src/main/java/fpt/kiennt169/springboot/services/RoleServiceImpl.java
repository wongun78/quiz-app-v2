package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.roles.RoleRequestDTO;
import fpt.kiennt169.springboot.dtos.roles.RoleResponseDTO;
import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public RoleResponseDTO create(RoleRequestDTO requestDTO) {
        if (roleRepository.findByName(requestDTO.name()).isPresent()) {
            throw new fpt.kiennt169.springboot.exceptions.ResourceAlreadyExistsException(
                "Role"
            );
        }
        
        Role role = new Role();
        role.setName(requestDTO.name());
        role.setDescription(requestDTO.description());
        Role savedRole = roleRepository.save(role);
        return mapToResponseDTO(savedRole);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<RoleResponseDTO> search(String name, Pageable pageable) {
        Page<Role> rolePage;
        
        if (name != null && !name.trim().isEmpty()) {
            String searchTerm = name.trim().toUpperCase();
            java.util.List<Role> allRoles = roleRepository.findAll();
            java.util.List<Role> filteredRoles = allRoles.stream()
                .filter(role -> role.getName().name().toUpperCase().contains(searchTerm))
                .toList();
            
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), filteredRoles.size());
            java.util.List<Role> pageContent = start < filteredRoles.size() 
                ? filteredRoles.subList(start, end) 
                : java.util.Collections.emptyList();
            
            rolePage = new org.springframework.data.domain.PageImpl<>(
                pageContent, 
                pageable, 
                filteredRoles.size()
            );
        } else {
            rolePage = roleRepository.findAll(pageable);
        }
        
        Page<RoleResponseDTO> responsePage = rolePage.map(this::mapToResponseDTO);
        return PageResponseDTO.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<RoleResponseDTO> getAll(Pageable pageable) {
        Page<Role> rolePage = roleRepository.findAll(pageable);
        Page<RoleResponseDTO> responsePage = rolePage.map(this::mapToResponseDTO);
        return PageResponseDTO.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDTO getById(UUID id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        return mapToResponseDTO(role);
    }

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "roles", key = "#id"),
        @CacheEvict(value = "roles", key = "#requestDTO.name().name()")
    })
    public RoleResponseDTO update(UUID id, RoleRequestDTO requestDTO) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        role.setName(requestDTO.name());
        role.setDescription(requestDTO.description());
        Role updatedRole = roleRepository.save(role);
        return mapToResponseDTO(updatedRole);
    }

    @Override
    @Transactional
    @CacheEvict(value = "roles", allEntries = true)
    public void delete(UUID id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role", "id", id);
        }
        
        try {
            roleRepository.deleteById(id);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new IllegalStateException(
                "Cannot delete role with ID " + id + " - it is still assigned to one or more users. " +
                "Please remove the role from all users before deleting."
            );
        }
    }

    private RoleResponseDTO mapToResponseDTO(Role role) {
        return new RoleResponseDTO(
            role.getId(),
            role.getName(),
            role.getDescription(),
            role.getCreatedAt(),
            role.getUpdatedAt(),
            role.getIsDeleted()
        );
    }
}
