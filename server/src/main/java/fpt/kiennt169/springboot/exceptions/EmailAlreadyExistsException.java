package fpt.kiennt169.springboot.exceptions;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends BaseException {
    
    private static final String ERROR_CODE = "EMAIL_ALREADY_EXISTS";
    private static final String MESSAGE_KEY = "error.email.existed";
    
    public EmailAlreadyExistsException(String email) {
        super(
            String.format("Email already exists: %s", email),
            HttpStatus.CONFLICT,
            ERROR_CODE,
            MESSAGE_KEY,
            email
        );
    }
}
