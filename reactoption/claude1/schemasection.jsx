// src/components/SchemaSection/SchemaSection.jsx
import React, { useState, useEffect } from 'react';
import SchemaField from './SchemaField';
import SchemaManagement from './SchemaManagement';
import { useAppContext } from '../../context/AppContext';
import './SchemaSection.css';

const SchemaSection = ({ initialSchema, loading, onSchemaChange }) => {
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(loading);
  const { error, setError } = useAppContext();

  // Initialize fields when initialSchema changes
  useEffect(() => {
    if (initialSchema && initialSchema.fields && initialSchema.fields.length > 0) {
      setFields(initialSchema.fields);
    } else if (fields.length === 0) {
      // Set some default fields if we don't have any
      setFields([
        { name: 'id', dataType: 'string.uuid', options: '' },
        { name: 'name', dataType: 'person.fullName', options: '' },
        { name: 'email', dataType: 'internet.email', options: '' }
      ]);
    }
  }, [initialSchema]);

  // Update parent component when fields change
  useEffect(() => {
    onSchemaChange({
      ...initialSchema,
      fields: fields
    });
  }, [fields]);

  const handleAddField = () => {
    setFields([...fields, { name: '', dataType: '', options: '' }]);
  };

  const handleFieldChange = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSchemaLoad = (loadedSchema) => {
    // Only update fields if we have fields to update with
    if (loadedSchema.fields) {
      setFields(loadedSchema.fields);
    }
    onSchemaChange(loadedSchema);
  };

  return (
    <section className="schema-section">
      <h2>Schema Definition</h2>
      
      <div id="schemaFieldsContainer">
        {fields.map((field, index) => (
          <SchemaField
            key={index}
            field={field}
            index={index}
            onChange={handleFieldChange}
            onRemove={handleRemoveField}
          />
        ))}
      </div>
      
      <button 
        id="addFieldBtn" 
        className="add-field-btn"
        onClick={handleAddField}
      >
        + Add Field
      </button>

      <SchemaManagement
        currentSchema={{ ...initialSchema, fields }}
        onSchemaLoad={handleSchemaLoad}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="loading-indicator">
          Contacting Backend...
        </div>
      )}
    </section>
  );
};

export default SchemaSection;