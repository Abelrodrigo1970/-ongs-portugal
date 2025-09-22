'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Edit, Plus, Trash2 } from 'lucide-react';

const SimpleColaboracaoAdmin = () => {
  const [colaboracaoTipos] = useState([
    { id: '1', nome: 'Parcerias de longo prazo' },
    { id: '2', nome: 'Palestras e sensibilização' },
    { id: '3', nome: 'Pro bono profissional' },
    { id: '4', nome: 'Donativos em espécie' },
    { id: '5', nome: 'Doações financeiras' },
    { id: '6', nome: 'Mentoria' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tipos de Colaboração</h2>
          <p className="text-gray-600">Gerir tipos de colaboração disponíveis</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Novo Tipo
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colaboracaoTipos.map((tipo) => (
            <div
              key={tipo.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-gray-900 font-medium">{tipo.nome}</span>
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

export default SimpleColaboracaoAdmin;








