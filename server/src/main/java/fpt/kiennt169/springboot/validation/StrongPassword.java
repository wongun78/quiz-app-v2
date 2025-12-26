// package fpt.kiennt169.springboot.validation;

// import java.lang.annotation.Documented;
// import java.lang.annotation.ElementType;
// import java.lang.annotation.Retention;
// import java.lang.annotation.RetentionPolicy;
// import java.lang.annotation.Target;

// import jakarta.validation.Constraint;
// import jakarta.validation.Payload;

// @Documented
// @Constraint(validatedBy = StrongPasswordValidator.class)
// @Target({ElementType.FIELD, ElementType.PARAMETER})
// @Retention(RetentionPolicy.RUNTIME)
// public @interface StrongPassword {
    
//     String message() default "Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character";
    
//     Class<?>[] groups() default {};
    
//     Class<? extends Payload>[] payload() default {};
    
//     /**
//      * Minimum length of password.
//      */
//     int minLength() default 8;
    
//     /**
//      * Whether to require uppercase letter.
//      */
//     boolean requireUppercase() default true;
    
//     /**
//      * Whether to require lowercase letter.
//      */
//     boolean requireLowercase() default true;
    
//     /**
//      * Whether to require digit.
//      */
//     boolean requireDigit() default true;
    
//     /**
//      * Whether to require special character.
//      */
//     boolean requireSpecialChar() default true;
// }
