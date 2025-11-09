'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Carregar admin do localStorage
    const savedAdmin = localStorage.getItem('adminAuth');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        // Verificar se o token não expirou
        if (adminData.expiresAt && new Date(adminData.expiresAt) > new Date()) {
          setAdmin(adminData);
        } else {
          // Token expirado, remover
          localStorage.removeItem('adminAuth');
        }
      } catch (error) {
        console.error('Error loading admin:', error);
        localStorage.removeItem('adminAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Calcular data de expiração (24h)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const adminData = {
        token: data.token,
        loginAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      setAdmin(adminData);
      localStorage.setItem('adminAuth', JSON.stringify(adminData));

      return { success: true };
    } catch (error) {
      console.error('Erro no login de admin:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminAuth');
    router.push('/colaborador/login');
  };

  const isAuthenticated = () => {
    if (!admin || !admin.token || !admin.expiresAt) {
      return false;
    }
    // Verificar se token não expirou
    return new Date(admin.expiresAt) > new Date();
  };

  const getAuthHeaders = () => {
    if (!admin || !admin.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${admin.token}`,
    };
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: isAuthenticated(),
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

