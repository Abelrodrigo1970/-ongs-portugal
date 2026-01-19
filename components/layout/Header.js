'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, Shield, Bell } from 'lucide-react';
import { useAdmin } from '@/lib/context/AdminContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [colaborador, setColaborador] = useState(null);
  const { isAuthenticated: isAdminAuthenticated } = useAdmin();

  useEffect(() => {
    const savedColaborador = localStorage.getItem('colaborador');
    if (savedColaborador) {
      try {
        setColaborador(JSON.parse(savedColaborador));
      } catch (error) {
        console.error('Error loading colaborador:', error);
      }
    }
  }, []);

  const dashboardHref = colaborador?.empresaId
    ? `/empresas/dashboard/${colaborador.empresaId}`
    : '/empresas/dashboard';

  const navigation = [
    { name: 'Eventos', href: '/eventos' },
    { name: 'ONGs', href: '/ongs' },
    { name: 'Dashboard', href: dashboardHref },
    { name: 'Sobre', href: '/sobre' },
  ];

  // Show admin link if authenticated as admin
  if (isAdminAuthenticated) {
    navigation.push({ name: 'Admin', href: '/admin/dashboard', icon: Shield });
  }

  return (
    <header className="w-full">
      <div
        className="w-full flex justify-center"
        style={{
          paddingTop: '32px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: 'linear-gradient(90deg, rgba(219, 234, 254, 1), rgba(191, 219, 254, 1))'
        }}
      >
        <div
          className="w-full flex items-center justify-between"
          style={{
            height: '72px',
            backgroundColor: '#f8fafc',
            borderRadius: '200px',
            padding: '12px',
            boxShadow: '0px 0px 50px #c9d6f8',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center" style={{ gap: '8px' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1c1b1f' }}>
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '28.75px',
                fontWeight: '900',
                color: '#1c1b1f',
                textTransform: 'uppercase',
                letterSpacing: '2.3px'
              }}
            >
              UNIVA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: '40px' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-gray-900 transition-colors duration-200"
                style={{
                  color: '#1e293b',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  textTransform: 'uppercase'
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center justify-end" style={{ gap: '16px', width: '176.8px' }}>
            <button
              type="button"
              className="flex items-center justify-center"
              style={{ width: '24px', height: '24px' }}
              aria-label="Notificações"
            >
              <Bell style={{ width: '20px', height: '20px', color: '#020617' }} />
            </button>
            <Link
              href="/colaborador/login"
              className="flex items-center justify-center"
              style={{ width: '48px', height: '48px' }}
              aria-label="Entrar"
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0' }}
              >
                <User style={{ width: '20px', height: '20px', color: '#020617' }} />
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-sm font-medium tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;