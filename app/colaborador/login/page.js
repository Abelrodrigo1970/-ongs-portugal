'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { User, Mail, Building2 } from 'lucide-react';

export default function ColaboradorLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresaId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação simples
      if (!formData.nome || !formData.email) {
        alert('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      // Salvar colaborador no localStorage (autenticação simples)
      const colaboradorData = {
        nome: formData.nome,
        email: formData.email,
        empresaId: formData.empresaId || null,
        loginAt: new Date().toISOString()
      };

      localStorage.setItem('colaborador', JSON.stringify(colaboradorData));
      
      // Redirecionar para página de voluntariado
      router.push('/voluntariado');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login. Tente novamente.');
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
            Área do Voluntário
          </h1>
          <p className="text-gray-600">
            Entre para descobrir oportunidades de voluntariado
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nome Completo"
              type="text"
              placeholder="João Silva"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              icon={User}
            />

            <Input
              label="Email"
              type="email"
              placeholder="joao.silva@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
