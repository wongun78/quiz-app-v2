// package fpt.kiennt169.springboot.validation;

// import jakarta.validation.ConstraintValidator;
// import jakarta.validation.ConstraintValidatorContext;

// public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

//     private int minLength;
//     private boolean requireUppercase;
//     private boolean requireLowercase;
//     private boolean requireDigit;
//     private boolean requireSpecialChar;

//     @Override
//     public void initialize(StrongPassword constraintAnnotation) {
//         this.minLength = constraintAnnotation.minLength();
//         this.requireUppercase = constraintAnnotation.requireUppercase();
//         this.requireLowercase = constraintAnnotation.requireLowercase();
//         this.requireDigit = constraintAnnotation.requireDigit();
//         this.requireSpecialChar = constraintAnnotation.requireSpecialChar();
//     }

//     @Override
//     public boolean isValid(String password, ConstraintValidatorContext context) {
//         if (password == null || password.isBlank()) {
//             return false;
//         }

//         // Check minimum length
//         if (password.length() < minLength) {
//             return false;
//         }

//         // Check uppercase requirement
//         if (requireUppercase && !password.matches(".*[A-Z].*")) {
//             return false;
//         }

//         // Check lowercase requirement
//         if (requireLowercase && !password.matches(".*[a-z].*")) {
//             return false;
//         }

//         // Check digit requirement
//         if (requireDigit && !password.matches(".*\\d.*")) {
//             return false;
//         }

//         // Check special character requirement
//         return !requireSpecialChar || password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
//     }
// }
