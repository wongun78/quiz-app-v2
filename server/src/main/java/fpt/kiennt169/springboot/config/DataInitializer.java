package fpt.kiennt169.springboot.config;

import org.springframework.boot.CommandLineRunner;
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

    @Bean
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
            roleRepository.save(adminRole);
            log.info("Created role: ROLE_ADMIN");

            Role userRole = new Role();
            userRole.setName(RoleEnum.ROLE_USER);
            roleRepository.save(userRole);
            log.info("Created role: ROLE_USER");
        }
    }

    /**
     * Initialize sample users
     */
    private void initUsers() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findAll().stream()
                    .filter(r -> r.getName() == RoleEnum.ROLE_ADMIN)
                    .findFirst()
                    .orElseThrow();
            
            Role userRole = roleRepository.findAll().stream()
                    .filter(r -> r.getName() == RoleEnum.ROLE_USER)
                    .findFirst()
                    .orElseThrow();

            // Admin user
            User admin = new User();
            admin.setEmail("admin@quiz.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Admin User");
            admin.setActive(true);
            admin.setRefreshToken(null); // Will be set on login
            admin.setRoles(Set.of(adminRole, userRole));
            userRepository.save(admin);
            log.info("Created user: {} (admin)", admin.getEmail());

            // Regular user
            User user = new User();
            user.setEmail("user@quiz.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFullName("Test User");
            user.setActive(true);
            user.setRefreshToken(null); // Will be set on login
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            log.info("Created user: {} (user)", user.getEmail());
        }
    }

    /**
     * Initialize sample quizzes with questions
     */
    private void initQuizzes() {
        // Quiz 1: Java Programming
        if (!quizRepository.existsByTitle("Java Programming Basics")) {
            Quiz javaQuiz = new Quiz();
            javaQuiz.setTitle("Java Programming Basics");
            javaQuiz.setDescription("Test your knowledge of Java programming fundamentals");
            javaQuiz.setDurationMinutes(30);
            javaQuiz.setActive(true);
            javaQuiz = quizRepository.save(javaQuiz);
            log.info("Created quiz: {}", javaQuiz.getTitle());

            // Questions for Java Quiz
            Question q1 = createQuestion(javaQuiz, "What is the correct syntax to output 'Hello World' in Java?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(q1, "System.out.println(\"Hello World\");", true);
            createAnswer(q1, "Console.WriteLine(\"Hello World\");", false);
            createAnswer(q1, "print(\"Hello World\")", false);
            createAnswer(q1, "echo \"Hello World\"", false);

            Question q2 = createQuestion(javaQuiz, "Which of the following are primitive data types in Java?", 
                          QuestionTypeEnum.MULTIPLE_CHOICE, 10);
            createAnswer(q2, "int", true);
            createAnswer(q2, "String", false);
            createAnswer(q2, "boolean", true);
            createAnswer(q2, "Integer", false);

            Question q3 = createQuestion(javaQuiz, "What does JVM stand for?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(q3, "Java Virtual Machine", true);
            createAnswer(q3, "Java Variable Method", false);
            createAnswer(q3, "Java Visual Model", false);
            createAnswer(q3, "Java Verified Machine", false);

            Question q4 = createQuestion(javaQuiz, "Which keyword is used to inherit a class in Java?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(q4, "extends", true);
            createAnswer(q4, "implements", false);
            createAnswer(q4, "inherits", false);
            createAnswer(q4, "derive", false);
        }

        // Quiz 2: Spring Boot
        if (!quizRepository.existsByTitle("Spring Boot Fundamentals")) {
            Quiz springQuiz = new Quiz();
            springQuiz.setTitle("Spring Boot Fundamentals");
            springQuiz.setDescription("Assess your understanding of Spring Boot framework");
            springQuiz.setDurationMinutes(45);
            springQuiz.setActive(true);
            springQuiz = quizRepository.save(springQuiz);
            log.info("Created quiz: {}", springQuiz.getTitle());

            // Questions for Spring Boot Quiz
            Question sq1 = createQuestion(springQuiz, "What annotation is used to create a REST controller in Spring Boot?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(sq1, "@RestController", true);
            createAnswer(sq1, "@Controller", false);
            createAnswer(sq1, "@Service", false);
            createAnswer(sq1, "@Component", false);

            Question sq2 = createQuestion(springQuiz, "Which of the following are Spring Boot Starter dependencies?", 
                          QuestionTypeEnum.MULTIPLE_CHOICE, 10);
            createAnswer(sq2, "spring-boot-starter-web", true);
            createAnswer(sq2, "spring-boot-starter-data-jpa", true);
            createAnswer(sq2, "hibernate-core", false);
            createAnswer(sq2, "javax.servlet-api", false);

            Question sq3 = createQuestion(springQuiz, "What is the default port for Spring Boot application?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(sq3, "8080", true);
            createAnswer(sq3, "8000", false);
            createAnswer(sq3, "3000", false);
            createAnswer(sq3, "80", false);
        }

        // Quiz 3: Database
        if (!quizRepository.existsByTitle("Database Design")) {
            Quiz dbQuiz = new Quiz();
            dbQuiz.setTitle("Database Design");
            dbQuiz.setDescription("Test your database design and SQL knowledge");
            dbQuiz.setDurationMinutes(40);
            dbQuiz.setActive(true);
            dbQuiz = quizRepository.save(dbQuiz);
            log.info("Created quiz: {}", dbQuiz.getTitle());

            // Questions for Database Quiz
            Question dq1 = createQuestion(dbQuiz, "What does SQL stand for?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(dq1, "Structured Query Language", true);
            createAnswer(dq1, "Simple Query Language", false);
            createAnswer(dq1, "Standard Question Language", false);
            createAnswer(dq1, "Sequential Query Logic", false);

            Question dq2 = createQuestion(dbQuiz, "Which SQL command is used to retrieve data from a database?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(dq2, "SELECT", true);
            createAnswer(dq2, "GET", false);
            createAnswer(dq2, "RETRIEVE", false);
            createAnswer(dq2, "FETCH", false);

            Question dq3 = createQuestion(dbQuiz, "Which of the following are types of database relationships?", 
                          QuestionTypeEnum.MULTIPLE_CHOICE, 10);
            createAnswer(dq3, "One-to-One", true);
            createAnswer(dq3, "Many-to-Many", true);
            createAnswer(dq3, "All-to-All", false);
            createAnswer(dq3, "Single-to-Multiple", false);
        }

        // Quiz 4: Inactive Quiz (for testing)
        if (!quizRepository.existsByTitle("Advanced Algorithms")) {
            Quiz algoQuiz = new Quiz();
            algoQuiz.setTitle("Advanced Algorithms");
            algoQuiz.setDescription("Challenge yourself with complex algorithmic problems");
            algoQuiz.setDurationMinutes(60);
            algoQuiz.setActive(false);
            algoQuiz = quizRepository.save(algoQuiz);
            log.info("Created quiz: {} (inactive)", algoQuiz.getTitle());

            // Questions for Algorithm Quiz
            Question aq1 = createQuestion(algoQuiz, "What is the time complexity of binary search?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 10);
            createAnswer(aq1, "O(log n)", true);
            createAnswer(aq1, "O(n)", false);
            createAnswer(aq1, "O(n^2)", false);
            createAnswer(aq1, "O(1)", false);

            Question aq2 = createQuestion(algoQuiz, "Which data structure uses LIFO principle?", 
                          QuestionTypeEnum.SINGLE_CHOICE, 5);
            createAnswer(aq2, "Stack", true);
            createAnswer(aq2, "Queue", false);
            createAnswer(aq2, "Array", false);
            createAnswer(aq2, "Tree", false);
        }

        log.info("Database initialization completed!");
    }

    /**
     * Helper method to create and save a question with answers
     */
    private Question createQuestion(Quiz quiz, String content, QuestionTypeEnum type, int score) {
        Question question = new Question();
        question.setContent(content);
        question.setType(type);
        question.setScore(score);
        question = questionRepository.save(question);
        
        // Add question to quiz (Many-to-Many relationship)
        quiz.getQuestions().add(question);
        quizRepository.save(quiz);
        
        log.info("  - Created question: {} (Score: {})", content, score);
        return question;
    }

    /**
     * Helper method to create and save an answer
     */
    private void createAnswer(Question question, String content, boolean isCorrect) {
        Answer answer = new Answer();
        answer.setContent(content);
        answer.setIsCorrect(isCorrect);
        answer.setQuestion(question);
        question.getAnswers().add(answer); // Sync bidirectional relationship
        answerRepository.save(answer);
        log.info("    * Answer: {} [{}]", content, isCorrect ? "CORRECT" : "WRONG");
    }
}
