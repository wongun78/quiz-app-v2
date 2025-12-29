package fpt.kiennt169.springboot.specifications;

import fpt.kiennt169.springboot.entities.User;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class UserSpecification {

    private UserSpecification() {}

    public static Specification<User> hasFullName(String fullName) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(fullName)) return null;
            return cb.like(cb.lower(root.get("fullName")), "%" + fullName.toLowerCase() + "%");
        };
    }

    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(email)) return null;
            return cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
        };
    }

    public static Specification<User> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null : cb.equal(root.get("active"), active);
    }
}
