package fpt.kiennt169.springboot.dtos.answers;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "Answer creation/update request payload")
public record AnswerRequestDTO(
    
    @Schema(description = "Answer content/text", example = "public static void main(String[] args)")
    @NotBlank(message = "{validation.answer.content.notblank}")
    String content,
    
    @Schema(description = "Whether this answer is correct", example = "true")
    @NotNull(message = "{validation.answer.iscorrect.notnull}")
    Boolean isCorrect
) {}
