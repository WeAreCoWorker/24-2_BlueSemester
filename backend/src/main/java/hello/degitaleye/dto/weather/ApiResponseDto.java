package hello.degitaleye.dto.weather;// ApiResponse.java
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class ApiResponseDto {
    @JsonProperty("response")
    private Response response;

    @Getter
    public static class Response {
        @JsonProperty("body")
        private Body body;

    }

    @Getter
    public static class Body {
        @JsonProperty("items")
        private ItemsResponseDto itemsResponse;

    }

    // Getters and Setters


}
