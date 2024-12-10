package hello.degitaleye.controller;


import hello.degitaleye.dto.LinkResponseDto;
import hello.degitaleye.service.LinkTestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class LinkTestController {

    private final LinkTestService linkTestService;

    @GetMapping(value = "/init-test", produces = "application/json;charset=UTF-8")
    public ResponseEntity<LinkResponseDto> initTest()  {
        LinkResponseDto weather = linkTestService.getWeather();
        return ResponseEntity.ok().body(weather);
    }

    @GetMapping(value = "/test")
    public String test() {
        return "is ok?";
    }
}
