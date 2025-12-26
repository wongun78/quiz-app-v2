package fpt.kiennt169.springboot.controllers;

import fpt.kiennt169.springboot.dtos.ApiResponse;
import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizDetailResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizRequestDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizResponseDTO;
import fpt.kiennt169.springboot.services.QuizService;
import fpt.kiennt169.springboot.util.MessageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Quizzes", description = "Quiz management APIs - CRUD operations and question assignment")
@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final MessageUtil messageUtil;

    @Operation(
        summary = "Create new quiz",
        description = "Create a quiz with title, description, duration, and active status. Questions are added separately via question endpoints."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "Quiz created successfully",
            content = @Content(schema = @Schema(implementation = QuizResponseDTO.class))
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
    public ResponseEntity<ApiResponse<QuizResponseDTO>> createQuiz(
            @Parameter(description = "Quiz details", required = true)
            @Valid @RequestBody QuizRequestDTO requestDTO) {
        QuizResponseDTO response = quizService.create(requestDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, messageUtil.getMessage("success.quiz.created")));
    }

    @Operation(
        summary = "Get all quizzes",
        description = "Retrieve paginated list of quizzes with basic information (without questions)"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Quizzes retrieved successfully",
            content = @Content(schema = @Schema(implementation = PageResponseDTO.class))
        )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDTO<QuizResponseDTO>>> getAllQuizzes(
            @Parameter(description = "Pagination parameters", example = "page=0&size=10&sort=createdAt,desc")
            Pageable pageable) {
        PageResponseDTO<QuizResponseDTO> response = quizService.getWithPaging(pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.retrieved.all")));
    }
    
    @Operation(
        summary = "Search quizzes with pagination",
        description = "Search quizzes by title and/or active status with pagination support"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Quizzes searched successfully",
            content = @Content(schema = @Schema(implementation = PageResponseDTO.class))
        )
    })
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponseDTO<QuizResponseDTO>>> searchQuizzes(
            @Parameter(description = "Title to search for")
            @RequestParam(required = false) String title,
            @Parameter(description = "Active status filter")
            @RequestParam(required = false) Boolean active,
            @Parameter(description = "Pagination parameters", example = "page=0&size=10&sort=createdAt,desc")
            Pageable pageable) {
        PageResponseDTO<QuizResponseDTO> response = quizService.searchWithPaging(title, active, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.retrieved.all")));
    }

    @Operation(
        summary = "Get quiz by ID",
        description = "Retrieve basic quiz information without questions. Use /details endpoint to get questions."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Quiz found",
            content = @Content(schema = @Schema(implementation = QuizResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<QuizResponseDTO>> getQuizById(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID id) {
        QuizResponseDTO response = quizService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.retrieved")));
    }

    @Operation(
        summary = "Get quiz with questions",
        description = "Retrieve detailed quiz information including all questions and answers. Use for exam display."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Quiz with questions retrieved",
            content = @Content(schema = @Schema(implementation = QuizDetailResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<QuizDetailResponseDTO>> getQuizWithQuestions(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID id) {
        QuizDetailResponseDTO response = quizService.getWithQuestions(id);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.retrieved.with_questions")));
    }

    @Operation(
        summary = "Update quiz",
        description = "Update quiz metadata (title, description, duration, active status). Does not affect questions."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Quiz updated successfully",
            content = @Content(schema = @Schema(implementation = QuizResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz not found",
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
    public ResponseEntity<ApiResponse<QuizResponseDTO>> updateQuiz(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Updated quiz details", required = true)
            @Valid @RequestBody QuizRequestDTO requestDTO) {
        QuizResponseDTO response = quizService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.updated")));
    }

    @Operation(
        summary = "Delete quiz",
        description = "Soft delete a quiz. Also removes all quiz-question relationships."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Quiz deleted successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz not found",
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
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID id) {
        quizService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, messageUtil.getMessage("success.quiz.deleted")));
    }

    @Operation(
        summary = "Add single question to quiz",
        description = "Add one question to a quiz. Question must already exist. Idempotent - won't add duplicates."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Question added successfully",
            content = @Content(schema = @Schema(implementation = QuizDetailResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz or Question not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping("/{quizId}/questions/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizDetailResponseDTO>> addQuestionToQuiz(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID quizId,
            @Parameter(description = "Question ID", required = true)
            @PathVariable UUID questionId) {
        QuizDetailResponseDTO response = quizService.addQuestion(quizId, questionId);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.question_added")));
    }

    @Operation(
        summary = "Add multiple questions to quiz",
        description = "Add multiple questions to a quiz in one request. All questions must exist. Skips duplicates."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Questions added successfully",
            content = @Content(schema = @Schema(implementation = QuizDetailResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz or one of the Questions not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping("/{quizId}/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuizDetailResponseDTO>> addQuestionsToQuiz(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID quizId,
            @Parameter(description = "List of question IDs to add", required = true, example = "[\"uuid1\", \"uuid2\"]")
            @RequestBody java.util.List<UUID> questionIds) {
        QuizDetailResponseDTO response = quizService.addQuestions(quizId, questionIds);
        return ResponseEntity.ok(ApiResponse.success(response, messageUtil.getMessage("success.quiz.questions_added")));
    }

    @Operation(
        summary = "Remove question from quiz",
        description = "Remove a question from quiz. Does not delete the question itself, only the relationship."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Question removed successfully"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Quiz or Question not found, or question not in quiz",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Access denied - Requires ADMIN role",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @DeleteMapping("/{quizId}/questions/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeQuestionFromQuiz(
            @Parameter(description = "Quiz ID", required = true)
            @PathVariable UUID quizId,
            @Parameter(description = "Question ID", required = true)
            @PathVariable UUID questionId) {
        quizService.removeQuestion(quizId, questionId);
        return ResponseEntity.ok(ApiResponse.success(null, messageUtil.getMessage("success.quiz.question_removed")));
    }
}
