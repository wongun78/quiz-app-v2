package fpt.kiennt169.springboot.mappers;

import fpt.kiennt169.springboot.dtos.questions.QuestionResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizDetailResponseDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizRequestDTO;
import fpt.kiennt169.springboot.dtos.quizzes.QuizResponseDTO;
import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.entities.Quiz;
import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {AnswerMapper.class})
public interface QuizMapper {
    
    @Mapping(target = "totalQuestions", expression = "java(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0)")
    QuizResponseDTO toResponseDTO(Quiz quiz);
    
    @Mapping(target = "questions", expression = "java(mapQuestionsWithoutQuizzes(quiz.getQuestions()))")
    QuizDetailResponseDTO toDetailResponseDTO(Quiz quiz);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "submissions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Quiz toEntity(QuizRequestDTO requestDTO);
    
    @InheritConfiguration(name = "toEntity")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(QuizRequestDTO requestDTO, @MappingTarget Quiz quiz);
    
    default List<QuestionResponseDTO> mapQuestionsWithoutQuizzes(List<Question> questions) {
        if (questions == null) {
            return List.of();
        }
        return questions.stream()
            .map(question -> new QuestionResponseDTO(
                question.getId(),
                question.getContent(),
                question.getType(),
                question.getScore(),
                List.of(), 
                question.getAnswers() != null 
                    ? question.getAnswers().stream()
                        .map(answer -> new fpt.kiennt169.springboot.dtos.answers.AnswerResponseDTO(
                            answer.getId(),
                            answer.getContent(),
                            answer.getIsCorrect()
                        ))
                        .collect(Collectors.toList())
                    : List.of()
            ))
            .toList();
    }
}
