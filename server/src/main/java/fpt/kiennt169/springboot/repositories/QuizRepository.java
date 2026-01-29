package fpt.kiennt169.springboot.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import fpt.kiennt169.springboot.entities.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID>, JpaSpecificationExecutor<Quiz> {

    @EntityGraph(attributePaths = {"questions"})
    @Override
    Optional<Quiz> findById(UUID id);
   
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions qs LEFT JOIN FETCH qs.answers WHERE q.id = :id")
    Optional<Quiz> findByIdWithQuestionsAndAnswers(@Param("id") UUID id);
    
    @Override
    Page<Quiz> findAll(Specification<Quiz> spec, Pageable pageable);
}
