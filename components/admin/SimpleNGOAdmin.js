'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';

const SimpleNGOAdmin = () => {
  const [ngos] = useState([]);
  const [loading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ONGs</h2>
          <p className="text-gray-600">Gerir organizações não-governamentais</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Nova ONG
        </Button>
      </div>

      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Para gerir ONGs, é necessário configurar as funções de API.
          </p>
          <p className="text-sm text-gray-400">
            Este é um componente de demonstração. Em produção, conectaria com APIs reais.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SimpleNGOAdmin;












