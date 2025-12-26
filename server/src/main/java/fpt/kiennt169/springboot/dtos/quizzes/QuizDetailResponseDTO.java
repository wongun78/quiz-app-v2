package fpt.kiennt169.springboot.dtos.quizzes;

import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "Quiz detailed information with all questions and answers")
public record QuizDetailResponseDTO(
    
    @Schema(description = "Quiz ID")
    UUID id,
    
    @Schema(description = "Quiz title", example = "Java Programming Basics")
    String title,
    
    @Schema(description = "Quiz description", example = "Test your knowledge of Java fundamentals")
    String description,
    
    @Schema(description = "Quiz duration in minutes", example = "60")
    Integer durationMinutes,
    
    @Schema(description = "Whether the quiz is active", example = "true")
    Boolean active,
    
    @Schema(description = "List of questions with answer choices")
    List<QuestionResponseDTO> questions,
    
    @Schema(description = "Quiz creation timestamp", example = "2025-12-26T10:30:00")
    LocalDateTime createdAt,
    
    @Schema(description = "Last update timestamp", example = "2025-12-26T15:45:00")
    LocalDateTime updatedAt
) {}
