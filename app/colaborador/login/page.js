'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { useAdmin } from '@/lib/context/AdminContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: adminLogin, logout: adminLogout, isAuthenticated: isAdminAuthenticated } = useAdmin();
  const [activeTab, setActiveTab] = useState('voluntario'); // 'voluntario' ou 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data para voluntário
  const [voluntarioData, setVoluntarioData] = useState({
    nome: '',
    email: '',
  });

  // Form data para admin
  const [adminPassword, setAdminPassword] = useState('');

  const handleVoluntarioSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!voluntarioData.nome || !voluntarioData.email) {
        setError('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      if (isAdminAuthenticated) {
        adminLogout({ redirect: false });
      }

      // Buscar dados completos do colaborador (incluindo empresaId)
      try {
        const colaboradorResponse = await fetch(`/api/colaboradores/search?query=${encodeURIComponent(voluntarioData.email)}&limit=1`);
        const colaboradorApiData = await colaboradorResponse.json();
        
        let colaboradorData = {
          nome: voluntarioData.nome,
          email: voluntarioData.email,
          loginAt: new Date().toISOString()
        };

        // Se encontrar o colaborador na API, adicionar empresaId e empresaNome
        if (colaboradorApiData.success && colaboradorApiData.colaboradores && colaboradorApiData.colaboradores.length > 0) {
          const colaboradorEncontrado = colaboradorApiData.colaboradores[0];
          colaboradorData = {
            ...colaboradorData,
            empresaId: colaboradorEncontrado.empresaId,
            empresaNome: colaboradorEncontrado.empresa?.nome,
            id: colaboradorEncontrado.id
          };
        }

        localStorage.setItem('colaborador', JSON.stringify(colaboradorData));
        router.push('/voluntariado');
      } catch (apiError) {
        // Se der erro na API, ainda salva os dados básicos
        console.warn('Não foi possível buscar dados completos do colaborador:', apiError);
        const colaboradorData = {
          nome: voluntarioData.nome,
          email: voluntarioData.email,
          loginAt: new Date().toISOString()
        };
        localStorage.setItem('colaborador', JSON.stringify(colaboradorData));
        router.push('/voluntariado');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!adminPassword) {
        setError('Por favor, insira a senha');
        setLoading(false);
        return;
      }

      const result = await adminLogin(adminPassword);

      if (result.success) {
        localStorage.removeItem('colaborador');
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Senha incorreta');
      }
    } catch (error) {
      console.error('Erro no login de admin:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo
          </h1>
          <p className="text-gray-600">
            Entre para acessar a plataforma
          </p>
        </div>

        <Card className="p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('voluntario');
                setError('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                activeTab === 'voluntario'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Voluntário
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setError('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Admin
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Formulário Voluntário */}
          {activeTab === 'voluntario' && (
            <form onSubmit={handleVoluntarioSubmit} className="space-y-6">
              <Input
                label="Nome Completo"
                type="text"
                placeholder="João Silva"
                value={voluntarioData.nome}
                onChange={(e) => setVoluntarioData({ ...voluntarioData, nome: e.target.value })}
                required
                icon={User}
              />

              <Input
                label="Email"
                type="email"
                placeholder="joao.silva@exemplo.com"
                value={voluntarioData.email}
                onChange={(e) => setVoluntarioData({ ...voluntarioData, email: e.target.value })}
                required
                icon={Mail}
              />

              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900 mb-1">💡 Dica</p>
                <p>
                  Depois de entrar, poderá explorar ONGs e eventos, e inscrever-se em oportunidades de voluntariado.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Entrar como Voluntário
              </Button>
            </form>
          )}

          {/* Formulário Admin */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <Input
                label="Senha de Administrador"
                type="password"
                placeholder="Digite a senha de administrador"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                icon={Lock}
              />

              <div className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-medium text-amber-900 mb-1">🔒 Acesso Restrito</p>
                <p>
                  Esta área é exclusiva para administradores. Você terá acesso ao gerenciamento completo de ONGs e eventos.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Entrar como Administrador
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              É uma empresa?{' '}
              <a href="/empresas" className="text-primary-600 hover:text-primary-700 font-medium">
                Ver área de empresas
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
