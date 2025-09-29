'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Edit, Plus, Trash2 } from 'lucide-react';

const SimpleAreasAdmin = () => {
  const [areas] = useState([
    { id: '1', nome: 'Ação Social' },
    { id: '2', nome: 'Proteção Animal' },
    { id: '3', nome: 'Educação' },
    { id: '4', nome: 'Saúde' },
    { id: '5', nome: 'Ambiente' },
    { id: '6', nome: 'Cultura e património' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Áreas de Atuação</h2>
          <p className="text-gray-600">Gerir áreas de atuação das ONGs</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Nova Área
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area) => (
            <div
              key={area.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-gray-900 font-medium">{area.nome}</span>
              <div className="flex space-x-2">
                <button
                  className="text-gray-400 hover:text-gray-600"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-red-600"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SimpleAreasAdmin;














