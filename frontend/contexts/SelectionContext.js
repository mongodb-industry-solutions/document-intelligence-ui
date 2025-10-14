"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SelectionContext = createContext();

// Hook to use the selection context
export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

// Provider component
export const SelectionProvider = ({ children }) => {
  const [useCase, setUseCase] = useState(null);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedUseCase = localStorage.getItem('selectedUseCase');
    const savedSources = localStorage.getItem('selectedSources');
    
    if (savedUseCase) {
      setUseCase(savedUseCase);
    }
    
    if (savedSources) {
      try {
        setSources(JSON.parse(savedSources));
      } catch (error) {
        console.error('Error parsing saved sources:', error);
      }
    }
    
    // Mark loading as complete
    setIsLoading(false);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (useCase) {
      localStorage.setItem('selectedUseCase', useCase);
    }
  }, [useCase]);

  useEffect(() => {
    if (sources.length > 0) {
      localStorage.setItem('selectedSources', JSON.stringify(sources));
    }
  }, [sources]);

  // Clear selection
  const clearSelection = () => {
    setUseCase(null);
    setSources([]);
    localStorage.removeItem('selectedUseCase');
    localStorage.removeItem('selectedSources');
    localStorage.removeItem('di_session_id'); // Also clear chat session
  };

  // Check if selection is complete
  const isSelectionComplete = () => {
    return useCase && sources.length > 0;
  };

  const value = {
    useCase,
    setUseCase,
    sources,
    setSources,
    clearSelection,
    isSelectionComplete,
    isLoading,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};
