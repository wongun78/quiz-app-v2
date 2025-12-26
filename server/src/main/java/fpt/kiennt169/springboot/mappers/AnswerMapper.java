package fpt.kiennt169.springboot.mappers;

import fpt.kiennt169.springboot.dtos.answers.AnswerRequestDTO;
import fpt.kiennt169.springboot.dtos.answers.AnswerResponseDTO;
import fpt.kiennt169.springboot.entities.Answer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnswerMapper {
    
    AnswerResponseDTO toResponseDTO(Answer answer);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Answer toEntity(AnswerRequestDTO requestDTO);
}
