package fpt.kiennt169.springboot.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quizzes", indexes = {
    @Index(name = "idx_quiz_title", columnList = "title"),
    @Index(name = "idx_quiz_active", columnList = "active"),
    @Index(name = "idx_quiz_title_active", columnList = "title, active"),
    @Index(name = "idx_quiz_active_created", columnList = "active, created_at")
})
public class Quiz extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, length = 150)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;
    
    @Column(nullable = false)
    private Boolean active = false;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "quiz_questions",
        joinColumns = @JoinColumn(name = "quiz_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizSubmission> submissions;
}