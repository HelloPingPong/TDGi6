package com.example.datagenerator.repository;

import com.example.datagenerator.model.SchemaDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemaDefinitionRepository extends JpaRepository<SchemaDefinition, Long> {
}
