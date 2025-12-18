'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Users, Loader } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAdmin } from '@/lib/context/AdminContext';

export default function EventParticipantsModal({ eventId, eventName, isOpen, onClose }) {
  const { getAuthHeaders } = useAdmin();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(new Set());
  const [updating, setUpdating] = useState(new Set());
  const [selectedParticipants, setSelectedParticipants] = useState(new Set());

  const statusOptions = [
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Aprovada', value: 'APROVADA' },
    { label: 'Rejeitada', value: 'REJEITADA' },
    { label: 'Cancelada', value: 'CANCELADA' }
  ];

  useEffect(() => {
    if (isOpen && eventId) {
      loadParticipants();
    } else {
      setParticipants([]);
      setSelectedParticipants(new Set());
    }
  }, [isOpen, eventId]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/events/${eventId}/participants`, { headers });
      const data = await response.json();

      if (data.success) {
        setParticipants(data.participants || []);
      } else {
        alert('Erro ao carregar participantes: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      alert('Erro ao carregar participantes');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (inscricaoId) => {
    if (!confirm('Tem certeza que deseja remover este participante do evento?')) {
      return;
    }

    setRemoving(prev => new Set(prev).add(inscricaoId));
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/inscricoes/${inscricaoId}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (data.success) {
        setParticipants(prev => prev.filter(p => p.id !== inscricaoId));
        alert('Participante removido com sucesso!');
      } else {
        alert('Erro ao remover participante: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao remover participante:', error);
      alert('Erro ao remover participante');
    } finally {
      setRemoving(prev => {
        const next = new Set(prev);
        next.delete(inscricaoId);
        return next;
      });
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedParticipants.size === 0) {
      alert('Selecione pelo menos um participante para remover');
      return;
    }

    if (!confirm(`Tem certeza que deseja remover ${selectedParticipants.size} participante(s) do evento?`)) {
      return;
    }

    const idsToRemove = Array.from(selectedParticipants);
    setRemoving(prev => new Set([...prev, ...idsToRemove]));

    try {
      const headers = getAuthHeaders();
      const removePromises = idsToRemove.map(id =>
        fetch(`/api/admin/inscricoes/${id}`, {
          method: 'DELETE',
          headers
        })
      );

      const results = await Promise.all(removePromises);
      const allSuccessful = results.every(r => r.ok);

      if (allSuccessful) {
        const removedCount = selectedParticipants.size;
        setParticipants(prev => prev.filter(p => !selectedParticipants.has(p.id)));
        setSelectedParticipants(new Set());
        alert(`${removedCount} participante(s) removido(s) com sucesso!`);
      } else {
        alert('Erro ao remover alguns participantes');
        loadParticipants(); // Recarregar lista para garantir sincronização
      }
    } catch (error) {
      console.error('Erro ao remover participantes:', error);
      alert('Erro ao remover participantes');
    } finally {
      setRemoving(prev => {
        const next = new Set(prev);
        idsToRemove.forEach(id => next.delete(id));
        return next;
      });
      loadParticipants(); // Recarregar lista para garantir sincronização
    }
  };

  const toggleSelectParticipant = (id) => {
    setSelectedParticipants(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedParticipants.size === participants.length) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(new Set(participants.map(p => p.id)));
    }
  };

  const handleStatusChange = async (inscricaoId, newStatus) => {
    setUpdating(prev => new Set(prev).add(inscricaoId));
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/inscricoes/${inscricaoId}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar o status na lista local
        setParticipants(prev =>
          prev.map(p =>
            p.id === inscricaoId ? { ...p, status: newStatus } : p
          )
        );
      } else {
        alert('Erro ao atualizar status: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da inscrição');
    } finally {
      setUpdating(prev => {
        const next = new Set(prev);
        next.delete(inscricaoId);
        return next;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Participantes do Evento
                  </h3>
                  <p className="text-sm text-gray-500">{eventName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedParticipants.size > 0 && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-800">
                  {selectedParticipants.size} participante(s) selecionado(s)
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={removing.size > 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover Selecionados
                </Button>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="ml-3 text-gray-600">Carregando participantes...</span>
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum participante inscrito neste evento</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.size === participants.length && participants.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Inscrição
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.has(participant.id)}
                            onChange={() => toggleSelectParticipant(participant.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {participant.nomeColaborador || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {participant.emailColaborador || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {participant.telefone || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="min-w-[140px]">
                            {updating.has(participant.id) ? (
                              <div className="flex items-center gap-2">
                                <Loader className="w-4 h-4 animate-spin text-gray-400" />
                                <span className="text-xs text-gray-500">Atualizando...</span>
                              </div>
                            ) : (
                              <select
                                value={participant.status || 'PENDENTE'}
                                onChange={(e) => handleStatusChange(participant.id, e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors"
                              >
                                {statusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {participant.createdAt
                            ? new Date(participant.createdAt).toLocaleString('pt-PT', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant.id)}
                            disabled={removing.has(participant.id)}
                          >
                            {removing.has(participant.id) ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
