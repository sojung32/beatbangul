package com.melody.beatbangul.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi beatbangulGroupedOpenApi() {
        return GroupedOpenApi.builder()
                .group("beatbangul")
                .pathsToMatch("/**")
                .build();
    }

    @Bean
    public OpenAPI beatbangulOpenApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info().title("빗방울 API 명세서")
                        .description("비투비 스케줄 모음 빗방울의 API 명세서입니다.")
                        .version("v2.0"));
    }
}
