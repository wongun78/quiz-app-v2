package fpt.kiennt169.springboot.specifications;

import fpt.kiennt169.springboot.entities.Quiz;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class QuizSpecification {

    private QuizSpecification() {}

    public static Specification<Quiz> hasTitle(String title) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(title)) return null;
            return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Quiz> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null : cb.equal(root.get("active"), active);
    }

}
