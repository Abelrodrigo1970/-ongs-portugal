'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EventTable from '@/components/admin/EventTable';
import AdminModal from '@/components/admin/AdminModal';
import EventForm from '@/components/admin/EventForm';
import EventParticipantsModal from '@/components/admin/EventParticipantsModal';

export default function AdminEventsPage() {
  const { getAuthHeaders } = useAdmin();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [odsOptions, setOdsOptions] = useState([]);
  const [areasOptions, setAreasOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [page, searchQuery]);

  useEffect(() => {
    loadNgosList();
    loadODSAndAreas();
  }, []);

  const loadEvents = async () => {
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

  const loadNgosList = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/ngos?limit=200', { headers });
      const data = await response.json();

      if (data.success) {
        setNgos(data.ngos);
      }
    } catch (error) {
      console.error('Erro ao carregar ONGs para seleção:', error);
    }
  };

  const loadODSAndAreas = async () => {
    try {
      const headers = getAuthHeaders();
      const [odsResponse, areasResponse] = await Promise.all([
        fetch('/api/admin/ods', { headers }),
        fetch('/api/admin/areas', { headers })
      ]);

      const odsData = await odsResponse.json();
      const areasData = await areasResponse.json();

      if (odsData.success) {
        setOdsOptions(odsData.ods);
      }
      if (areasData.success) {
        setAreasOptions(areasData.areas);
      }
    } catch (error) {
      console.error('Erro ao carregar ODS e Áreas:', error);
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
        headers
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
        headers
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

  const openCreateModal = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const openEditModal = async (event) => {
    try {
      // Buscar evento completo com ODS e áreas
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/events/${event.id}`, { headers });
      const data = await response.json();

      if (data.success) {
        setSelectedEvent(data.data);
        setIsFormOpen(true);
      } else {
        alert('Erro ao carregar dados do evento');
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      alert('Erro ao carregar dados do evento');
    }
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const handleViewParticipants = (eventId, eventName) => {
    setSelectedEventForParticipants({ id: eventId, nome: eventName });
    setIsParticipantsModalOpen(true);
  };

  const closeParticipantsModal = () => {
    setIsParticipantsModalOpen(false);
    setSelectedEventForParticipants(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        selectedEvent ? `/api/admin/events/${selectedEvent.id}` : '/api/admin/events',
        {
          method: selectedEvent ? 'PUT' : 'POST',
          headers,
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar evento');
      }

      alert(`Evento ${selectedEvent ? 'atualizado' : 'criado'} com sucesso!`);
      closeModal();
      loadEvents();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert(error.message || 'Erro ao salvar evento');
    } finally {
      setFormLoading(false);
    }
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
          onClick={openCreateModal}
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
        onEdit={openEditModal}
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

      <AdminModal
        title={selectedEvent ? 'Editar Evento' : 'Novo Evento'}
        description={selectedEvent ? 'Atualize os dados do evento abaixo.' : 'Preencha os dados para criar um novo evento.'}
        isOpen={isFormOpen}
        onClose={closeModal}
        footer={false}
        size="lg"
      >
        <EventForm
          initialData={selectedEvent}
          ngos={ngos}
          odsOptions={odsOptions}
          areasOptions={areasOptions}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
          onViewParticipants={handleViewParticipants}
        />
        {ngos.length === 0 && (
          <p className="mt-4 text-sm text-amber-600">
            ⚠️ Nenhuma ONG encontrada. Crie uma ONG primeiro para associar ao evento.
          </p>
        )}
      </AdminModal>

      <EventParticipantsModal
        eventId={selectedEventForParticipants?.id}
        eventName={selectedEventForParticipants?.nome}
        isOpen={isParticipantsModalOpen}
        onClose={closeParticipantsModal}
      />
    </div>
  );
}

