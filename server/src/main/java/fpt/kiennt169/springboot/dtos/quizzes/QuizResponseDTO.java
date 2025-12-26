package fpt.kiennt169.springboot.dtos.quizzes;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "Quiz basic information response (without questions)")
public record QuizResponseDTO(
    
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
    
    @Schema(description = "Total number of questions in this quiz", example = "10")
    Integer totalQuestions
) {}
