// src/components/GenerationSection/GenerationControls.jsx
import React, { useState } from 'react';
import { generateData, triggerDownload } from '../../services/apiService';
import { useAppContext } from '../../context/AppContext';

const GenerationControls = ({ schema, onGenerating }) => {
  const [rowCount, setRowCount] = useState(100);
  const [format, setFormat] = useState('CSV');
  const [tableName, setTableName] = useState('my_table');
  const { setError } = useAppContext();

  const handleGenerateAndDownload = async () => {
    // Skip if we have no fields
    if (!schema.fields || schema.fields.length === 0) {
      setError("Schema is empty. Please add fields.");
      return;
    }

    // Validate row count
    if (isNaN(rowCount) || rowCount <= 0) {
      setError("Please enter a valid number of rows (greater than 0).");
      return;
    }

    // Validate SQL table name
    if (format.toUpperCase() === 'SQL' && !tableName.trim()) {
      setError("Please enter a table name for SQL format.");
      return;
    }

    onGenerating(true);
    try {
      const { blob, filename } = await generateData(
        schema.fields,
        rowCount,
        format,
        format.toUpperCase() === 'SQL' ? tableName : null
      );

      triggerDownload(blob, filename);
    } catch (error) {
      setError(`Generation failed: ${error.message}`);
    } finally {
      onGenerating(false);
    }
  };

  return (
    <div className="generation-controls">
      <label htmlFor="rowCount">Rows:</label>
      <input
        type="number"
        id="rowCount"
        value={rowCount}
        min="1"
        max="100000"
        onChange={(e) => setRowCount(parseInt(e.target.value, 10))}
      />

      <label htmlFor="formatSelect">Format:</label>
      <select
        id="formatSelect"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      >
        <option value="CSV">CSV</option>
        <option value="JSON">JSON</option>
        <option value="SQL">SQL</option>
        <option value="XML">XML</option>
        <option value="PLAINTEXT">PlainText</option>
      </select>

      {format.toUpperCase() === 'SQL' && (
        <div id="sqlOptions">
          <label htmlFor="sqlTableName">Table Name:</label>
          <input
            type="text"
            id="sqlTableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </div>
      )}

      <button
        id="generateBtn"
        className="generate-btn"
        onClick={handleGenerateAndDownload}
      >
        Generate & Download
      </button>
    </div>
  );
};

export default GenerationControls;