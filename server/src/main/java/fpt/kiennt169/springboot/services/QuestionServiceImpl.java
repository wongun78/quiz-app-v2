package fpt.kiennt169.springboot.services;

import fpt.kiennt169.springboot.dtos.PageResponseDTO;
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

        if (question.getAnswers() != null) {
            question.getAnswers().forEach(answer -> answer.setQuestion(question));
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
        
        answerRepository.deleteAll(question.getAnswers());
        question.getAnswers().clear();
        
        List<Answer> newAnswers = requestDTO.answers().stream()
                .map(answerDTO -> {
                    Answer answer = answerMapper.toEntity(answerDTO);
                    answer.setQuestion(question);
                    return answer;
                })
                .toList();
        
        question.setAnswers(newAnswers);
        
        Question updatedQuestion = questionRepository.save(question);
        
        return questionMapper.toResponseDTO(updatedQuestion);
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
