package fpt.kiennt169.springboot.repositories;

import fpt.kiennt169.springboot.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity data access
 * 
 * Extends JpaRepository to provide CRUD operations and custom queries for:
 * - Finding users by email, full name, active status
 * - User authentication with refresh tokens
 * - Loading user details with roles eagerly
 * - Pagination support for user listing
 * 
 * @author kiennt169
 * @version 1.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    /**
     * Find user by ID with roles eagerly loaded
     * 
     * @param id the user ID
     * @return Optional containing user with roles if found
     */
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findById(UUID id);
    
    /**
     * Find user by email with roles eagerly loaded
     * 
     * @param email the user's email
     * @return Optional containing user with roles if found
     */
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);
    
    /**
     * Find all users with roles eagerly loaded and pagination
     * 
     * @param pageable pagination information
     * @return page of users with roles
     */
    @EntityGraph(attributePaths = {"roles"})
    Page<User> findAll(Pageable pageable);
    
    /**
     * Find user by refresh token and email with roles eagerly loaded
     * 
     * @param refreshToken the refresh token
     * @param email the user's email
     * @return Optional containing user with roles if found
     */
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByRefreshTokenAndEmail(String refreshToken, String email);
    
    /**
     * Check if a user with the given email exists
     * 
     * @param email the email to check
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);
    
    /**
     * Find users by full name and active status with pagination
     * 
     * @param fullName the full name to search (case-insensitive partial match)
     * @param active the active status
     * @param pageable pagination information
     * @return page of matching users with roles
     */
    @EntityGraph(attributePaths = {"roles"})
    Page<User> findByFullNameContainingIgnoreCaseAndActive(String fullName, Boolean active, Pageable pageable);
    
    /**
     * Find users by full name with pagination
     * 
     * @param fullName the full name to search (case-insensitive partial match)
     * @param pageable pagination information
     * @return page of matching users with roles
     */
    @EntityGraph(attributePaths = {"roles"})
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);
    
    /**
     * Find users by active status with pagination
     * 
     * @param active the active status
     * @param pageable pagination information
     * @return page of matching users with roles
     */
    @EntityGraph(attributePaths = {"roles"})
    Page<User> findByActive(Boolean active, Pageable pageable);
}
