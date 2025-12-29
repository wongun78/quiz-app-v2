package fpt.kiennt169.springboot.specifications;

import fpt.kiennt169.springboot.entities.Question;
import fpt.kiennt169.springboot.enums.QuestionTypeEnum;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class QuestionSpecification {

    private QuestionSpecification() {}

    public static Specification<Question> hasContent(String content) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(content)) return null;
            return cb.like(cb.lower(root.get("content")), "%" + content.toLowerCase() + "%");
        };
    }

    public static Specification<Question> hasType(QuestionTypeEnum type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }
}
