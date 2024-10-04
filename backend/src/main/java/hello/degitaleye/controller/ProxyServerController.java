package hello.degitaleye.controller;

import com.deepl.api.DeepLException;
import hello.degitaleye.dto.AiFormDataResponseDto;
import hello.degitaleye.dto.AiResponseDto;
import hello.degitaleye.service.ProxyServerService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ProxyServerController {

    private final ProxyServerService proxyServerService;

    /**
     * 단일 이미지 파일을 받는 컨트롤러
     * @param file android 에서 받는 이미지
     * @return
     */
    @PostMapping(value = "/ai-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AiResponseDto> aiImage(
            @RequestPart(value = "image") MultipartFile file) {

        AiResponseDto aiImageDataResponse = proxyServerService.getAiImageDataResponse(file);
        log.info("test KK {}",aiImageDataResponse.getMessage());
        return ResponseEntity.ok().body(aiImageDataResponse);

    }

    /**
     *
     * @param text 사용자 요청 문장
     * @param file AI 처리할 이미지
     * @return TODO client return 생각하기, @ExceptionHandler 작성하기
     */
    @PostMapping(value = "/ai-form", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AiResponseDto> aiForm( @RequestPart(value = "text") String text,
                                                @RequestPart(value = "image") MultipartFile file) throws DeepLException, InterruptedException {

        AiResponseDto aiFormDataResponse = proxyServerService.getAiFormDataResponse(text, file);
        return ResponseEntity.ok().body(aiFormDataResponse);

    }







}

