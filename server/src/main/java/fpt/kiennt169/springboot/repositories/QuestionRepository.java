package fpt.kiennt169.springboot.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;

/**
 * Repository interface for Question entity data access
 * 
 * Extends JpaRepository to provide CRUD operations and custom queries for:
 * - Finding questions by content, type
 * - Loading questions by quiz association
 * - Loading question details with answers and quizzes
 * - Pagination support for question listing
 * 
 * @author kiennt169
 * @version 1.0
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    
    /**
     * Find question by ID with answers and quizzes eagerly loaded
     * 
     * @param id the question ID
     * @return Optional containing question with details if found
     */
    @EntityGraph(attributePaths = {"answers", "quizzes"})
    Optional<Question> findById(UUID id);
    
    /**
     * Find all questions with answers eagerly loaded and pagination
     * 
     * @param pageable pagination information
     * @return page of questions with answers
     */
    @EntityGraph(attributePaths = {"answers"})
    Page<Question> findAll(Pageable pageable);
    
    /**
     * Find questions belonging to a specific quiz
     * 
     * @param quizId the quiz ID
     * @return list of questions with answers and quizzes
     */
    @EntityGraph(attributePaths = {"answers", "quizzes"})
    List<Question> findByQuizzesId(UUID quizId);
    
    /**
     * Find questions by content and type with pagination
     * 
     * @param content the content to search (case-insensitive partial match)
     * @param type the question type
     * @param pageable pagination information
     * @return page of matching questions with answers
     */
    @EntityGraph(attributePaths = {"answers"})
    Page<Question> findByContentContainingIgnoreCaseAndType(String content, QuestionTypeEnum type, Pageable pageable);
    
    /**
     * Find questions by content with pagination
     * 
     * @param content the content to search (case-insensitive partial match)
     * @param pageable pagination information
     * @return page of matching questions with answers
     */
    @EntityGraph(attributePaths = {"answers"})
    Page<Question> findByContentContainingIgnoreCase(String content, Pageable pageable);
    
    /**
     * Find questions by type with pagination
     * 
     * @param type the question type
     * @param pageable pagination information
     * @return page of matching questions with answers
     */
    @EntityGraph(attributePaths = {"answers"})
    Page<Question> findByType(QuestionTypeEnum type, Pageable pageable);
}
