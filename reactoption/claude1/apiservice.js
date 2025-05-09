// src/services/apiService.js

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Generic fetch wrapper for API calls
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const mergedOptions = { ...defaultOptions, ...options };

    // Stringify body if it's an object
    if (mergedOptions.body && typeof mergedOptions.body === 'object') {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    try {
        const response = await fetch(url, mergedOptions);

        // Handle non-JSON responses for file download
        const contentType = response.headers.get('content-type');
        if (options.expectBlob || (contentType && !contentType.includes('application/json') && response.ok && options.method?.toUpperCase() !== 'DELETE')) {
            if (!response.ok) {
                let errorText = `HTTP error ${response.status}`;
                try { errorText = await response.text(); } catch(e){} 
                throw new Error(errorText || `HTTP error ${response.status}`);
            }
            const blob = await response.blob();
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'downloaded_file';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = filenameMatch[1];
                }
            }
            return { blob, filename }; // Return blob and filename for downloads
        }

        // Handle potential empty body for 204 No Content (like DELETE)
        if (response.status === 204) {
            return null;
        }

        // For JSON responses
        const data = await response.json();
        if (!response.ok) {
            const errorMessage = data?.message || data?.error || `HTTP error ${response.status}`;
            throw new Error(errorMessage);
        }
        return data;

    } catch (error) {
        console.error(`API Fetch Error (${options.method || 'GET'} ${endpoint}):`, error);
        throw error;
    }
}

// API Functions
export const fetchDataTypes = () => apiFetch('/datatypes');

export const generatePreview = (schema, rowCount = 10) => 
    apiFetch('/generate/preview', {
        method: 'POST',
        body: { schema, rowCount }
    });

export const generateData = (schema, rowCount, format, tableName) => 
    apiFetch('/generate', {
        method: 'POST',
        body: { schema, rowCount, format, tableName },
        expectBlob: true
    });

export const saveSchema = (name, fields) => 
    apiFetch('/schemas', {
        method: 'POST',
        body: { name, fields }
    });

export const getAllSchemas = () => apiFetch('/schemas');

export const getSchema = (id) => apiFetch(`/schemas/${id}`);

export const deleteSchema = (id) => 
    apiFetch(`/schemas/${id}`, {
        method: 'DELETE'
    });

// Helper function to trigger download from blob
export const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};