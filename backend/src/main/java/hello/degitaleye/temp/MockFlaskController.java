package hello.degitaleye.temp;

import hello.degitaleye.dto.AiResponseDto;
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

// TODO /send_check mock 만들기
@RestController
@RequiredArgsConstructor
@Slf4j
public class MockFlaskController {
    @Value("${file.dir}")
    private String fileDir; // 파일 저장

   /*
    send_per_check: only image
    send_check: image + text
     */

    /**
     * 테스트용 플라스크 서버 역할 -> 나중에 삭제
     */
    @PostMapping(value = "/send_per_check", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String temp_send_per_check(@RequestPart(value = "image") MultipartFile file) {
        log.info("temp_send_per_check:: image_name = {}, image_size = {} ", file.getOriginalFilename(), file.getSize() / 1024);
        saveFile(file);

        return Json.pretty(new AiResponseDto("image test is good"));

    }

    @PostMapping(value = "/send_check", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String temp_send_check(@RequestPart(value = "image") MultipartFile file,
                                  @RequestPart(value = "text") String text) {

        log.info("temp_send_check:: image_name = {}, image_size = {}KB, text = {}", file.getOriginalFilename(), file.getSize() / 1024, text);
        saveFile(file);

        return Json.pretty(new AiResponseDto(text));
    }


    /**
     * 파일 저장 메서드
     *
     * @param file
     */
    private void saveFile(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String fullPath = fileDir + file.getOriginalFilename();
            log.info("temp 파일 저장 = {}", fullPath);
            try {
                file.transferTo(new File(fullPath));
            } catch (IOException e) {
                log.error("temp 파일 저장 실패 ", e);
            }
        }
    }
}
