'use client';

import { useState, useEffect } from 'react';
import { getAllODS } from '@/lib/repositories/ods';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OdsBadge from '@/components/OdsBadge';
import { Edit } from 'lucide-react';

const ODSAdmin = () => {
  const [ods, setODS] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadODS();
  }, []);

  const loadODS = async () => {
    try {
      setLoading(true);
      const allODS = await getAllODS();
      setODS(allODS);
    } catch (error) {
      console.error('Erro ao carregar ODS:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

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

export default ODSAdmin;

