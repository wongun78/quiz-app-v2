package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.submissions.ExamResultResponseDTO;
import fpt.kiennt169.springboot.dtos.submissions.ExamSubmissionRequestDTO;

/**
 * Service interface for exam submission and scoring
 * 
 * Provides business logic for:
 * - Processing exam submissions
 * - Calculating exam scores
 * - Validating submitted answers
 * - Generating exam results
 * 
 * @author kiennt169
 * @version 1.0
 */
public interface ExamService {
    
    /**
     * Submit an exam with answers and calculate score
     * 
     * @param requestDTO the exam submission with quiz ID, user ID and answers
     * @return exam result with score and correct answers
     */
    ExamResultResponseDTO submitExam(ExamSubmissionRequestDTO requestDTO);
}
