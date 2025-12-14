'use client';

import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Check, Loader2 } from 'lucide-react';

const AddGuestsModal = ({ isOpen, onClose, eventoId, onAddGuests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [selectedColaboradores, setSelectedColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Buscar colaboradores
  useEffect(() => {
    if (!isOpen) return;

    const fetchColaboradores = async () => {
      setLoading(true);
      setError('');
      
      try {
        const queryParams = new URLSearchParams({
          query: searchQuery,
          ativo: 'true',
          limit: '50'
        });

        const response = await fetch(`/api/colaboradores/search?${queryParams}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setColaboradores(data.colaboradores || []);
        } else {
          setError('Erro ao buscar colaboradores');
        }
      } catch (err) {
        console.error('Error fetching colaboradores:', err);
        setError('Erro ao buscar colaboradores');
      } finally {
        setLoading(false);
      }
    };

    // Debounce da busca
    const timeoutId = setTimeout(() => {
      fetchColaboradores();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isOpen]);

  const toggleColaborador = (colaborador) => {
    setSelectedColaboradores(prev => {
      const isSelected = prev.some(c => c.id === colaborador.id);
      if (isSelected) {
        return prev.filter(c => c.id !== colaborador.id);
      } else {
        return [...prev, colaborador];
      }
    });
  };

  const handleAddGuests = async () => {
    if (selectedColaboradores.length === 0) {
      setError('Selecione pelo menos um colaborador');
      return;
    }

    setAdding(true);
    setError('');
    setSuccess('');

    try {
      // Criar inscrições para cada colaborador selecionado
      const promises = selectedColaboradores.map(colaborador =>
        fetch('/api/inscricoes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            eventoId: eventoId,
            nomeColaborador: colaborador.nome,
            emailColaborador: colaborador.email,
            telefone: null,
            mensagem: null
          })
        })
      );

      const results = await Promise.allSettled(promises);
      
      const successful = [];
      const failed = [];

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const colaborador = selectedColaboradores[i];
        
        if (result.status === 'fulfilled' && result.value.ok) {
          successful.push(colaborador);
        } else {
          // Verificar se é erro de duplicata
          if (result.status === 'fulfilled' && !result.value.ok) {
            try {
              const errorData = await result.value.json();
              if (errorData.error && errorData.error.includes('já está inscrito')) {
                // Colaborador já inscrito - não adicionar à lista de falhas
                console.log(`Colaborador ${colaborador.nome} já está inscrito`);
                continue;
              }
            } catch (e) {
              // Ignorar erro de parsing
            }
          }
          failed.push(colaborador);
        }
      }

      if (successful.length > 0) {
        const message = failed.length > 0
          ? `${successful.length} colaborador(es) adicionado(s). ${failed.length} já estava(m) inscrito(s).`
          : `${successful.length} colaborador(es) adicionado(s) com sucesso!`;
        
        setSuccess(message);
        
        // Chamar callback para atualizar a lista
        if (onAddGuests) {
          onAddGuests(successful);
        }

        // Limpar seleção e fechar após 2 segundos
        setTimeout(() => {
          setSelectedColaboradores([]);
          setSearchQuery('');
          onClose();
        }, 2000);
      } else {
        setError('Erro ao adicionar colaboradores. Verifique se já não estão inscritos.');
      }
    } catch (err) {
      console.error('Error adding guests:', err);
      setError('Erro ao adicionar colaboradores');
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedColaboradores([]);
    setSearchQuery('');
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: '16px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Adicionar Convidados
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input
              type="text"
              placeholder="Buscar colaboradores por nome, email ou empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          ) : colaboradores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'Nenhum colaborador encontrado' : 'Digite para buscar colaboradores'}
            </div>
          ) : (
            <div className="space-y-2">
              {colaboradores.map((colaborador) => {
                const isSelected = selectedColaboradores.some(c => c.id === colaborador.id);
                return (
                  <div
                    key={colaborador.id}
                    onClick={() => toggleColaborador(colaborador)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          {colaborador.avatar ? (
                            <img
                              src={colaborador.avatar}
                              alt={colaborador.nome}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserPlus size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {colaborador.nome}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {colaborador.email}
                          </p>
                          {colaborador.empresa && (
                            <p className="text-xs text-gray-400 mt-1">
                              {colaborador.empresa.nome}
                            </p>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 ml-4">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedColaboradores.length > 0 && (
              <span>
                {selectedColaboradores.length} colaborador(es) selecionado(s)
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddGuests}
              disabled={selectedColaboradores.length === 0 || adding}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {adding ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Adicionando...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Adicionar ({selectedColaboradores.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuestsModal;

