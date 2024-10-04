package hello.degitaleye.controller;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockPart;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.io.File;
import java.io.FileInputStream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

@AutoConfigureMockMvc
@SpringBootTest
class MockFlaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void aiFormTest() throws Exception {
        //given
        final String fileName = "test_image";
        final String type = "PNG";
        final String contentType = "image/png";
        final String filePath = "/home/kando/workspace/spring-test-image/";

        FileInputStream fileInputStream = new FileInputStream(new File(filePath + fileName + "." + type));

        MockMultipartFile image = new MockMultipartFile("image",
                fileName + "." + type,
                contentType,
                fileInputStream);
        //when, then

        mockMvc.perform(multipart("/ai-form")
                .file(image)
                .part(new MockPart("text", "안녕하세요".getBytes()))
                .contentType(MediaType.MULTIPART_FORM_DATA)
        ).andExpect(MockMvcResultMatchers.status().isOk());


    }

}