// src/components/SchemaSection/SchemaField.jsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';

const SchemaField = ({ 
  field, 
  onChange, 
  onRemove, 
  index 
}) => {
  const { dataTypes, isLoadingDataTypes } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...field, [name]: value });
  };

  return (
    <div className="schema-field-row">
      <input
        type="text"
        name="name"
        placeholder="Field Name"
        className="field-input field-name"
        value={field.name || ''}
        onChange={handleChange}
      />
      
      <select
        name="dataType"
        className="field-input field-type"
        value={field.dataType || ''}
        onChange={handleChange}
        disabled={isLoadingDataTypes}
      >
        {isLoadingDataTypes ? (
          <option value="">-- Loading Types... --</option>
        ) : Object.keys(dataTypes).length === 0 ? (
          <option value="">-- Error Loading Types --</option>
        ) : (
          <>
            <option value="">-- Select Type --</option>
            {Object.keys(dataTypes).sort().map(category => (
              <optgroup key={category} label={category}>
                {dataTypes[category]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(type => (
                    <option key={type.key} value={type.key}>
                      {type.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </>
        )}
      </select>
      
      <input
        type="text"
        name="options"
        placeholder="Options (optional)"
        className="field-input field-options"
        title="e.g., date format, regex, JSON for min/max"
        value={field.options || ''}
        onChange={handleChange}
      />
      
      <button 
        className="remove-field-btn" 
        title="Remove Field"
        onClick={() => onRemove(index)}
      >
        ×
      </button>
    </div>
  );
};

export default SchemaField;