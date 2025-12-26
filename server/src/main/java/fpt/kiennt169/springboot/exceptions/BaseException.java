package fpt.kiennt169.springboot.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {
    
    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String messageKey;
    private final transient Object[] messageParams;
    
    protected BaseException(String message, HttpStatus httpStatus, String errorCode, String messageKey, Object... messageParams) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
        this.messageKey = messageKey;
        this.messageParams = messageParams;
    }
}
