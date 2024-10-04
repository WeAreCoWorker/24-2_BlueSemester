package hello.degitaleye.controller;

import hello.degitaleye.dto.AiFormDataResponseDto;
import hello.degitaleye.temp.TestDto;
import io.swagger.v3.core.util.Json;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MockFlaskController {
    @Value("${file.dir}")
    private String fileDir; // 파일 저장



    /**
     * 테스트용 플라스크 서버 역할 -> 나중에 삭제
     * @param dialogueT
     * @param file
     * @return
     */
    @PostMapping(value = "/test_rest_template_get", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String tempAiServer(@RequestPart(value = "text", required = false) String dialogueT,
                               @RequestPart(value = "image") MultipartFile file) {
        log.info("===test2 dialouge_T = {}===", dialogueT);
        saveFile(file);

        if (dialogueT == null) {
            return "image test is good";
        } else {
            return Json.pretty(new AiFormDataResponseDto(dialogueT, file.getOriginalFilename()));
        }

    }

    @PostMapping(value = "/test_image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String testImage(@RequestPart(value = "image") MultipartFile file) {
        saveFile(file);
            return Json.pretty(new TestDto("Hello"));
    }

    /**
     * 파일 저장 메서드
     * @param file
     */
    private void saveFile(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String fullPath = fileDir + file.getOriginalFilename();
            log.info("===test2 파일 저장 = {}===", fullPath);
            try {
                file.transferTo(new File(fullPath));
            } catch (IOException e) {
                log.error("test2 파일 저장 실패 ", e);
            }
        }
    }
}
