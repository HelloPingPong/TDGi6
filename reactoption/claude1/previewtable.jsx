// src/components/GenerationSection/PreviewTable.jsx
import React, { useState, useEffect } from 'react';
import { generatePreview } from '../../services/apiService';

const PreviewTable = ({ schema }) => {
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const PREVIEW_ROW_LIMIT = 10;

  useEffect(() => {
    if (schema?.fields && schema.fields.length > 0) {
      updatePreview();
    } else {
      setPreviewData([]);
    }
  }, [schema?.fields]);

  const updatePreview = async () => {
    if (!schema?.fields || schema.fields.length === 0) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const data = await generatePreview(schema.fields, PREVIEW_ROW_LIMIT);
      setPreviewData(data);
    } catch (error) {
      setError(`Preview failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div id="previewLoadingIndicator">Loading Preview...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!schema?.fields || schema.fields.length === 0 || previewData.length === 0) {
    return <p id="previewPlaceholder">Define schema to see preview.</p>;
  }

  return (
    <div className="preview-table-container">
      <table id="previewTable">
        <thead>
          <tr>
            {schema.fields.map((field, index) => (
              <th key={index}>{field.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {schema.fields.map((field, colIndex) => (
                <td key={colIndex} title={row[field.name]}>
                  {row[field.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewTable;