'use client';

import { useState, useEffect } from 'react';
import { getAllAreas } from '@/lib/repositories/areas';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Edit, Plus, Trash2 } from 'lucide-react';

const AreasAdmin = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const allAreas = await getAllAreas();
      setAreas(allAreas);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
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

export default AreasAdmin;

