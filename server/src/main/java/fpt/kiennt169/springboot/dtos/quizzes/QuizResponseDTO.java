package fpt.kiennt169.springboot.dtos.quizzes;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Quiz basic information response (without questions)")
public class QuizResponseDTO implements Serializable {
    
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
    
    @Schema(description = "Total number of questions in this quiz", example = "10")
    private Integer totalQuestions;
}
