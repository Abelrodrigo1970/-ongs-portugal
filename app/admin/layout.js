'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/context/AdminContext';
import { Shield, LogOut, Home } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAdmin();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/colaborador/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Painel de Administração
                </h1>
                <p className="text-sm text-gray-600">
                  Gestão de ONGs e Eventos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" icon={Home}>
                  Ver Site
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                icon={LogOut}
                onClick={logout}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {children}
      </div>
    </div>
  );
}

