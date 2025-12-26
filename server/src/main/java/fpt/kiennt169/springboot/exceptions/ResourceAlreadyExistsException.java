package fpt.kiennt169.springboot.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceAlreadyExistsException extends BaseException {
    
    private static final String ERROR_CODE = "RESOURCE_ALREADY_EXISTS";
    private static final String MESSAGE_KEY = "error.resource.already_exists";
    
    public ResourceAlreadyExistsException(String message) {
        super(
            message,
            HttpStatus.CONFLICT,
            ERROR_CODE,
            MESSAGE_KEY
        );
    }
}
