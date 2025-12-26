package fpt.kiennt169.springboot.exceptions;

import org.springframework.http.HttpStatus;

public class QuestionNotBelongToQuizException extends BaseException {
    
    private static final String ERROR_CODE = "QUESTION_NOT_BELONG_TO_QUIZ";
    private static final String MESSAGE_KEY = "error.question.not_belong_to_quiz";
    
    public QuestionNotBelongToQuizException() {
        super(
            "Question does not belong to this quiz",
            HttpStatus.BAD_REQUEST,
            ERROR_CODE,
            MESSAGE_KEY
        );
    }
}
