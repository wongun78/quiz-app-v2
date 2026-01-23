package fpt.kiennt169.springboot.exceptions;

/**
 * Custom exception for token service operations
 * Thrown when Redis operations fail or token management encounters errors
 * 
 * @author Quiz Team
 * @version 2.0.0
 */
public class TokenServiceException extends RuntimeException {
    
    public TokenServiceException(String message) {
        super(message);
    }
    
    public TokenServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
