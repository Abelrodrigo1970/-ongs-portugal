'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ColaboradorTable from '@/components/admin/ColaboradorTable';
import AdminModal from '@/components/admin/AdminModal';
import ColaboradorForm from '@/components/admin/ColaboradorForm';

export default function AdminColaboradoresPage() {
  const { getAuthHeaders } = useAdmin();
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadColaboradores();
  }, [page, searchQuery]);

  useEffect(() => {
    loadEmpresasList();
  }, []);

  const loadColaboradores = async () => {
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

      const response = await fetch(`/api/admin/colaboradores?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
        setColaboradores(data.colaboradores);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      alert('Erro ao carregar colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const loadEmpresasList = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/empresas?limit=200', { headers });
      const data = await response.json();

      if (data.success) {
        setEmpresas(data.empresas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas para seleção:', error);
    }
  };

  const handleDelete = async (colaborador) => {
    if (!confirm(`Tem certeza que deseja eliminar o colaborador "${colaborador.nome}"?`)) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/colaboradores/${colaborador.id}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        alert('Colaborador eliminado com sucesso!');
        loadColaboradores();
      } else {
        alert('Erro ao eliminar colaborador: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao eliminar colaborador:', error);
      alert('Erro ao eliminar colaborador');
    }
  };

  const handleToggleStatus = async (colaborador) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/colaboradores/${colaborador.id}`, {
        method: 'PATCH',
        headers
      });

      const data = await response.json();

      if (data.success) {
        alert(`Colaborador ${data.data.ativo ? 'ativado' : 'desativado'} com sucesso!`);
        loadColaboradores();
      } else {
        alert('Erro ao alterar status: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status');
    }
  };

  const openCreateModal = () => {
    setSelectedColaborador(null);
    setIsFormOpen(true);
  };

  const openEditModal = async (colaborador) => {
    try {
      // Buscar colaborador completo
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/colaboradores/${colaborador.id}`, { headers });
      const data = await response.json();

      if (data.success) {
        setSelectedColaborador(data.data);
        setIsFormOpen(true);
      } else {
        alert('Erro ao carregar dados do colaborador');
      }
    } catch (error) {
      console.error('Erro ao carregar colaborador:', error);
      alert('Erro ao carregar dados do colaborador');
    }
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setSelectedColaborador(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        selectedColaborador ? `/api/admin/colaboradores/${selectedColaborador.id}` : '/api/admin/colaboradores',
        {
          method: selectedColaborador ? 'PUT' : 'POST',
          headers,
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar colaborador');
      }

      alert(`Colaborador ${selectedColaborador ? 'atualizado' : 'criado'} com sucesso!`);
      closeModal();
      loadColaboradores();
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error);
      alert(error.message || 'Erro ao salvar colaborador');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestão de Colaboradores
          </h2>
          <p className="text-gray-600">
            {pagination ? `${pagination.total} colaboradores registrados` : 'Carregando...'}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={openCreateModal}
        >
          Novo Colaborador
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar colaboradores..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={Search}
        />
      </div>

      <ColaboradorTable
        colaboradores={colaboradores}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Página {page} de {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      <AdminModal
        isOpen={isFormOpen}
        onClose={closeModal}
        title={selectedColaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
      >
        <ColaboradorForm
          initialData={selectedColaborador}
          empresas={empresas}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </AdminModal>
    </div>
  );
}

