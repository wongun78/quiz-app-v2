package fpt.kiennt169.springboot.dtos.answers;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.util.UUID;

@Schema(description = "Answer creation/update request payload")
public record AnswerRequestDTO(
    
    @Schema(description = "Answer ID (optional, only for update)", example = "123e4567-e89b-12d3-a456-426614174000")
    UUID id,
    
    @Schema(description = "Answer content/text", 
            example = "System.out.println(\"Hello World\");")
    @NotBlank(message = "{validation.answer.content.notblank}")
    String content,
    
    @Schema(description = "Whether this answer is correct", example = "true")
    @NotNull(message = "{validation.answer.iscorrect.notnull}")
    Boolean isCorrect
) {}
