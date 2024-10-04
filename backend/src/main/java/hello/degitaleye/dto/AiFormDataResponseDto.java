package hello.degitaleye.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

// TODO 임시 dto -> 규칙 정해야함
@Getter
@NoArgsConstructor
public class AiFormDataResponseDto {
    private String text;
    private String image;

    public AiFormDataResponseDto(String translateText, String imageName) {
        this.text = translateText;
        this.image = imageName;
    }
}
