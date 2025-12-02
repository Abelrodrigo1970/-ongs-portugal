'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Building2, Calendar, BarChart3, Users, ArrowRight, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const { getAuthHeaders } = useAdmin();
  const [stats, setStats] = useState({
    ngos: 0,
    events: 0,
    loading: true,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const headers = getAuthHeaders();

      const [ngosRes, eventsRes] = await Promise.all([
        fetch('/api/admin/ngos?limit=1', { headers }),
        fetch('/api/admin/events?limit=1', { headers }),
      ]);

      const ngosData = await ngosRes.json();
      const eventsData = await eventsRes.json();

      setStats({
        ngos: ngosData.pagination?.total || 0,
        events: eventsData.pagination?.total || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({ ngos: 0, events: 0, loading: false });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600">
          Visão geral da plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total de ONGs
              </p>
              {stats.loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats.ngos}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total de Eventos
              </p>
              {stats.loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats.events}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/ngos">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Gerir ONGs
                  </h4>
                  <p className="text-sm text-gray-600">
                    Criar, editar e gerir organizações
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/events">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Gerir Eventos
                  </h4>
                  <p className="text-sm text-gray-600">
                    Criar, editar e gerir eventos
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </Link>

          <Link href="/admin/areas">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Gerir Áreas de Atuação
                  </h4>
                  <p className="text-sm text-gray-600">
                    Criar, editar e gerir áreas de atuação
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Info */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Bem-vindo ao Painel de Administração
            </h4>
            <p className="text-sm text-blue-800">
              Aqui você pode gerenciar todas as ONGs e eventos da plataforma. Use os cartões acima para acessar as diferentes áreas de gestão.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

