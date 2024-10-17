package hello.degitaleye.temp;

import lombok.Getter;
import lombok.NoArgsConstructor;


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
