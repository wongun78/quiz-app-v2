package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.submissions.ExamResultResponseDTO;
import fpt.kiennt169.springboot.dtos.submissions.ExamSubmissionRequestDTO;
import fpt.kiennt169.springboot.entities.*;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.repositories.QuestionRepository;
import fpt.kiennt169.springboot.repositories.QuizRepository;
import fpt.kiennt169.springboot.repositories.QuizSubmissionRepository;
import fpt.kiennt169.springboot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    
    private static final double PASS_PERCENTAGE = 50.0;

    @Override
    @Transactional
    public ExamResultResponseDTO submitExam(ExamSubmissionRequestDTO requestDTO) {
        log.info("Processing exam submission for user: {} quiz: {}", 
                requestDTO.userId(), requestDTO.quizId());
        
        User user = userRepository.findById(requestDTO.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requestDTO.userId()));
        
        Quiz quiz = quizRepository.findById(requestDTO.quizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", requestDTO.quizId()));
        
        if (!quiz.getActive()) {
            throw new IllegalStateException("Quiz is not active");
        }
        
        List<Question> quizQuestions = questionRepository.findByQuizzesId(quiz.getId());
        
        if (quizQuestions.isEmpty()) {
            throw new IllegalStateException("Quiz has no questions");
        }
        
        double achievedScore = 0.0;
        double totalScore = 0.0;
        
        Map<UUID, List<UUID>> submittedAnswersMap = requestDTO.answers().stream()
                .collect(Collectors.toMap(
                    ExamSubmissionRequestDTO.QuestionAnswerDTO::questionId,
                    ExamSubmissionRequestDTO.QuestionAnswerDTO::answerIds
                ));
        
        for (Question question : quizQuestions) {
            totalScore += question.getScore();
            
            List<UUID> submittedAnswerIds = submittedAnswersMap.getOrDefault(question.getId(), Collections.emptyList());
            
            List<UUID> correctAnswerIds = question.getAnswers().stream()
                    .filter(Answer::getIsCorrect)
                    .map(Answer::getId)
                    .toList();
            
            boolean isCorrect = checkAnswer(question, submittedAnswerIds, correctAnswerIds);
            
            if (isCorrect) {
                achievedScore += question.getScore();
            }
        }
        
        boolean passed = (achievedScore / totalScore) * 100.0 >= PASS_PERCENTAGE;
        
        QuizSubmission submission = new QuizSubmission();
        submission.setUser(user);
        submission.setQuiz(quiz);
        submission.setScore(achievedScore);
        submission.setSubmissionTime(LocalDateTime.now());
        submission = quizSubmissionRepository.save(submission);
        
        log.info("Exam submitted. Score: {}/{} - {}", achievedScore, totalScore, passed ? "PASSED" : "FAILED");
        
        return new ExamResultResponseDTO(
            submission.getId(),
            quizQuestions.size(),
            achievedScore,
            passed
        );
    }
    
    private boolean checkAnswer(Question question, List<UUID> submittedAnswerIds, List<UUID> correctAnswerIds) {
        if (question.getType() == QuestionTypeEnum.SINGLE_CHOICE) {
            // Single choice
            return submittedAnswerIds.size() == 1 && 
                   correctAnswerIds.contains(submittedAnswerIds.get(0));
        } else {
            // Multiple choice
            Set<UUID> submittedSet = new HashSet<>(submittedAnswerIds);
            Set<UUID> correctSet = new HashSet<>(correctAnswerIds);
            return submittedSet.equals(correctSet);
        }
    }
}
