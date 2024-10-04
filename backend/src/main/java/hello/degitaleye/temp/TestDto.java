package hello.degitaleye.temp;

import lombok.Getter;

@Getter
public class TestDto {
    private String text;

    public TestDto(String text) {
        this.text = text;
    }
}
