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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${kpi.bgColor} ${kpi.color} p-2.5 rounded-lg`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1.5">
                {kpi.title}
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-gray-900">
                  {kpi.value}
                </p>
                {kpi.unit && (
                  <span className="text-xs text-gray-500 font-medium">{kpi.unit}</span>
                )}
                {kpi.total !== undefined && (
                  <span className="text-xs text-gray-400">
                    / {kpi.total}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
