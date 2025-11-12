'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import NGOTable from '@/components/admin/NGOTable';
import AdminModal from '@/components/admin/AdminModal';
import NGOForm from '@/components/admin/NGOForm';

export default function AdminNGOsPage() {
  const { getAuthHeaders } = useAdmin();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [areasOptions, setAreasOptions] = useState([]);
  const ensuringVisibilityRef = useRef(false);

  useEffect(() => {
    loadAreas();
  }, []);

  useEffect(() => {
    loadNGOs();
  }, [page, searchQuery]);

  const loadAreas = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/areas', { headers });
      const data = await response.json();

      if (data.success) {
        setAreasOptions(data.areas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar áreas de atuação:', error);
    }
  };

  const loadNGOs = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (searchQuery) {
        params.append('query', searchQuery);
      }

      params.append('visivel', 'all');

      const response = await fetch(`/api/admin/ngos?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
        const hiddenNgos = (data.ngos || []).filter((ngo) => ngo.visivel === false);

        if (hiddenNgos.length > 0 && !ensuringVisibilityRef.current) {
          ensuringVisibilityRef.current = true;
          try {
            await Promise.all(
              hiddenNgos.map((ngo) =>
                fetch(`/api/admin/ngos/${ngo.id}`, {
                  method: 'PATCH',
                  headers,
                })
              )
            );
          } finally {
            ensuringVisibilityRef.current = false;
          }
          await loadNGOs();
          return;
        }

        setNgos(data.ngos);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar ONGs:', error);
      alert('Erro ao carregar ONGs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ngo) => {
    if (!confirm(`Tem certeza que deseja deletar "${ngo.nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/ngos/${ngo.id}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        alert('ONG deletada com sucesso!');
        loadNGOs();
      } else {
        alert('Erro ao deletar ONG: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao deletar ONG:', error);
      alert('Erro ao deletar ONG');
    }
  };

  const openCreateModal = () => {
    setSelectedNGO(null);
    setIsFormOpen(true);
  };

  const openEditModal = (ngo) => {
    setSelectedNGO(ngo);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setSelectedNGO(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        selectedNGO ? `/api/admin/ngos/${selectedNGO.id}` : '/api/admin/ngos',
        {
          method: selectedNGO ? 'PUT' : 'POST',
          headers,
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar ONG');
      }

      alert(`ONG ${selectedNGO ? 'atualizada' : 'criada'} com sucesso!`);
      closeModal();
      loadNGOs();
    } catch (error) {
      console.error('Erro ao salvar ONG:', error);
      alert(error.message || 'Erro ao salvar ONG');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestão de ONGs
          </h2>
          <p className="text-gray-600">
            {pagination ? `${pagination.total} ONGs registradas` : 'Carregando...'}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={openCreateModal}
        >
          Nova ONG
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar ONGs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={Search}
        />
      </div>

      <NGOTable
        ngos={ngos}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.pages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <AdminModal
        title={selectedNGO ? 'Editar ONG' : 'Nova ONG'}
        description={selectedNGO ? 'Atualize os dados da organização abaixo.' : 'Preencha os dados para criar uma nova ONG.'}
        isOpen={isFormOpen}
        onClose={closeModal}
        footer={false}
        size="lg"
      >
        <NGOForm
          initialData={selectedNGO}
          areasOptions={areasOptions}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </AdminModal>
    </div>
  );
}

