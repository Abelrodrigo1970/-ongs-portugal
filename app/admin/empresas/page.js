'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EmpresaTable from '@/components/admin/EmpresaTable';
import AdminModal from '@/components/admin/AdminModal';
import EmpresaForm from '@/components/admin/EmpresaForm';

export default function AdminEmpresasPage() {
  const { getAuthHeaders } = useAdmin();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [odsOptions, setOdsOptions] = useState([]);
  const [causasOptions, setCausasOptions] = useState([]);
  const [tiposApoioOptions, setTiposApoioOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadEmpresas();
  }, [page, searchQuery]);

  useEffect(() => {
    loadODSAndOptions();
  }, []);

  const loadEmpresas = async () => {
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

      const response = await fetch(`/api/admin/empresas?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
        setEmpresas(data.empresas);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      alert('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const loadODSAndOptions = async () => {
    try {
      const headers = getAuthHeaders();
      const [odsResponse, causasResponse, tiposApoioResponse] = await Promise.all([
        fetch('/api/admin/ods', { headers }),
        fetch('/api/admin/causas', { headers }),
        fetch('/api/admin/tipos-apoio', { headers })
      ]);

      const odsData = await odsResponse.json();
      const causasData = await causasResponse.json();
      const tiposApoioData = await tiposApoioResponse.json();

      if (odsData.success) {
        setOdsOptions(odsData.ods);
      }
      if (causasData.success) {
        setCausasOptions(causasData.causas);
      }
      if (tiposApoioData.success) {
        setTiposApoioOptions(tiposApoioData.tiposApoio);
      }
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    }
  };

  const handleDelete = async (empresa) => {
    if (!confirm(`Tem certeza que deseja eliminar a empresa "${empresa.nome}"?`)) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/empresas/${empresa.id}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        alert('Empresa eliminada com sucesso!');
        loadEmpresas();
      } else {
        alert('Erro ao eliminar empresa: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao eliminar empresa:', error);
      alert('Erro ao eliminar empresa');
    }
  };

  const handleToggleVisibility = async (empresa) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/empresas/${empresa.id}`, {
        method: 'PATCH',
        headers
      });

      const data = await response.json();

      if (data.success) {
        alert(`Empresa ${data.data.visivel ? 'mostrada' : 'ocultada'} com sucesso!`);
        loadEmpresas();
      } else {
        alert('Erro ao alterar visibilidade: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      alert('Erro ao alterar visibilidade');
    }
  };

  const openCreateModal = () => {
    setSelectedEmpresa(null);
    setIsFormOpen(true);
  };

  const openEditModal = async (empresa) => {
    try {
      // Buscar empresa completa
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/empresas/${empresa.id}`, { headers });
      const data = await response.json();

      if (data.success) {
        setSelectedEmpresa(data.data);
        setIsFormOpen(true);
      } else {
        alert('Erro ao carregar dados da empresa');
      }
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      alert('Erro ao carregar dados da empresa');
    }
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setSelectedEmpresa(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        selectedEmpresa ? `/api/admin/empresas/${selectedEmpresa.id}` : '/api/admin/empresas',
        {
          method: selectedEmpresa ? 'PUT' : 'POST',
          headers,
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar empresa');
      }

      alert(`Empresa ${selectedEmpresa ? 'atualizada' : 'criada'} com sucesso!`);
      closeModal();
      loadEmpresas();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      alert(error.message || 'Erro ao salvar empresa');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestão de Empresas
          </h2>
          <p className="text-gray-600">
            {pagination ? `${pagination.total} empresas registradas` : 'Carregando...'}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={openCreateModal}
        >
          Nova Empresa
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar empresas..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={Search}
        />
      </div>

      <EmpresaTable
        empresas={empresas}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
      />

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Página {page} de {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Próxima
          </Button>
        </div>
      )}

      <AdminModal
        isOpen={isFormOpen}
        onClose={closeModal}
        title={selectedEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
      >
        <EmpresaForm
          initialData={selectedEmpresa}
          odsOptions={odsOptions}
          causasOptions={causasOptions}
          tiposApoioOptions={tiposApoioOptions}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </AdminModal>
    </div>
  );
}

