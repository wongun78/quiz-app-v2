package fpt.kiennt169.springboot.repositories;

import fpt.kiennt169.springboot.entities.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    // Removed @Cacheable to avoid LazyInitializationException when deserializing from Redis
    // User entities have complex relationships that don't serialize well
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findById(UUID id);

    // Removed @Cacheable to avoid LazyInitializationException when deserializing from Redis
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);

    @Override
    @EntityGraph(attributePaths = {"roles"})
    Page<User> findAll(Specification<User> spec, Pageable pageable);

    boolean existsByEmail(String email);
}
