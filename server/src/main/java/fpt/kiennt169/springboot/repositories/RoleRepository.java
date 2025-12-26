package fpt.kiennt169.springboot.repositories;

import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.enums.RoleEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Role entity data access
 * 
 * Extends JpaRepository to provide CRUD operations and custom queries for:
 * - Finding roles by name (enum)
 * - Searching roles by name pattern
 * - Role-based authorization support
 * - Pagination support for role listing
 * 
 * @author kiennt169
 * @version 1.0
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    
    /**
     * Find role by name enum
     * 
     * @param name the role name enum
     * @return Optional containing role if found
     */
    Optional<Role> findByName(RoleEnum name);
    
    /**
     * Search roles by name with pagination
     * 
     * @param name the name to search (partial match)
     * @param pageable pagination information
     * @return page of matching roles
     */
    @Query("SELECT r FROM Role r WHERE CAST(r.name AS string) LIKE %:name%")
    Page<Role> searchByName(@Param("name") String name, Pageable pageable);
}
