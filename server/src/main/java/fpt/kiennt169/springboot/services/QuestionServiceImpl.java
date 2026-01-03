package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
import fpt.kiennt169.springboot.dtos.answers.AnswerRequestDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionRequestDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import fpt.kiennt169.springboot.entities.Answer;
import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.exceptions.ResourceNotFoundException;
import fpt.kiennt169.springboot.mappers.AnswerMapper;
import fpt.kiennt169.springboot.mappers.QuestionMapper;
import fpt.kiennt169.springboot.repositories.AnswerRepository;
import fpt.kiennt169.springboot.repositories.QuestionRepository;
import fpt.kiennt169.springboot.specifications.QuestionSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionServiceImpl implements QuestionService {
    
    private static final String ENTITY_NAME = "Question";
    
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;

    @Override
    @Transactional
    public QuestionResponseDTO create(QuestionRequestDTO requestDTO) {
        Question question = questionMapper.toEntity(requestDTO);
        
        // Map answers from DTO and set bidirectional relationship
        if (requestDTO.answers() != null && !requestDTO.answers().isEmpty()) {
            Set<Answer> answers = new java.util.HashSet<>();
            for (AnswerRequestDTO answerDTO : requestDTO.answers()) {
                Answer answer = answerMapper.toEntity(answerDTO);
                answer.setQuestion(question);
                answers.add(answer);
            }
            question.setAnswers(answers);
        }

        Question savedQuestion = questionRepository.save(question);

        return questionMapper.toResponseDTO(savedQuestion);
    }
   
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<QuestionResponseDTO> getWithPaging(Pageable pageable) {
        Page<Question> questionPage = questionRepository.findAll(pageable);
        
        Page<QuestionResponseDTO> responsePage = questionPage.map(questionMapper::toResponseDTO);
        
        return PageResponseDTO.from(responsePage);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<QuestionResponseDTO> searchWithPaging(String content, fpt.kiennt169.springboot.enums.QuestionTypeEnum type, Pageable pageable) {
        Specification<Question> spec = Specification
                .where(QuestionSpecification.hasContent(content))
                .and(QuestionSpecification.hasType(type));
        
        Page<Question> questionPage = questionRepository.findAll(spec, pageable);
        
        Page<QuestionResponseDTO> responsePage = questionPage.map(questionMapper::toResponseDTO);
        return PageResponseDTO.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponseDTO getById(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ENTITY_NAME, "id", id));
        
        return questionMapper.toResponseDTO(question);
    }

    @Override
    @Transactional
    public QuestionResponseDTO update(UUID id, QuestionRequestDTO requestDTO) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ENTITY_NAME, "id", id));
        
        questionMapper.updateEntityFromDTO(requestDTO, question);
        
        updateAnswers(question, requestDTO.answers());
        
        Question updatedQuestion = questionRepository.save(question);
        
        return questionMapper.toResponseDTO(updatedQuestion);
    }

    private void updateAnswers(Question question, List<AnswerRequestDTO> answerDTOs) {
        Set<Answer> currentAnswers = question.getAnswers();
        
        Set<UUID> requestedIds = answerDTOs.stream()
                .map(AnswerRequestDTO::id)
                .filter(Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        
        Set<Answer> answersToDelete = currentAnswers.stream()
                .filter(answer -> !requestedIds.contains(answer.getId()))
                .collect(java.util.stream.Collectors.toSet());
        answerRepository.deleteAll(answersToDelete);
        currentAnswers.removeAll(answersToDelete);
        
        for (AnswerRequestDTO answerDTO : answerDTOs) {
            if (answerDTO.id() != null) {
                currentAnswers.stream()
                        .filter(answer -> answer.getId().equals(answerDTO.id()))
                        .findFirst()
                        .ifPresent(answer -> {
                            answer.setContent(answerDTO.content());
                            answer.setIsCorrect(answerDTO.isCorrect());
                        });
            } else {
                Answer newAnswer = answerMapper.toEntity(answerDTO);
                newAnswer.setQuestion(question);
                currentAnswers.add(newAnswer);
            }
        }
    }

    @Override
    public void delete(UUID id) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(ENTITY_NAME, "id", id));
        
        question.setIsDeleted(true);
        
        question.getAnswers().forEach(answer -> answer.setIsDeleted(true));
        
        questionRepository.save(question);
    }
}
