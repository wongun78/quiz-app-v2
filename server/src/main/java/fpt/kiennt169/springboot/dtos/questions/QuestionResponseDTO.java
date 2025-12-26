package fpt.kiennt169.springboot.dtos.questions;

import fpt.kiennt169.springboot.dtos.answers.AnswerResponseDTO;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@Schema(description = "Question details with answers and associated quizzes (read-only)")
public record QuestionResponseDTO(
    
    @Schema(description = "Question ID")
    UUID id,
    
    @Schema(description = "Question content", example = "What is Java?")
    String content,
    
    @Schema(description = "Question type", example = "SINGLE_CHOICE")
    QuestionTypeEnum type,
    
    @Schema(description = "Points awarded for correct answer", example = "10")
    Integer score,
    
    @Schema(description = "List of quizzes using this question (read-only, managed via Quiz API)")
    List<QuizInfoDTO> quizzes,
    
    @Schema(description = "List of answer choices")
    List<AnswerResponseDTO> answers
) {
    @Schema(description = "Quiz summary information")
    public record QuizInfoDTO(
        @Schema(description = "Quiz ID")
        UUID id,
        @Schema(description = "Quiz title", example = "Java Programming Basics")
        String title
    ) {}
}
