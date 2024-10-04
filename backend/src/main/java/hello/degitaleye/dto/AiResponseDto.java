package hello.degitaleye.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiResponseDto {
    private String message;

    public AiResponseDto(String message) {
        this.message = message;
    }
}
