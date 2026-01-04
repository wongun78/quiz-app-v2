package fpt.kiennt169.springboot.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import fpt.kiennt169.springboot.entities.Answer;
import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.entities.Quiz;
import fpt.kiennt169.springboot.entities.Role;
import fpt.kiennt169.springboot.entities.User;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;
import fpt.kiennt169.springboot.enums.RoleEnum;
import fpt.kiennt169.springboot.repositories.AnswerRepository;
import fpt.kiennt169.springboot.repositories.QuestionRepository;
import fpt.kiennt169.springboot.repositories.QuizRepository;
import fpt.kiennt169.springboot.repositories.RoleRepository;
import fpt.kiennt169.springboot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Set;

/**
 * Database initializer that runs on application startup.
 * Creates sample quizzes and questions if they don't exist.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${data.init.admin.email}")
    private String adminEmail;
    
    @Value("${data.init.admin.password}")
    private String adminPassword;
    
    @Value("${data.init.admin.fullname}")
    private String adminFullname;
    
    @Value("${data.init.user.email}")
    private String userEmail;
    
    @Value("${data.init.user.password}")
    private String userPassword;
    
    @Value("${data.init.user.fullname}")
    private String userFullname;

    @Bean
    @ConditionalOnProperty(name = "data.init.enabled", havingValue = "true", matchIfMissing = true)
    CommandLineRunner initDatabase() {
        return args -> {
            initRoles();
            initUsers();
            initQuizzes();
        };
    }

    /**
     * Initialize system roles
     */
    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName(RoleEnum.ROLE_ADMIN);
            adminRole.setDescription("Administrator with full system access");
            roleRepository.save(adminRole);
            log.info("Created role: ROLE_ADMIN");

            Role userRole = new Role();
            userRole.setName(RoleEnum.ROLE_USER);
            userRole.setDescription("Standard user with basic access");
            roleRepository.save(userRole);
            log.info("Created role: ROLE_USER");
            
            Role moderatorRole = new Role();
            moderatorRole.setName(RoleEnum.ROLE_MODERATOR);
            moderatorRole.setDescription("Moderator for content management");
            roleRepository.save(moderatorRole);
            log.info("Created role: ROLE_MODERATOR");
            
            Role managerRole = new Role();
            managerRole.setName(RoleEnum.ROLE_MANAGER);
            managerRole.setDescription("Manager for system operations");
            roleRepository.save(managerRole);
            log.info("Created role: ROLE_MANAGER");
            
            Role editorRole = new Role();
            editorRole.setName(RoleEnum.ROLE_EDITOR);
            editorRole.setDescription("Editor for content editing");
            roleRepository.save(editorRole);
            log.info("Created role: ROLE_EDITOR");
        }
    }

    /**
     * Initialize sample users
     */
    private void initUsers() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(RoleEnum.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
            
            Role userRole = roleRepository.findByName(RoleEnum.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setUsername(adminEmail.substring(0, adminEmail.indexOf('@')));
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setFullName(adminFullname);
            admin.setActive(true);
            admin.setRefreshToken(null); 
            admin.setRoles(Set.of(adminRole, userRole));
            userRepository.save(admin);
            log.info("Created user: {} (admin)", admin.getEmail());

            User user = new User();
            user.setEmail(userEmail);
            user.setUsername(userEmail.substring(0, userEmail.indexOf('@')));
            user.setPassword(passwordEncoder.encode(userPassword));
            user.setFirstName("Test");
            user.setLastName("User");
            user.setFullName(userFullname);
            user.setActive(true);
            user.setRefreshToken(null); 
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            log.info("Created user: {} (user)", user.getEmail());
        }
    }

    /**
     * Initialize sample quizzes with questions
     */
    private void initQuizzes() {
        if (quizRepository.count() > 0) return;

        Quiz javaQuiz = createQuiz("Java Programming Basics", 
            "Test your knowledge of Java programming fundamentals", 30, true);
        
        Question q1 = createQuestion("What is the correct syntax to output 'Hello World' in Java?", 
            QuestionTypeEnum.SINGLE_CHOICE, 5);
        createAnswer(q1, "System.out.println(\"Hello World\");", true);
        createAnswer(q1, "Console.WriteLine(\"Hello World\");", false);
        createAnswer(q1, "print(\"Hello World\")", false);
        
        Question q2 = createQuestion("Which of the following are primitive data types in Java?", 
            QuestionTypeEnum.MULTIPLE_CHOICE, 10);
        createAnswer(q2, "int", true);
        createAnswer(q2, "String", false);
        createAnswer(q2, "boolean", true);
        
        javaQuiz.getQuestions().add(q1);
        javaQuiz.getQuestions().add(q2);
        quizRepository.save(javaQuiz);

        Quiz springQuiz = createQuiz("Spring Boot Fundamentals", 
            "Assess your understanding of Spring Boot framework", 45, true);
        
        Question sq1 = createQuestion("What annotation is used to create a REST controller?", 
            QuestionTypeEnum.SINGLE_CHOICE, 5);
        createAnswer(sq1, "@RestController", true);
        createAnswer(sq1, "@Controller", false);
        createAnswer(sq1, "@Service", false);
        
        Question sq2 = createQuestion("Which are Spring Boot Starter dependencies?", 
            QuestionTypeEnum.MULTIPLE_CHOICE, 10);
        createAnswer(sq2, "spring-boot-starter-web", true);
        createAnswer(sq2, "spring-boot-starter-data-jpa", true);
        createAnswer(sq2, "hibernate-core", false);
        
        springQuiz.getQuestions().add(sq1);
        springQuiz.getQuestions().add(sq2);
        quizRepository.save(springQuiz);

        log.info("Created {} quizzes with questions", quizRepository.count());
    }

    private Quiz createQuiz(String title, String description, int duration, boolean active) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setDurationMinutes(duration);
        quiz.setActive(active);
        return quizRepository.save(quiz);
    }

    private Question createQuestion(String content, QuestionTypeEnum type, int score) {
        Question question = new Question();
        question.setContent(content);
        question.setType(type);
        question.setScore(score);
        return questionRepository.save(question);
    }

    private void createAnswer(Question question, String content, boolean isCorrect) {
        Answer answer = new Answer();
        answer.setContent(content);
        answer.setIsCorrect(isCorrect);
        answer.setQuestion(question);
        answerRepository.save(answer);
    }
}
