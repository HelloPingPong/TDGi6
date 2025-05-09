// src/components/GenerationSection/GenerationSection.jsx
import React, { useState } from 'react';
import GenerationControls from './GenerationControls';
import PreviewTable from './PreviewTable';
import { useAppContext } from '../../context/AppContext';
import './GenerationSection.css';

const GenerationSection = ({ schema }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { error } = useAppContext();

  return (
    <section className="generation-section">
      <h2>Generate Data</h2>
      
      <GenerationControls 
        schema={schema} 
        onGenerating={setIsGenerating} 
      />
      
      {isGenerating && (
        <div id="loadingIndicator" className="loading-indicator">
          Generating data...
        </div>
      )}
      
      {error && (
        <div id="errorDisplay" className="error-message">
          {error}
        </div>
      )}
      
      <h2>Preview (First 10 Rows from Backend)</h2>
      <PreviewTable schema={schema} />
    </section>
  );
};

export default GenerationSection;