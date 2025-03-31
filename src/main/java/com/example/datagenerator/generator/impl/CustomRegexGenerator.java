package com.example.datagenerator.generator.impl;

import com.example.datagenerator.generator.DataTypeGenerator;
import com.github.javafaker.Faker;
import org.springframework.stereotype.Component;

@Component // Register as a Spring bean
public class CustomRegexGenerator implements DataTypeGenerator {

    @Override
    public String getKey() {
        return "Custom.regex";
    }

    @Override
    public String generate(Faker faker, String options) {
        // Use the options string as a regex pattern
        if (options == null || options.isEmpty()) {
            throw new IllegalArgumentException("Options must contain a valid regex pattern.");
        }
        return faker.regexify(options);
    }

    @Override
    public String getName() {
        return "Custom Regex";
    }

    @Override
    public String getCategory() {
        return "Custom";
    }
}
