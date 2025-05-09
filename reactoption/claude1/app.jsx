// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SchemaSection from './components/SchemaSection/SchemaSection';
import GenerationSection from './components/GenerationSection/GenerationSection';
import Footer from './components/Footer/Footer';
import { AppProvider } from './context/AppContext';
import { getSchema } from './services/apiService';
import './App.css';

function App() {
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load schema from URL hash on component mount
  useEffect(() => {
    const loadSchemaFromUrl = async () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#load=')) {
        const schemaId = hash.substring(6); // Get ID after #load=
        if (schemaId && /^\d+$/.test(schemaId)) { // Check if it's a number
          setLoading(true);
          try {
            const loadedSchema = await getSchema(schemaId);
            setSchema({
              id: loadedSchema.id,
              name: loadedSchema.name,
              fields: loadedSchema.fields,
              shareLink: loadedSchema.shareLink
            });
            alert(`Schema "${loadedSchema.name}" (ID: ${schemaId}) loaded from URL!`);
          } catch (error) {
            console.error(`Failed to load schema ${schemaId} from URL:`, error);
            // Could set an error state here
          } finally {
            setLoading(false);
          }
        }
      }
    };

    loadSchemaFromUrl();
  }, []);

  return (
    <AppProvider>
      <div className="app">
        <Header />
        <main className="app-main">
          <SchemaSection 
            initialSchema={schema} 
            loading={loading}
            onSchemaChange={setSchema}
          />
          <GenerationSection 
            schema={schema}
          />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;