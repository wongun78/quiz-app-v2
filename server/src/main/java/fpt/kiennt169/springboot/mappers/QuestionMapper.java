package fpt.kiennt169.springboot.mappers;

import fpt.kiennt169.springboot.dtos.questions.QuestionRequestDTO;
import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.entities.Quiz;

import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {AnswerMapper.class})
public interface QuestionMapper {
 
    @Mapping(target = "quizzes", expression = "java(mapQuizzesToDTO(question.getQuizzes()))")
    QuestionResponseDTO toResponseDTO(Question question);
 
    @Mapping(target = "quizzes", ignore = true)  
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "answers", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Question toEntity(QuestionRequestDTO requestDTO);

    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(QuestionRequestDTO requestDTO, @MappingTarget Question question);

    default java.util.List<QuestionResponseDTO.QuizInfoDTO> mapQuizzesToDTO(java.util.List<Quiz> quizzes) {
        if (quizzes == null || quizzes.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return quizzes.stream()
            .distinct()
            .map(quiz -> new QuestionResponseDTO.QuizInfoDTO(quiz.getId(), quiz.getTitle()))
            .toList();
    }
}
