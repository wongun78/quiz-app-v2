package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizDetailResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizRequestDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizResponseDTO;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

/**
 * Service interface for managing Quiz entities
 * 
 * Provides business logic for:
 * - CRUD operations on quizzes
 * - Search and filtering quizzes
 * - Managing quiz-question relationships
 * - Retrieving quiz details with associated questions
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface QuizService {
    
    /**
     * Create a new quiz
     * 
     * @param requestDTO the quiz data to create
     * @return the created quiz response
     */
    QuizResponseDTO create(QuizRequestDTO requestDTO);
    
    /**
     * Get all quizzes with pagination
     * 
     * @param pageable pagination information
     * @return page of quiz responses
     */
    PageResponseDTO<QuizResponseDTO> getWithPaging(Pageable pageable);
    
    /**
     * Search quizzes with filters and pagination
     * 
     * @param title the title to search (optional, case-insensitive)
     * @param active filter by active status (optional)
     * @param pageable pagination information
     * @return page of matching quiz responses
     */
    PageResponseDTO<QuizResponseDTO> searchWithPaging(String title, Boolean active, Pageable pageable);
    
    /**
     * Get a quiz by ID
     * 
     * @param id the quiz ID
     * @return the quiz response
     */
    QuizResponseDTO getById(UUID id);
    
    /**
     * Update an existing quiz
     * 
     * @param id the quiz ID to update
     * @param requestDTO the updated quiz data
     * @return the updated quiz response
     */
    QuizResponseDTO update(UUID id, QuizRequestDTO requestDTO);
    
    /**
     * Delete a quiz (soft delete)
     * 
     * @param id the quiz ID to delete
     */
    void delete(UUID id);

    /**
     * Get quiz details with all associated questions
     * 
     * @param id the quiz ID
     * @return detailed quiz response with questions
     */
    QuizDetailResponseDTO getWithQuestions(UUID id);
    
    /**
     * Add a single question to a quiz
     * 
     * @param quizId the quiz ID
     * @param questionId the question ID to add
     * @return updated quiz details with questions
     */
    QuizDetailResponseDTO addQuestion(UUID quizId, UUID questionId);
    
    /**
     * Add multiple questions to a quiz
     * 
     * @param quizId the quiz ID
     * @param questionIds list of question IDs to add
     * @return updated quiz details with questions
     */
    QuizDetailResponseDTO addQuestions(UUID quizId, java.util.List<UUID> questionIds);
    
    /**
     * Remove a question from a quiz
     * 
     * @param quizId the quiz ID
     * @param questionId the question ID to remove
     */
    void removeQuestion(UUID quizId, UUID questionId);
}
