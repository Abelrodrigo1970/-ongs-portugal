'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Plus, Trash2, Search } from 'lucide-react';

export default function AdminAreasPage() {
  const { getAuthHeaders } = useAdmin();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '' });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/areas', { headers });
      const data = await response.json();

      if (data.success) {
        setAreas(data.areas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArea(null);
    setFormData({ nome: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (area) => {
    setSelectedArea(area);
    setFormData({ nome: area.nome });
    setIsFormOpen(true);
  };

  const handleDelete = async (areaId) => {
    if (!confirm('Tem certeza que deseja eliminar esta área?')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/areas/${areaId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        loadAreas();
      } else {
        alert('Erro ao eliminar área');
      }
    } catch (error) {
      console.error('Erro ao eliminar área:', error);
      alert('Erro ao eliminar área');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const headers = getAuthHeaders();
      const url = selectedArea
        ? `/api/admin/areas/${selectedArea.id}`
        : '/api/admin/areas';
      const method = selectedArea ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsFormOpen(false);
        loadAreas();
        setFormData({ nome: '' });
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao salvar área');
      }
    } catch (error) {
      console.error('Erro ao salvar área:', error);
      alert('Erro ao salvar área');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gerir Áreas de Atuação
        </h2>
        <p className="text-gray-600">
          Criar, editar e gerir áreas de atuação das ONGs
        </p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Pesquisar áreas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-5 w-5 mr-2" />
          Nova Área
        </Button>
      </div>

      {/* Areas List */}
      {loading ? (
        <Card>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      ) : (
        <Card>
          {filteredAreas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'Nenhuma área encontrada' : 'Nenhuma área cadastrada'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900 font-medium">{area.nome}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(area)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Form Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setFormData({ nome: '' });
          setSelectedArea(null);
        }}
        title={selectedArea ? 'Editar Área' : 'Nova Área'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Área
            </label>
            <Input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ nome: e.target.value })}
              placeholder="Ex: Ação Social"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormOpen(false);
                setFormData({ nome: '' });
                setSelectedArea(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Salvando...' : selectedArea ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

