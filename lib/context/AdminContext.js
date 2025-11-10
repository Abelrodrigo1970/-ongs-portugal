'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminAuth');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        if (adminData.expiresAt && new Date(adminData.expiresAt) > new Date()) {
          setAdmin(adminData);
        } else {
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const adminData = {
        token: data.token,
        loginAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      };

      setAdmin(adminData);
      localStorage.setItem('adminAuth', JSON.stringify(adminData));
      localStorage.removeItem('colaborador');

      return { success: true };
    } catch (error) {
      console.error('Erro no login de admin:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = (options = {}) => {
    const { redirect = true } = options;
    setAdmin(null);
    localStorage.removeItem('adminAuth');
    if (redirect) {
      router.push('/colaborador/login');
    }
  };

  const isAuthenticated = useMemo(() => {
    if (!admin || !admin.token || !admin.expiresAt) {
      return false;
    }
    return new Date(admin.expiresAt) > new Date();
  }, [admin]);

  const getAuthHeaders = () => {
    if (!isAuthenticated || !admin?.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${admin.token}`
    };
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated,
        login,
        logout,
        getAuthHeaders
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

