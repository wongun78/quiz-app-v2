package fpt.kiennt169.springboot.controllers;

import fpt.kiennt169.springboot.dtos.ApiResponse;
import fpt.kiennt169.springboot.dtos.submissions.ExamResultResponseDTO;
import fpt.kiennt169.springboot.dtos.submissions.ExamSubmissionRequestDTO;
import fpt.kiennt169.springboot.services.ExamService;
import fpt.kiennt169.springboot.util.MessageUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Exam", description = "Exam submission and automatic scoring APIs")
@Slf4j
@RestController
@RequestMapping("/api/v1/exam")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final MessageUtil messageUtil;

    @Operation(
        summary = "Submit exam answers",
        description = """
            Submit exam with answers for automatic scoring. 
            
            **Scoring Rules:**
            - SINGLE_CHOICE: Must select exactly 1 correct answer
            - MULTIPLE_CHOICE: Must select ALL correct answers (no partial credit)
            - Pass threshold: 50% of total score
            
            **Side Effects:**
            - Saves submission to quiz_submissions table
            - Returns detailed results with per-question breakdown
            """
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Exam submitted successfully",
            content = @Content(schema = @Schema(implementation = ExamResultResponseDTO.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User or Quiz not found",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Validation error or Quiz is inactive",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
    })
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<ExamResultResponseDTO>> submitExam(
            @Parameter(description = "Exam submission with user ID, quiz ID, and answers")
            @Valid @RequestBody ExamSubmissionRequestDTO requestDTO) {
        
        log.info("Received exam submission request from user: {} for quiz: {}", 
                requestDTO.userId(), requestDTO.quizId());
        
        ExamResultResponseDTO result = examService.submitExam(requestDTO);
        
        String message = Boolean.TRUE.equals(result.passed()) 
            ? messageUtil.getMessage("success.exam.passed")
            : messageUtil.getMessage("success.exam.failed");
        
        return ResponseEntity.ok(ApiResponse.success(result, message));
    }
}
