// src/components/SchemaSection/SchemaManagement.jsx
import React, { useState, useEffect } from 'react';
import { saveSchema, getAllSchemas, getSchema, deleteSchema } from '../../services/apiService';
import { useAppContext } from '../../context/AppContext';

const SchemaManagement = ({ 
  currentSchema, 
  onSchemaLoad, 
  isLoading, 
  setIsLoading 
}) => {
  const [schemaName, setSchemaName] = useState('');
  const [savedSchemas, setSavedSchemas] = useState([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [apiLink, setApiLink] = useState('');
  const { setError } = useAppContext();

  // Load saved schemas on component mount
  useEffect(() => {
    loadSchemaList();
    // If we have a current schema, update the name field
    if (currentSchema?.name) {
      setSchemaName(currentSchema.name);
      setSelectedSchemaId(currentSchema.id || '');
      if (currentSchema.shareLink) {
        displayShareLink(currentSchema.id, currentSchema.shareLink);
      }
    }
  }, [currentSchema]);

  const loadSchemaList = async () => {
    try {
      const schemas = await getAllSchemas();
      setSavedSchemas(schemas);
    } catch (error) {
      setError(`Failed to load schema list: ${error.message}`);
    }
  };

  const handleSaveSchema = async () => {
    if (!schemaName.trim()) {
      setError("Please enter a name to save the schema.");
      return;
    }
    
    const fields = currentSchema?.fields;
    if (!fields || fields.length === 0) {
      setError("Cannot save an empty schema.");
      return;
    }

    setIsLoading(true);
    try {
      const savedSchema = await saveSchema(schemaName, fields);
      alert(`Schema "${savedSchema.name}" saved successfully (ID: ${savedSchema.id})!`);
      await loadSchemaList();
      setSelectedSchemaId(savedSchema.id);
      displayShareLink(savedSchema.id, savedSchema.shareLink);
      
      // Update the current schema with the saved ID
      onSchemaLoad({
        ...currentSchema,
        id: savedSchema.id,
        name: savedSchema.name,
        shareLink: savedSchema.shareLink
      });
    } catch (error) {
      setError(`Failed to save schema: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSchema = async () => {
    if (!selectedSchemaId) {
      setError("Please select a schema to load.");
      return;
    }

    setIsLoading(true);
    try {
      const loadedSchema = await getSchema(selectedSchemaId);
      onSchemaLoad({
        id: loadedSchema.id,
        name: loadedSchema.name,
        fields: loadedSchema.fields,
        shareLink: loadedSchema.shareLink
      });
      setSchemaName(loadedSchema.name);
      displayShareLink(loadedSchema.id, loadedSchema.shareLink);
      alert(`Schema "${loadedSchema.name}" loaded.`);
    } catch (error) {
      setError(`Failed to load schema: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchema = async () => {
    if (!selectedSchemaId) {
      setError("Please select a schema to delete.");
      return;
    }

    const schemaToDelete = savedSchemas.find(s => s.id.toString() === selectedSchemaId);
    const schemaName = schemaToDelete ? schemaToDelete.name : `Schema ID ${selectedSchemaId}`;

    if (!window.confirm(`Are you sure you want to delete schema "${schemaName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteSchema(selectedSchemaId);
      alert(`Schema "${schemaName}" deleted successfully.`);
      await loadSchemaList();
      setSelectedSchemaId('');
      
      // If we just deleted the currently loaded schema, clear it
      if (currentSchema?.id?.toString() === selectedSchemaId) {
        setSchemaName('');
        setShareLink('');
        setApiLink('');
        onSchemaLoad({});
      }
    } catch (error) {
      setError(`Failed to delete schema: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const displayShareLink = (schemaId, apiLinkUrl) => {
    if (!schemaId) {
      setShareLink('');
      setApiLink('');
      return;
    }
    
    const shareUrl = `${window.location.origin}${window.location.pathname}#load=${schemaId}`;
    setShareLink(shareUrl);
    setApiLink(apiLinkUrl || 'N/A');
  };

  return (
    <div className="schema-management">
      <h3>Manage Schemas (Saved in Backend)</h3>
      
      <label htmlFor="schemaName">Schema Name:</label>
      <input 
        type="text" 
        id="schemaName" 
        placeholder="Schema Name (for saving)"
        value={schemaName}
        onChange={(e) => setSchemaName(e.target.value)}
        disabled={isLoading}
      />
      
      <button 
        id="saveSchemaBtn" 
        onClick={handleSaveSchema}
        disabled={isLoading}
      >
        Save Schema
      </button>
      
      <label htmlFor="loadSchemaSelect">Schema:</label>
      <select 
        id="loadSchemaSelect"
        value={selectedSchemaId}
        onChange={(e) => setSelectedSchemaId(e.target.value)}
        disabled={isLoading}
      >
        <option value="">-- Load Saved Schema --</option>
        {savedSchemas.map(schema => (
          <option key={schema.id} value={schema.id}>
            {schema.name || `Schema ${schema.id}`}
          </option>
        ))}
      </select>
      
      <button 
        id="loadSchemaBtn" 
        onClick={handleLoadSchema}
        disabled={isLoading}
      >
        Load
      </button>
      
      <button 
        id="deleteSchemaBtn" 
        onClick={handleDeleteSchema}
        disabled={isLoading}
      >
        Delete
      </button>
      
      {(shareLink && apiLink) && (
        <p id="shareLinkDisplay" className="share-info">
          Shareable Frontend Link (Copy URL): 
          <a href={shareLink} id="shareLinkAnchor" target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a><br />
          API Link: <span id="apiLinkSpan">{apiLink}</span>
        </p>
      )}
    </div>
  );
};

export default SchemaManagement;