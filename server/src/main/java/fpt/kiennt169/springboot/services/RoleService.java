package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.roles.RoleRequestDTO;
import fpt.kiennt169.springboot.dtos.roles.RoleResponseDTO;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

/**
 * Service interface for managing Role entities
 * 
 * Provides business logic for:
 * - CRUD operations on roles
 * - Pagination and sorting
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface RoleService {
    
    /**
     * Create a new role
     * 
     * @param requestDTO the role data to create
     * @return the created role response
     */
    RoleResponseDTO create(RoleRequestDTO requestDTO);
    
    /**
     * Get all roles with pagination
     * 
     * @param pageable pagination information
     * @return page of role responses
     */
    PageResponseDTO<RoleResponseDTO> getAll(Pageable pageable);
    
    /**
     * Search roles by name with pagination
     * 
     * @param name the role name to search for (optional)
     * @param pageable pagination information
     * @return page of role responses matching the search criteria
     */
    PageResponseDTO<RoleResponseDTO> search(String name, Pageable pageable);
    
    /**
     * Get a role by ID
     * 
     * @param id the role ID
     * @return the role response
     */
    RoleResponseDTO getById(UUID id);
    
    /**
     * Update an existing role
     * 
     * @param id the role ID to update
     * @param requestDTO the updated role data
     * @return the updated role response
     */
    RoleResponseDTO update(UUID id, RoleRequestDTO requestDTO);
    
    /**
     * Delete a role (soft delete)
     * 
     * @param id the role ID to delete
     */
    void delete(UUID id);
}
