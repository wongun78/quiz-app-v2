package fpt.kiennt169.springboot.dtos.quizzes;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Quiz creation/update request payload")
public record QuizRequestDTO(
    
    @Schema(description = "Quiz title", example = "Java Programming Basics", maxLength = 150)
    @NotBlank(message = "{validation.quiz.title.notblank}")
    @Size(max = 150, message = "{validation.quiz.title.size}")
    String title,
    
    @Schema(description = "Quiz description", example = "Test your knowledge of Java fundamentals", maxLength = 500)
    @Size(max = 500, message = "{validation.quiz.description.size}")
    String description,
    
    @Schema(description = "Quiz duration in minutes", example = "60", minimum = "1")
    @NotNull(message = "{validation.quiz.duration.notnull}")
    @Min(value = 1, message = "{validation.quiz.duration.min}")
    Integer durationMinutes,
    
    @Schema(description = "Whether the quiz is active/available", example = "true", defaultValue = "false")
    Boolean active
) {}
