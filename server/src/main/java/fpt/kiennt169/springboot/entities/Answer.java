package fpt.kiennt169.springboot.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answers", indexes = {
    @Index(name = "idx_answer_question_id", columnList = "question_id"),
    @Index(name = "idx_answer_is_correct", columnList = "is_correct")
})
public class Answer extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
}
