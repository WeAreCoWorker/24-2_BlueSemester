package hello.degitaleye.controller.advice;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorResult {
    private Integer code;
    private String message;
    private String solution;
}
