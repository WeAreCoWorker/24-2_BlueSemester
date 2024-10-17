package hello.degitaleye.temp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class TempController {
    // test
    @PostMapping(value = "/ai-test", consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TestDto> aiTest(@RequestBody String text) {
        log.info("Test text = {}", text);
        return ResponseEntity.ok().body(new TestDto("Received Test:" + text));
    }
}
