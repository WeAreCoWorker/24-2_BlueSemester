package hello.degitaleye.controller.advice;

import com.deepl.api.DeepLException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.Locale;

@RestControllerAdvice(annotations = RestController.class)
@Slf4j
@RequiredArgsConstructor
public class AiExControllerAdvice {


    private final MessageSource ms; // 메세지 소스 주입

    @ExceptionHandler(DeepLException.class)
    public ResponseEntity<ErrorResult> deepLExHandle(DeepLException e) {
        log.error("[exception-handle] ex", e);
        return ResponseEntity
                .internalServerError()
                .body(new ErrorResult(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        ms.getMessage("error.translate",null,getContextLocale()),
                        ms.getMessage("solution.translate",null,getContextLocale())));
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ErrorResult> notSupportedExceptionHandle(MissingServletRequestPartException e) {
        log.error("[exception-handle] ex", e);
        return ResponseEntity
                .badRequest()
                .body(new ErrorResult(HttpStatus.BAD_REQUEST.value(),
                        ms.getMessage("error.400", null, getContextLocale()),
                        ms.getMessage("solution.translate", null, getContextLocale())));
    }





    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResult> exHandle(Exception e) {
        log.error("[exception-handle] ex", e);
        return ResponseEntity
                .internalServerError()
                .body(new ErrorResult(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        ms.getMessage("error.500", null, getContextLocale()),
                        ms.getMessage("solution.500", null, getContextLocale())));
    }

    private Locale getContextLocale() {
        return LocaleContextHolder.getLocale();
    }
}
