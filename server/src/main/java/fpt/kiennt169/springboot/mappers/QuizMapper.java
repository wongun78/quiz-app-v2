package fpt.kiennt169.springboot.mappers;

import fpt.kiennt169.springboot.dtos.quizzes.QuizDetailResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizRequestDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizResponseDTO;
import fpt.kiennt169.springboot.entities.Quiz;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {QuestionMapper.class})
public interface QuizMapper {
    
    @Mapping(target = "totalQuestions", expression = "java(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0)")
    QuizResponseDTO toResponseDTO(Quiz quiz);
    
    QuizDetailResponseDTO toDetailResponseDTO(Quiz quiz);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "submissions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Quiz toEntity(QuizRequestDTO requestDTO);
    
    @InheritConfiguration(name = "toEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(QuizRequestDTO requestDTO, @MappingTarget Quiz quiz);
}
