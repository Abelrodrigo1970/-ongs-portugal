'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ColaboradorContext = createContext();

export function ColaboradorProvider({ children }) {
  const [colaborador, setColaborador] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar colaborador do localStorage
    const savedColaborador = localStorage.getItem('colaborador');
    if (savedColaborador) {
      try {
        setColaborador(JSON.parse(savedColaborador));
      } catch (error) {
        console.error('Error loading colaborador:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (colaboradorData) => {
    setColaborador(colaboradorData);
    localStorage.setItem('colaborador', JSON.stringify(colaboradorData));
  };

  const logout = () => {
    setColaborador(null);
    localStorage.removeItem('colaborador');
  };

  const updateColaborador = (data) => {
    const updated = { ...colaborador, ...data };
    setColaborador(updated);
    localStorage.setItem('colaborador', JSON.stringify(updated));
  };

  return (
    <ColaboradorContext.Provider
      value={{
        colaborador,
        isLoading,
        isAuthenticated: !!colaborador,
        login,
        logout,
        updateColaborador
      }}
    >
      {children}
    </ColaboradorContext.Provider>
  );
}

export function useColaborador() {
  const context = useContext(ColaboradorContext);
  if (!context) {
    throw new Error('useColaborador must be used within ColaboradorProvider');
  }
  return context;
}
