package hello.degitaleye.service;

import hello.degitaleye.dto.LinkResponseDto;
import hello.degitaleye.dto.weather.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class LinkTestService {

    @Value("${weather-key}")
    private String weatherKey;

    private final RestClient restClient;

    public LinkResponseDto getWeather() {


        ApiResponseDto dto = restClient.get()
                .uri(getWeatherUri())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(ApiResponseDto.class);


        if (dto != null && dto.getResponse().getBody() != null) { // 날씨 정보 받아왔다면
            System.out.println(("dto = " + (dto.getResponse().getBody().getItemsResponse().getItems()).get(5)));
            return new LinkResponseDto(LocalDateTime.now(),
                    "Digital Eye 가 사용가능 합니다.",
                    dto.getResponse().getBody().getItemsResponse());
        }

        return new LinkResponseDto(LocalDateTime.now(), "Digital Eye 가 사용가능 합니다.", null);








    }

    private URI getWeatherUri() {
        String BASE_URI = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
        String temp = BASE_URI + "?serviceKey=" + URLEncoder.encode(weatherKey, StandardCharsets.UTF_8);


        URI uriString = UriComponentsBuilder.fromHttpUrl(temp)
                .queryParam("pageNo", "1")
                .queryParam("numOfRows", "12")
                .queryParam("dataType", "JSON")
                .queryParam("base_date", getCurrentDate())
                .queryParam("base_time", "1700")
                .queryParam("nx", "55")
                .queryParam("ny", "127")
                .build(true)
                .toUri();
        System.out.println("uriString = " + uriString);
        return uriString;
    }

    private String getCurrentHour() {
        return LocalDateTime.now().minusHours(1L).format(DateTimeFormatter.ofPattern("HHmm"));

    }

    private String getCurrentDate() {
        return LocalDateTime.now().minusDays(1L).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

}
