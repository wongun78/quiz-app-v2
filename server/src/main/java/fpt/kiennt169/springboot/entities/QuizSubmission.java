package fpt.kiennt169.springboot.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quiz_submissions", indexes = {
    @Index(name = "idx_submission_user_id", columnList = "user_id"),
    @Index(name = "idx_submission_quiz_id", columnList = "quiz_id"),
    @Index(name = "idx_submission_time", columnList = "submission_time"),
    @Index(name = "idx_submission_score", columnList = "score")
})
public class QuizSubmission extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private Double score;
    
    @Column(name = "submission_time", nullable = false)
    private LocalDateTime submissionTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
}
