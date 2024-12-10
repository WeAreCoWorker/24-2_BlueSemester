package hello.degitaleye.dto.weather;// ItemsResponse.java
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Getter
@NoArgsConstructor
@ToString
public class ItemsResponseDto {
    @JsonProperty("item")
    private List<ItemDto> items;

    // Getters and setters
}
