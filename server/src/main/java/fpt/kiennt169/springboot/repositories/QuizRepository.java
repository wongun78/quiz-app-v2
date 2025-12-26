package fpt.kiennt169.springboot.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fpt.kiennt169.springboot.entities.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    
    boolean existsByTitle(String title);
    
    @EntityGraph(attributePaths = {"questions", "questions.answers"})
    Optional<Quiz> findWithDetailsById(UUID id);
    
    Page<Quiz> findByTitleContainingIgnoreCaseAndActive(String title, Boolean active, Pageable pageable);
    
    Page<Quiz> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    Page<Quiz> findByActive(Boolean active, Pageable pageable);
}
