package com.example.datagenerator.generator.impl;

import com.example.datagenerator.generator.DataTypeGenerator;
import com.github.javafaker.Faker;
import org.springframework.stereotype.Component;

@Component // Register as a Spring bean
public class CustomBothifyGenerator implements DataTypeGenerator {

    @Override
    public String getKey() {
        return "Custom.bothify";
    }

    @Override
    public String generate(Faker faker, String options) {
        // Use the options string as a pattern for bothify
        if (options == null || options.isEmpty()) {
            throw new IllegalArgumentException("Options must contain a valid bothify pattern.");
        }
        return faker.bothify(options);
    }

    @Override
    public String getName() {
        return "Custom Data Type";
    }

    @Override
    public String getCategory() {
        return "Custom";
    }
}
