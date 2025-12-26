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

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(RoleEnum name);

    @Query("SELECT r FROM Role r WHERE CAST(r.name AS string) LIKE %:name%")
    Page<Role> searchByName(@Param("name") String name, Pageable pageable);
}
