package fpt.kiennt169.springboot.dtos.answers;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "Answer choice details")
public record AnswerResponseDTO(
    
    @Schema(description = "Answer ID")
    UUID id,
    
    @Schema(description = "Answer text", example = "A programming language")
    String content,
    
    @Schema(description = "Whether this is a correct answer", example = "true")
    Boolean isCorrect
) {}
