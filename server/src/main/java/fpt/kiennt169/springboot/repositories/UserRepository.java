package fpt.kiennt169.springboot.repositories;

import fpt.kiennt169.springboot.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findById(UUID id);

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = {"roles"})
    Page<User> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByRefreshTokenAndEmail(String refreshToken, String email);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"roles"})
    Page<User> findByFullNameContainingIgnoreCaseAndActive(String fullName, Boolean active, Pageable pageable);

    @EntityGraph(attributePaths = {"roles"})
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);

    @EntityGraph(attributePaths = {"roles"})
    Page<User> findByActive(Boolean active, Pageable pageable);
}
