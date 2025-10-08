'use client';

import Card from '@/components/ui/Card';
import { PieChart } from 'lucide-react';

const VoluntariadoChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-600" />
          Distribuição por Tipo de Apoio
        </h3>
        <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);
  const colors = [
    { bg: 'bg-green-500', text: 'text-green-700' },
    { bg: 'bg-blue-500', text: 'text-blue-700' },
    { bg: 'bg-purple-500', text: 'text-purple-700' },
    { bg: 'bg-yellow-500', text: 'text-yellow-700' }
  ];

  const formatTipo = (tipo) => {
    const tipos = {
      'TEMPO_VOLUNTARIADO': 'Tempo/Voluntariado',
      'CONHECIMENTO_CAPACITACAO': 'Conhecimento/Capacitação',
      'RECURSOS_SERVICOS': 'Recursos/Serviços',
      'PRODUTOS_BENS': 'Produtos/Bens'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <PieChart className="h-5 w-5 text-purple-600" />
        Distribuição por Tipo de Apoio
      </h3>
      
      {/* Donut Chart Simplificado */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {data.map((item, index) => {
            const percentage = (item.total / total) * 100;
            return (
              <div
                key={index}
                className={`absolute inset-0 rounded-full ${colors[index % colors.length].bg} opacity-${80 - (index * 15)}`}
                style={{
                  width: `${100 - (index * 20)}%`,
                  height: `${100 - (index * 20)}%`,
                  top: `${index * 10}%`,
                  left: `${index * 10}%`
                }}
              />
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.total / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length].bg}`} />
                <span className="text-sm text-gray-700">{formatTipo(item.tipo)}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-900">{item.total}</span>
                <span className="text-gray-500 ml-1">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default VoluntariadoChart;
