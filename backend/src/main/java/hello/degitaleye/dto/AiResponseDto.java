package hello.degitaleye.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Flask Server 에서 받은 응답을 담는 Dto
 */
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiResponseDto {
    private String message;

    public AiResponseDto(String message) {
        this.message = message;
    }
}
