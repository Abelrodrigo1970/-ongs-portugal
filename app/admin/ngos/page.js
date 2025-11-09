'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import NGOTable from '@/components/admin/NGOTable';

export default function AdminNGOsPage() {
  const { getAuthHeaders } = useAdmin();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadNGOs();
  }, [page, searchQuery]);

  const loadNGOs = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (searchQuery) {
        params.append('query', searchQuery);
      }

      const response = await fetch(`/api/admin/ngos?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
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
        headers,
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

  const handleToggleVisibility = async (ngo) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/ngos/${ngo.id}`, {
        method: 'PATCH',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        alert(`ONG ${data.data.visivel ? 'mostrada' : 'ocultada'} com sucesso!`);
        loadNGOs();
      } else {
        alert('Erro ao alterar visibilidade: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      alert('Erro ao alterar visibilidade');
    }
  };

  const handleEdit = (ngo) => {
    alert('Funcionalidade de edição em desenvolvimento. ID: ' + ngo.id);
    // TODO: Implementar modal de edição
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
          onClick={() => alert('Funcionalidade em desenvolvimento')}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
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
    </div>
  );
}

