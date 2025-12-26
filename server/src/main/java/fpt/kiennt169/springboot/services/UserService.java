package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.users.UserRequestDTO;
import fpt.kiennt169.springboot.dtos.users.UserResponseDTO;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Service interface for managing User entities
 * 
 * Provides business logic for:
 * - CRUD operations on users
 * - Search and filtering users
 * - User authentication and authorization
 * - User profile management
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface UserService {
    
    /**
     * Create a new user
     * 
     * @param requestDTO the user data to create
     * @return the created user response
     */
    UserResponseDTO create(UserRequestDTO requestDTO);
    
    /**
     * Get all users with pagination
     * 
     * @param pageable pagination information
     * @return page of user responses
     */
    PageResponseDTO<UserResponseDTO> getWithPaging(Pageable pageable);
    
    /**
     * Search users with filters and pagination
     * 
     * @param fullName the full name to search (optional, case-insensitive)
     * @param active filter by active status (optional)
     * @param pageable pagination information
     * @return page of matching user responses
     */
    PageResponseDTO<UserResponseDTO> searchWithPaging(String fullName, Boolean active, Pageable pageable);
    
    /**
     * Get a user by ID
     * 
     * @param id the user ID
     * @return the user response
     */
    UserResponseDTO getById(UUID id);
    
    /**
     * Update an existing user
     * 
     * @param id the user ID to update
     * @param requestDTO the updated user data
     * @return the updated user response
     */
    UserResponseDTO update(UUID id, UserRequestDTO requestDTO);
    
    /**
     * Delete a user (soft delete)
     * 
     * @param id the user ID to delete
     */
    void delete(UUID id);

    /**
     * Get a user by email address
     * 
     * @param email the user's email
     * @return the user response
     */
    UserResponseDTO getByEmail(String email);

}
