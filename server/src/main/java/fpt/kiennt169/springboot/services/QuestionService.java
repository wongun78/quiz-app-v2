package fpt.kiennt169.springboot.services;

import java.util.UUID;

import org.springframework.data.domain.Pageable;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionRequestDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;

/**
 * Service interface for managing Question entities
 * 
 * Provides business logic for:
 * - CRUD operations on questions
 * - Search and filtering questions by content and type
 * - Managing question answers
 * - Validating question data
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface QuestionService {
    
    /**
     * Create a new question
     * 
     * @param requestDTO the question data to create
     * @return the created question response
     */
    QuestionResponseDTO create(QuestionRequestDTO requestDTO);
    
    /**
     * Get all questions with pagination
     * 
     * @param pageable pagination information
     * @return page of question responses
     */
    PageResponseDTO<QuestionResponseDTO> getWithPaging(Pageable pageable);
    
    /**
     * Search questions with filters and pagination
     * 
     * @param content the content to search (optional, case-insensitive)
     * @param type filter by question type (optional)
     * @param pageable pagination information
     * @return page of matching question responses
     */
    PageResponseDTO<QuestionResponseDTO> searchWithPaging(String content, QuestionTypeEnum type, Pageable pageable);
    
    /**
     * Get a question by ID
     * 
     * @param id the question ID
     * @return the question response
     */
    QuestionResponseDTO getById(UUID id);
    
    /**
     * Update an existing question
     * 
     * @param id the question ID to update
     * @param requestDTO the updated question data
     * @return the updated question response
     */
    QuestionResponseDTO update(UUID id, QuestionRequestDTO requestDTO);
    
    /**
     * Delete a question (soft delete)
     * 
     * @param id the question ID to delete
     */
    void delete(UUID id);
}