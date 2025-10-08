'use client';

import Card from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

const ImpactoChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Evolução de Horas de Voluntariado
        </h3>
        <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
      </Card>
    );
  }

  const maxHoras = Math.max(...data.map(d => d.horas));
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-green-600" />
        Evolução de Horas de Voluntariado
      </h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-600 flex-shrink-0">
              {meses[item.mes - 1]} {item.ano}
            </div>
            <div className="flex-grow">
              <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(item.horas / maxHoras) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {Math.round(item.horas)}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Total:</span>{' '}
          {Math.round(data.reduce((sum, d) => sum + d.horas, 0))} horas
        </div>
      </div>
    </Card>
  );
};

export default ImpactoChart;
