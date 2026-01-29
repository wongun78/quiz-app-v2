package fpt.kiennt169.springboot.dtos.quizzes;

import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Quiz detailed information with all questions and answers")
public class QuizDetailResponseDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "Quiz ID")
    private UUID id;
    
    @Schema(description = "Quiz title", example = "Java Programming Basics")
    private String title;
    
    @Schema(description = "Quiz description", example = "Test your knowledge of Java fundamentals")
    private String description;
    
    @Schema(description = "Quiz duration in minutes", example = "60")
    private Integer durationMinutes;
    
    @Schema(description = "Whether the quiz is active", example = "true")
    private Boolean active;
    
    @Schema(description = "List of questions with answer choices")
    private List<QuestionResponseDTO> questions;
    
    @Schema(description = "Quiz creation timestamp", example = "2025-12-26T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update timestamp", example = "2025-12-26T15:45:00")
    private LocalDateTime updatedAt;
}
