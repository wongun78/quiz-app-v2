package fpt.kiennt169.springboot.dtos.submissions;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

@Schema(description = "Exam submission request with user ID, quiz ID, and list of question-answer pairs")
public record ExamSubmissionRequestDTO(
    
    @Schema(description = "ID of user taking the exam", example = "123e4567-e89b-12d3-a456-426614174000")
    @NotNull(message = "User ID is required")
    UUID userId,
    
    @Schema(description = "ID of quiz being taken", example = "987fcdeb-51a2-43d7-b456-426614174111")
    @NotNull(message = "Quiz ID is required")
    UUID quizId,
    
    @Schema(description = "List of question-answer pairs (at least 1 answer required)")
    @NotEmpty(message = "Answers cannot be empty")
    @Valid
    List<QuestionAnswerDTO> answers
) {
    
    @Schema(description = "Question-answer pair containing question ID and selected answer IDs")
    public record QuestionAnswerDTO(
        
        @Schema(description = "Question ID", example = "111e4567-e89b-12d3-a456-426614174222")
        @NotNull(message = "Question ID is required")
        UUID questionId,
        
        @Schema(description = "List of selected answer IDs. For SINGLE_CHOICE: 1 answer. For MULTIPLE_CHOICE: 1+ answers", 
                example = "[\"222e4567-e89b-12d3-a456-426614174333\"]")
        @NotEmpty(message = "Answer IDs cannot be empty")
        List<UUID> answerIds
    ) {}
}
