'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import OdsBadge from '@/components/OdsBadge';
import { Edit } from 'lucide-react';

const SimpleODSAdmin = () => {
  const [ods] = useState([
    { id: '1', numero: 1, nome: 'Erradicar a pobreza', descricao: 'Acabar com a pobreza em todas as suas formas, em todos os lugares' },
    { id: '2', numero: 2, nome: 'Erradicar a fome', descricao: 'Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição e promover a agricultura sustentável' },
    { id: '3', numero: 3, nome: 'Saúde de qualidade', descricao: 'Assegurar uma vida saudável e promover o bem-estar para todos, em todas as idades' },
    { id: '4', numero: 4, nome: 'Educação de qualidade', descricao: 'Assegurar a educação inclusiva e equitativa e de qualidade, e promover oportunidades de aprendizagem ao longo da vida para todos' },
    { id: '5', numero: 5, nome: 'Igualdade de Género', descricao: 'Alcançar a igualdade de género e empoderar todas as mulheres e raparigas' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Objetivos de Desenvolvimento Sustentável</h2>
          <p className="text-gray-600">Gerir os 17 ODS e suas informações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ods.map((odsItem) => (
          <Card key={odsItem.id}>
            <div className="flex justify-between items-start mb-4">
              <OdsBadge numero={odsItem.numero} nome={odsItem.nome} />
              <button
                className="text-gray-400 hover:text-gray-600"
                title="Editar ODS"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {odsItem.nome}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {odsItem.descricao}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimpleODSAdmin;














