package com.example.datagenerator.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.context.annotation.Bean;
//TODO: need to import a browserhistoryindexresolver from spring boot to resolve line 40.
//implements org.springframework.web.servlet.resource.ResourceResolver

@Configuration
public class ApplicationConfiguration {

    /**
     * Redirects every page to index.html
     */

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public CsvMapper csvMapper() {
        return new CsvMapper();
    }

    @Bean
    public XmlMapper xmlMapper() {
        return new XmlMapper();
    }

    @Configuration
    public static class BrowserHistoryConfigurer implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(final ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/**").addResourceLocations("classpath:/static/").setCachePeriod(3600)
                    .resourceChain(true).addResolver(BrowserHistoryIndexResolver.builder().build());
        }

    }
}
