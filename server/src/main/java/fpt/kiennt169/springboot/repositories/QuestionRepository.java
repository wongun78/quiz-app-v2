package fpt.kiennt169.springboot.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import fpt.kiennt169.springboot.entities.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID>, JpaSpecificationExecutor<Question> {

    @EntityGraph(attributePaths = {"answers"})
    Optional<Question> findById(UUID id);

    @EntityGraph(attributePaths = {"answers"})
    Page<Question> findAll(Specification<Question> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"answers"})
    List<Question> findByQuizzesId(UUID quizId);
}
