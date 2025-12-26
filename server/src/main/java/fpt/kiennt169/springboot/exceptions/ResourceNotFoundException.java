package fpt.kiennt169.springboot.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {
    
    private static final String ERROR_CODE = "RESOURCE_NOT_FOUND";
    private static final String MESSAGE_KEY = "error.resource.not_found";
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(
            String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue),
            HttpStatus.NOT_FOUND,
            ERROR_CODE,
            MESSAGE_KEY,
            resourceName, fieldName, fieldValue
        );
    }
  
}
