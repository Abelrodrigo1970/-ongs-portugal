'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EventTable from '@/components/admin/EventTable';

export default function AdminEventsPage() {
  const { getAuthHeaders } = useAdmin();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [page, searchQuery]);

  const loadEvents = async () => {
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

      const response = await fetch(`/api/admin/events?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      alert('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event) => {
    if (!confirm(`Tem certeza que deseja deletar "${event.nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        alert('Evento deletado com sucesso!');
        loadEvents();
      } else {
        alert('Erro ao deletar evento: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      alert('Erro ao deletar evento');
    }
  };

  const handleToggleVisibility = async (event) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers,
      });

      const data = await response.json();

      if (data.success) {
        alert(`Evento ${data.data.visivel ? 'mostrado' : 'ocultado'} com sucesso!`);
        loadEvents();
      } else {
        alert('Erro ao alterar visibilidade: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      alert('Erro ao alterar visibilidade');
    }
  };

  const handleEdit = (event) => {
    alert('Funcionalidade de edição em desenvolvimento. ID: ' + event.id);
    // TODO: Implementar modal de edição
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestão de Eventos
          </h2>
          <p className="text-gray-600">
            {pagination ? `${pagination.total} eventos registrados` : 'Carregando...'}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => alert('Funcionalidade em desenvolvimento')}
        >
          Novo Evento
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={Search}
        />
      </div>

      <EventTable
        events={events}
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

