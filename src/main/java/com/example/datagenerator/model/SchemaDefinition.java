package com.example.datagenerator.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class SchemaDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Optional name for saved schema

    @OneToMany(mappedBy = "schemaDefinition", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("fieldOrder ASC") // Maintain field order
    private List<FieldDefinition> fields = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    // Helper method to manage bidirectional relationship
    public void addField(FieldDefinition field) {
        fields.add(field);
        field.setSchemaDefinition(this);
    }

    public void removeField(FieldDefinition field) {
        fields.remove(field);
        field.setSchemaDefinition(null);
    }
}
