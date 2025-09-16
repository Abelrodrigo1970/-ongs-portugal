'use client';

import { useState, useEffect } from 'react';
import { getNGOs } from '@/lib/repositories/ngos';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';

const NGOAdmin = () => {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      setLoading(true);
      const result = await getNGOs({ limit: 100 });
      setNGOs(result.ngos);
    } catch (error) {
      console.error('Erro ao carregar ONGs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (ngoId, currentVisibility) => {
    try {
      // Here you would call the API to toggle visibility
      console.log('Toggle visibility for NGO:', ngoId, !currentVisibility);
      // For now, just update the local state
      setNGOs(ngos.map(ngo => 
        ngo.id === ngoId ? { ...ngo, visivel: !ngo.visivel } : ngo
      ));
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
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
          <h2 className="text-2xl font-bold text-gray-900">ONGs</h2>
          <p className="text-gray-600">Gerir organizações não-governamentais</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Nova ONG
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ONG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ODS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ngos.map((ngo) => (
                <tr key={ngo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ngo.nome}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {ngo.descricao}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ngo.localizacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {ngo.ods?.slice(0, 2).map((ngoods) => (
                        <Badge key={ngoods.ods.id} size="xs">
                          ODS {ngoods.ods.numero}
                        </Badge>
                      ))}
                      {ngo.ods?.length > 2 && (
                        <Badge size="xs" variant="secondary">
                          +{ngo.ods.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={ngo.visivel ? 'success' : 'warning'}>
                      {ngo.visivel ? 'Visível' : 'Oculto'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleVisibility(ngo.id, ngo.visivel)}
                      className="text-gray-600 hover:text-gray-900"
                      title={ngo.visivel ? 'Ocultar' : 'Mostrar'}
                    >
                      {ngo.visivel ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      className="text-primary-600 hover:text-primary-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default NGOAdmin;

