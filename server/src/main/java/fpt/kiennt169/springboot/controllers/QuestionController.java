package fpt.kiennt169.springboot.controllers;

import fpt.kiennt169.springboot.dtos.ApiResponse;
import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionRequestDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import fpt.kiennt169.springboot.services.QuestionService;
import fpt.kiennt169.springboot.util.MessageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Questions", description = "Question management APIs - Create questions with answers, manage question bank (Admin CRUD, Public Read)")
@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final MessageUtil messageUtil;

    @Operation(
        summary = "Create new question",
        description = "Create a question with answer choices. Questions are independent - assign to quizzes via Quiz API endpoints."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "Question created successfully",
            content = @Content(schema = @Schema(implementation = QuestionResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Validation error",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionResponseDTO>> createQuestion(
            @Parameter(description = "Question details with answer choices", required = true)
            @Valid @RequestBody QuestionRequestDTO requestDTO) {
        QuestionResponseDTO response = questionService.create(requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, messageUtil.getMessage("success.question.created")));
    }

    @Operation(
        summary = "Get all questions",
        description = "Retrieve paginated list of questions with pagination and sorting support"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Questions retrieved successfully",
            content = @Content(schema = @Schema(implementation = PageResponseDTO.class))
        )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDTO<QuestionResponseDTO>>> getAllQuestions(
            @ParameterObject
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC)
            Pageable pageable) {
        PageResponseDTO<QuestionResponseDTO> response = questionService.getWithPaging(pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.question.retrieved.all")));
    }
    
    @Operation(
        summary = "Search questions with pagination",
        description = "Search questions by content and/or type with pagination support"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Questions searched successfully",
            content = @Content(schema = @Schema(implementation = PageResponseDTO.class))
        )
    })
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponseDTO<QuestionResponseDTO>>> searchQuestions(
            @Parameter(description = "Content to search for")
            @RequestParam(required = false) String content,
            @Parameter(description = "Question type filter")
            @RequestParam(required = false) fpt.kiennt169.springboot.enums.QuestionTypeEnum type,
            @ParameterObject
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC)
            Pageable pageable) {
        PageResponseDTO<QuestionResponseDTO> response = questionService.searchWithPaging(content, type, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.question.retrieved.all")));
    }

    @Operation(
        summary = "Get question by ID",
        description = "Retrieve detailed information about a specific question including answers and associated quizzes"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Question found",
            content = @Content(schema = @Schema(implementation = QuestionResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Question not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuestionResponseDTO>> getQuestionById(
            @Parameter(description = "Question ID", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable("id") UUID id) {
        QuestionResponseDTO response = questionService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.question.retrieved")));
    }

    @Operation(
        summary = "Update question",
        description = "Update question content, type, score, and answer choices. Does not affect quiz assignments."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Question updated successfully",
            content = @Content(schema = @Schema(implementation = QuestionResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Question not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionResponseDTO>> updateQuestion(
            @Parameter(description = "Question ID", required = true)
            @PathVariable("id") UUID id,
            @Parameter(description = "Updated question details", required = true)
            @Valid @RequestBody QuestionRequestDTO requestDTO) {
        QuestionResponseDTO response = questionService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.question.updated")));
    }

    @Operation(
        summary = "Delete question",
        description = "Soft delete a question. Also removes question from all quizzes (cascade delete in join table)."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Question deleted successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Question not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @Parameter(description = "Question ID", required = true)
            @PathVariable("id") UUID id) {
        questionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, messageUtil.getMessage("success.question.deleted")));
    }
}
