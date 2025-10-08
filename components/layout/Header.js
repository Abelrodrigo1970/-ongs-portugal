'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import Button from '@/components/ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [colaborador, setColaborador] = useState(null);

  useEffect(() => {
    // Check for colaborador authentication
    const savedColaborador = localStorage.getItem('colaborador');
    if (savedColaborador) {
      try {
        setColaborador(JSON.parse(savedColaborador));
      } catch (error) {
        console.error('Error loading colaborador:', error);
      }
    }
  }, []);

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'ONGs', href: '/ongs' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Empresas', href: '/empresas' },
    { name: 'ODS', href: '/ods' },
  ];

  // Show admin link only in development
  if (process.env.NODE_ENV !== 'production') {
    navigation.push({ name: 'Admin', href: '/admin' });
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ONGs Portugal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Colaborador Button/Profile */}
            {colaborador ? (
              <Link href="/voluntariado">
                <Button variant="primary" size="sm" icon={User}>
                  {colaborador.nome.split(' ')[0]}
                </Button>
              </Link>
            ) : (
              <Link href="/colaborador/login">
                <Button variant="primary" size="sm" icon={User}>
                  Voluntário
                </Button>
              </Link>
            )}
          </nav>

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
              
              {/* Mobile Colaborador Button */}
              <div className="px-3 py-2">
                {colaborador ? (
                  <Link href="/voluntariado" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="sm" icon={User} className="w-full">
                      {colaborador.nome.split(' ')[0]}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/colaborador/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="sm" icon={User} className="w-full">
                      Entrar como Voluntário
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;