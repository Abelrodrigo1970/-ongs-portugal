'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EventCard from '@/components/EventCard';
import { User, LogOut, Heart, Calendar, Search, Briefcase } from 'lucide-react';
import IniciativaCard from '@/components/IniciativaCard';

export default function VoluntariadoPage() {
  const router = useRouter();
  const [colaborador, setColaborador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [iniciativas, setIniciativas] = useState([]);

  useEffect(() => {
    // Verificar autenticação
    const savedColaborador = localStorage.getItem('colaborador');
    if (!savedColaborador) {
      router.push('/colaborador/login');
      return;
    }

    try {
      setColaborador(JSON.parse(savedColaborador));
    } catch (error) {
      console.error('Error loading colaborador:', error);
      router.push('/colaborador/login');
      return;
    }

    // Carregar eventos e iniciativas
    loadOportunidades();
  }, [router]);

  const loadOportunidades = async () => {
    try {
      // Buscar eventos
      const eventosRes = await fetch('/api/search/events');
      const eventosData = await eventosRes.json();
      setEventos(eventosData.data || []);

      // Buscar iniciativas
      const iniciativasRes = await fetch('/api/iniciativas');
      const iniciativasData = await iniciativasRes.json();
      setIniciativas(iniciativasData.data || []);
    } catch (error) {
      console.error('Error loading oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('colaborador');
    router.push('/');
  };

  if (loading || !colaborador) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Header do Voluntário */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Olá, {colaborador.nome}! 👋
                </h1>
                <p className="text-gray-600">{colaborador.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              icon={LogOut}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Seção de Descoberta */}
      <div className="container-custom py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/ongs">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Explorar ONGs</h3>
                  <p className="text-sm text-gray-600">Descubra causas</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/eventos">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ver Eventos</h3>
                  <p className="text-sm text-gray-600">Participe agora</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/empresas">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ver Empresas</h3>
                  <p className="text-sm text-gray-600">Iniciativas corporativas</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Eventos Disponíveis */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Eventos de Voluntariado
              </h2>
              <p className="text-gray-600 mt-1">
                Inscreva-se e participe em eventos próximos
              </p>
            </div>
            <Link href="/eventos">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          {eventos.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum evento disponível no momento</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.slice(0, 6).map((evento) => (
                <EventCard key={evento.id} event={evento} showInscricao={true} />
              ))}
            </div>
          )}
        </section>

        {/* Iniciativas Empresariais */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Iniciativas Empresariais
              </h2>
              <p className="text-gray-600 mt-1">
                Participe em projetos de impacto social
              </p>
            </div>
          </div>

          {iniciativas.length === 0 ? (
            <Card className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma iniciativa disponível no momento</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {iniciativas.slice(0, 6).map((iniciativa) => (
                <IniciativaCard key={iniciativa.id} iniciativa={iniciativa} showInscricao={true} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}