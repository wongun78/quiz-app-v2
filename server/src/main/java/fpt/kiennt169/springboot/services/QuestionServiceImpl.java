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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionServiceImpl implements QuestionService {
    
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
        Page<Question> questionPage;
        
        if (content != null && type != null) {
            questionPage = questionRepository.findByContentContainingIgnoreCaseAndType(content, type, pageable);
        } else if (content != null) {
            questionPage = questionRepository.findByContentContainingIgnoreCase(content, pageable);
        } else if (type != null) {
            questionPage = questionRepository.findByType(type, pageable);
        } else {
            questionPage = questionRepository.findAll(pageable);
        }
        
        Page<QuestionResponseDTO> responsePage = questionPage.map(questionMapper::toResponseDTO);
        return PageResponseDTO.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponseDTO getById(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
        
        return questionMapper.toResponseDTO(question);
    }

    @Override
    @Transactional
    public QuestionResponseDTO update(UUID id, QuestionRequestDTO requestDTO) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
        
        questionMapper.updateEntityFromDTO(requestDTO, question);
        
        answerRepository.deleteAll(question.getAnswers());
        question.getAnswers().clear();
        
        List<Answer> newAnswers = requestDTO.answers().stream()
                .map(answerDTO -> {
                    Answer answer = answerMapper.toEntity(answerDTO);
                    answer.setQuestion(question);
                    return answer;
                })
                .collect(Collectors.toList());
        
        question.setAnswers(newAnswers);
        
        Question updatedQuestion = questionRepository.save(question);
        
        return questionMapper.toResponseDTO(updatedQuestion);
    }

    @Override
    public void delete(UUID id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question", "id", id);
        }
        questionRepository.deleteById(id);
    }
}
