package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizDetailResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizRequestDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizResponseDTO;
import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.entities.Quiz;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.mappers.QuizMapper;
import fpt.kiennt169.springboot.repositories.QuestionRepository;
import fpt.kiennt169.springboot.repositories.QuizRepository;
import fpt.kiennt169.springboot.specifications.QuizSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizServiceImpl implements QuizService {
    
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizMapper quizMapper;

    @Override
    public QuizResponseDTO create(QuizRequestDTO requestDTO) {
        Quiz quiz = quizMapper.toEntity(requestDTO);
        
        if (quiz.getActive() == null) {
            quiz.setActive(false);
        }
        
        Quiz savedQuiz = quizRepository.save(quiz);
        return quizMapper.toResponseDTO(savedQuiz);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<QuizResponseDTO> getWithPaging(Pageable pageable) {
        Page<Quiz> quizPage = quizRepository.findAll(pageable);
        Page<QuizResponseDTO> responsePage = quizPage.map(quizMapper::toResponseDTO);
        return PageResponseDTO.from(responsePage);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<QuizResponseDTO> searchWithPaging(String title, Boolean active, Pageable pageable) {
        Specification<Quiz> spec = Specification
                .where(QuizSpecification.hasTitle(title))
                .and(QuizSpecification.isActive(active));
        
        Page<Quiz> quizPage = quizRepository.findAll(spec, pageable);
        
        Page<QuizResponseDTO> responsePage = quizPage.map(quizMapper::toResponseDTO);
        return PageResponseDTO.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public QuizResponseDTO getById(UUID id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", id));
        return quizMapper.toResponseDTO(quiz);
    }

    @Override
    @Transactional(readOnly = true)
    public QuizDetailResponseDTO getWithQuestions(UUID id) {
        Quiz quiz = quizRepository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", id));
        return quizMapper.toDetailResponseDTO(quiz);
    }

    @Override
    public QuizResponseDTO update(UUID id, QuizRequestDTO requestDTO) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", id));
        
        quizMapper.updateEntityFromDTO(requestDTO, quiz);
        
        Quiz updatedQuiz = quizRepository.save(quiz);
        return quizMapper.toResponseDTO(updatedQuiz);
    }

    @Override
    public void delete(UUID id) {
        if (!quizRepository.existsById(id)) {
            throw new ResourceNotFoundException("Quiz", "id", id);
        }
        quizRepository.deleteById(id);
    }

    @Override
    public QuizDetailResponseDTO addQuestions(UUID quizId, java.util.List<UUID> questionIds) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        for (UUID questionId : questionIds) {
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));
            addQuestionIfNotExists(quiz, question);
        }
        
        return getQuizWithDetails(quizId);
    }

    @Override
    public void removeQuestion(UUID quizId, UUID questionId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));
        
        quiz.getQuestions().remove(question);
        quizRepository.save(quiz);
    }
    
    private void addQuestionIfNotExists(Quiz quiz, Question question) {
        if (!quiz.getQuestions().contains(question)) {
            quiz.getQuestions().add(question);
            quizRepository.save(quiz);
        }
    }
    
    private QuizDetailResponseDTO getQuizWithDetails(UUID quizId) {
        Quiz quiz = quizRepository.findWithDetailsById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));
        return quizMapper.toDetailResponseDTO(quiz);
    }
}
