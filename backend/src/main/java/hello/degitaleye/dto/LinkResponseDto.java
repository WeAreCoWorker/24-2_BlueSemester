package hello.degitaleye.dto;

import hello.degitaleye.dto.weather.ItemsResponseDto;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LinkResponseDto {

    String currentTime;
    String message;
    String weather;

    public LinkResponseDto(LocalDateTime currentTime, String message, ItemsResponseDto itemsResponseDto) {
        this.currentTime = currentTime.format(DateTimeFormatter.ofPattern("MM일 dd일 HH시입니다."));
        this.message = message;


        if (itemsResponseDto != null) {
            int code = Integer.parseInt(itemsResponseDto.getItems().get(5).getFcstValue());
            if (code == 1) {
                weather = "맑음";
            } else if (code == 3) {
                weather = "구름많음";
            } else if (code == 4) {
                weather = "흐림";
            } else {
                weather = "날씨 정보가 정확하지 않습니다";
            }
        } else {
            weather = "현재 날씨 정보를 가져올 수 없습니다.";
        }

    }
}
