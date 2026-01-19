'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, User, Shield, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/context/AdminContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [colaborador, setColaborador] = useState(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [empresasLoading, setEmpresasLoading] = useState(false);
  const [empresasError, setEmpresasError] = useState('');
  const { isAuthenticated: isAdminAuthenticated } = useAdmin();
  const router = useRouter();
  const dashboardRef = useRef(null);

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

  useEffect(() => {
    if (!isDashboardOpen || empresas.length > 0 || empresasLoading) return;
    const loadEmpresas = async () => {
      setEmpresasLoading(true);
      setEmpresasError('');
      try {
        const response = await fetch('/api/empresas?limit=50');
        const data = await response.json();
        setEmpresas(Array.isArray(data?.empresas) ? data.empresas : []);
      } catch (error) {
        console.error('Error loading empresas:', error);
        setEmpresasError('Não foi possível carregar empresas');
      } finally {
        setEmpresasLoading(false);
      }
    };
    loadEmpresas();
  }, [isDashboardOpen, empresas.length, empresasLoading]);

  useEffect(() => {
    if (!isDashboardOpen) return;
    const handleClickOutside = (event) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {
        setIsDashboardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDashboardOpen]);

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
          background: 'linear-gradient(90deg, rgb(192, 216, 247), rgb(188, 215, 249))'
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
            {navigation.map((item) => {
              if (item.name === 'Dashboard') {
                return (
                  <div key={item.name} className="relative" ref={dashboardRef}>
                    <button
                      type="button"
                      onClick={() => setIsDashboardOpen((open) => !open)}
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
                    </button>
                    {isDashboardOpen && (
                      <div
                        className="absolute top-full left-0 mt-2"
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(64, 64, 64, 0.15)',
                          borderRadius: '16px',
                          padding: '8px',
                          minWidth: '240px',
                          maxHeight: '280px',
                          overflowY: 'auto',
                          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
                          zIndex: 1000
                        }}
                      >
                        {empresasLoading && (
                          <div style={{ padding: '8px 12px', color: '#64748b', fontSize: '14px' }}>
                            A carregar...
                          </div>
                        )}
                        {!empresasLoading && empresasError && (
                          <div style={{ padding: '8px 12px', color: '#ef4444', fontSize: '14px' }}>
                            {empresasError}
                          </div>
                        )}
                        {!empresasLoading && !empresasError && empresas.length === 0 && (
                          <div style={{ padding: '8px 12px', color: '#64748b', fontSize: '14px' }}>
                            Sem empresas disponíveis
                          </div>
                        )}
                        {!empresasLoading && !empresasError && empresas.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {empresas.map((empresa) => (
                              <button
                                key={empresa.id}
                                type="button"
                                onClick={() => {
                                  setIsDashboardOpen(false);
                                  router.push(`/empresas/dashboard/${empresa.id}`);
                                }}
                                style={{
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontFamily: 'Inter, sans-serif',
                                  color: '#1e293b',
                                  background: empresa.id === colaborador?.empresaId ? 'rgba(21, 93, 252, 0.08)' : 'transparent',
                                  cursor: 'pointer',
                                  border: 'none'
                                }}
                              >
                                {empresa.nome}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
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