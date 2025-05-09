// src/context/AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchDataTypes } from '../services/apiService';

// Create context
const AppContext = createContext();

// Hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
    // State for dark mode
    const [darkMode, setDarkMode] = useState(false);
    
    // State for data types
    const [dataTypes, setDataTypes] = useState({});
    const [isLoadingDataTypes, setIsLoadingDataTypes] = useState(false);
    const [error, setError] = useState('');
    
    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
        if (newMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    // Fetch data types from API
    const loadDataTypes = async () => {
        setIsLoadingDataTypes(true);
        setError('');
        try {
            const types = await fetchDataTypes();
            // Group by category
            const groupedTypes = types.reduce((acc, type) => {
                const category = type.category || 'Other';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(type);
                return acc;
            }, {});
            setDataTypes(groupedTypes);
        } catch (err) {
            setError(`Failed to load data types: ${err.message}`);
        } finally {
            setIsLoadingDataTypes(false);
        }
    };

    // Initialize dark mode from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.body.classList.add('dark');
        }
    }, []);

    // Fetch data types on initial load
    useEffect(() => {
        loadDataTypes();
    }, []);

    const value = {
        darkMode,
        toggleDarkMode,
        dataTypes,
        isLoadingDataTypes,
        error,
        setError,
        reloadDataTypes: loadDataTypes
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};