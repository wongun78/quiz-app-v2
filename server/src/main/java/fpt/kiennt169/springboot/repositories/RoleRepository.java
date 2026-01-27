package fpt.kiennt169.springboot.repositories;

import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.enums.RoleEnum;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    @Cacheable(value = "roles", key = "#name.name()")
    Optional<Role> findByName(RoleEnum name);

    @Cacheable(value = "roles", key = "#id")
    Optional<Role> findById(UUID id);
}
