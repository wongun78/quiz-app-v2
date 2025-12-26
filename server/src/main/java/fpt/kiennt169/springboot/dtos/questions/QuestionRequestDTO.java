package fpt.kiennt169.springboot.dtos.questions;

import fpt.kiennt169.springboot.dtos.answers.AnswerRequestDTO;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

@Schema(description = "Question creation/update request payload")
public record QuestionRequestDTO(
    
    @Schema(description = "Question content/text", example = "What is Java?")
    @NotBlank(message = "{validation.question.content.notblank}")
    String content,
    
    @Schema(description = "Question type", example = "SINGLE_CHOICE", 
            allowableValues = {"SINGLE_CHOICE", "MULTIPLE_CHOICE"})
    @NotNull(message = "{validation.question.type.notnull}")
    QuestionTypeEnum type,
    
    @Schema(description = "Points for correct answer", example = "10", minimum = "1")
    @NotNull(message = "{validation.question.score.notnull}")
    @Min(value = 1, message = "{validation.question.score.min}")
    Integer score,
    
    @Schema(description = "List of answer choices (minimum 2 for SINGLE_CHOICE, minimum 3 for MULTIPLE_CHOICE)")
    @NotEmpty(message = "{validation.question.answers.notempty}")
    @Valid
    List<AnswerRequestDTO> answers
) {}
