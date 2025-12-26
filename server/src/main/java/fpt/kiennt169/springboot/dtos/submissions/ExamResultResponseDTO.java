package fpt.kiennt169.springboot.dtos.submissions;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "Exam submission result with score, pass/fail status, and detailed per-question results")
public record ExamResultResponseDTO(
    
    @Schema(description = "Unique submission ID", example = "123e4567-e89b-12d3-a456-426614174000")
    UUID submissionId,
    
    @Schema(description = "User ID who took the exam")
    UUID userId,
    
    @Schema(description = "User email", example = "user@quiz.com")
    String userEmail,
    
    @Schema(description = "User full name", example = "John Doe")
    String userFullName,
    
    @Schema(description = "Quiz ID")
    UUID quizId,
    
    @Schema(description = "Quiz title", example = "Java Programming Basics")
    String quizTitle,
    
    @Schema(description = "Total number of questions in quiz", example = "10")
    Integer totalQuestions,
    
    @Schema(description = "Number of correctly answered questions", example = "7")
    Integer correctAnswers,
    
    @Schema(description = "Number of wrongly answered questions", example = "3")
    Integer wrongAnswers,
    
    @Schema(description = "Maximum possible score", example = "100.0")
    Double totalScore,
    
    @Schema(description = "Score achieved by user", example = "70.0")
    Double achievedScore,
    
    @Schema(description = "Percentage score (0-100)", example = "70.0")
    Double percentage,
    
    @Schema(description = "Pass/fail status (threshold: 50%)", example = "true")
    Boolean passed,
    
    @Schema(description = "Submission timestamp", example = "2025-12-23T15:30:45")
    LocalDateTime submissionTime,
    
    @Schema(description = "Detailed results for each question")
    List<QuestionResultDTO> questionResults
) {
    
    @Schema(description = "Result for a single question showing correctness and score earned")
    public record QuestionResultDTO(
        
        @Schema(description = "Question ID")
        UUID questionId,
        
        @Schema(description = "Question text", example = "What is Java?")
        String content,
        
        @Schema(description = "Points for this question", example = "10")
        Integer score,
        
        @Schema(description = "Whether answer was correct", example = "true")
        Boolean correct,
        
        @Schema(description = "Answer IDs submitted by user")
        List<UUID> submittedAnswerIds,
        
        @Schema(description = "Correct answer IDs")
        List<UUID> correctAnswerIds
    ) {}
}
