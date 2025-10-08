'use client';

import { Clock, Users, Briefcase, FileText, Calendar, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';

const KPICards = ({ kpis }) => {
  const kpiData = [
    {
      title: 'Horas de Voluntariado',
      value: Math.round(kpis.totalHoras || 0),
      unit: 'horas',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Iniciativas Ativas',
      value: kpis.iniciativasAtivas || 0,
      total: kpis.totalIniciativas || 0,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Voluntários',
      value: kpis.totalVoluntarios || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Propostas Pendentes',
      value: kpis.propostasPendentes || 0,
      total: kpis.totalPropostas || 0,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Reuniões Agendadas',
      value: kpis.reunioesFuturas || 0,
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Projetos Realizados',
      value: kpis.totalProjetos || 0,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {kpi.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {kpi.value}
                    {kpi.unit && <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>}
                  </p>
                  {kpi.total !== undefined && (
                    <p className="text-sm text-gray-500">
                      / {kpi.total}
                    </p>
                  )}
                </div>
              </div>
              <div className={`${kpi.bgColor} ${kpi.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default KPICards;
