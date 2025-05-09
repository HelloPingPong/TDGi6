// src/components/Header/Header.jsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  
  return (
    <header className="app-header">
      <h1>Test Data Generator (Spring Boot + React)</h1>
      <button 
        id="darkModeToggle" 
        title="Toggle Dark Mode"
        onClick={toggleDarkMode}
      >
        {darkMode ? '🌞' : '🌓'}
      </button>
    </header>
  );
};

export default Header;