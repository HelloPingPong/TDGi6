package com.example.datagenerator.dto;

import lombok.Data;
import java.util.List;

// DTO for sending schema data back to the client
@Data
public class SchemaDefinitionDto {
    private Long id;
    private String name;
    private List<FieldDefinitionDto> fields; // Using DTO here too
    private String shareLink; // For the bonus feature
}
