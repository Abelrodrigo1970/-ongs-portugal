'use client';

import Card from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

const ProjetosChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Projetos por Causa
        </h3>
        <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
      </Card>
    );
  }

  const maxTotal = Math.max(...data.map(d => d.total));
  const colors = ['bg-purple-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-pink-600'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        Projetos por Causa
      </h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.causa}</span>
              <span className="text-sm font-bold text-gray-900">{item.total}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`${colors[index % colors.length]} h-full rounded-full transition-all duration-500`}
                style={{ width: `${(item.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Total:</span>{' '}
          {data.reduce((sum, d) => sum + d.total, 0)} projetos
        </div>
      </div>
    </Card>
  );
};

export default ProjetosChart;
