package com.example.datagenerator.generator;

import com.github.javafaker.Faker;

public interface DataTypeGenerator {
    /**
     * Key used to identify this generator (e.g., "Name.firstName").
     * Must be unique.
     */
    String getKey();

    /**
     * Generates a fake data value.
     * @param faker The Faker instance.
     * @param options Optional configuration for the generator (e.g., date format, regex pattern).
     * @return The generated fake data as a String.
     */
    String generate(Faker faker, String options);

    /**
     * User-friendly name (e.g., "First Name").
     */
    String getName();

     /**
      * Category for grouping (e.g., "Name", "Address").
      */
    String getCategory();
}
