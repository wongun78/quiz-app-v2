package fpt.kiennt169.springboot.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fpt.kiennt169.springboot.entities.Quiz;

/**
 * Repository interface for Quiz entity data access
 * 
 * Extends JpaRepository to provide CRUD operations and custom queries for:
 * - Finding quizzes by title, active status
 * - Checking quiz existence
 * - Loading quiz details with questions and answers
 * - Pagination support for quiz listing
 * 
 * @author kiennt169
 * @version 1.0
 */
@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    
    /**
     * Check if a quiz with the given title exists
     * 
     * @param title the quiz title
     * @return true if exists, false otherwise
     */
    boolean existsByTitle(String title);
    
    /**
     * Find quiz by ID with questions and answers eagerly loaded
     * 
     * @param id the quiz ID
     * @return Optional containing quiz with details if found
     */
    @EntityGraph(attributePaths = {"questions", "questions.answers"})
    Optional<Quiz> findWithDetailsById(UUID id);
    
    /**
     * Find quizzes by title and active status with pagination
     * 
     * @param title the title to search (case-insensitive partial match)
     * @param active the active status
     * @param pageable pagination information
     * @return page of matching quizzes
     */
    Page<Quiz> findByTitleContainingIgnoreCaseAndActive(String title, Boolean active, Pageable pageable);
    
    /**
     * Find quizzes by title with pagination
     * 
     * @param title the title to search (case-insensitive partial match)
     * @param pageable pagination information
     * @return page of matching quizzes
     */
    Page<Quiz> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    /**
     * Find quizzes by active status with pagination
     * 
     * @param active the active status
     * @param pageable pagination information
     * @return page of matching quizzes
     */
    Page<Quiz> findByActive(Boolean active, Pageable pageable);
}
