'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AddGuestsModal from './AddGuestsModal';

const GuestBar = ({ className = '', event = null, selectedGuests = [], onSelectedGuestsChange }) => {
  const [colaborador, setColaborador] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSelectedGuests, setLocalSelectedGuests] = useState(selectedGuests || []);

  useEffect(() => {
    // Carregar colaborador do localStorage
    if (typeof window !== 'undefined') {
      const savedColaborador = localStorage.getItem('colaborador');
      if (savedColaborador) {
        try {
          setColaborador(JSON.parse(savedColaborador));
        } catch (error) {
          console.error('Error loading colaborador:', error);
        }
      }
    }
  }, []);

  // Calcular horas pela diferença entre dataInicio e dataFim
  const calcularHoras = () => {
    if (!event?.dataInicio) return 0;
    
    const inicio = new Date(event.dataInicio);
    const fim = event.dataFim ? new Date(event.dataFim) : new Date();
    
    const diffMs = fim - inicio;
    const diffHoras = Math.round(diffMs / (1000 * 60 * 60));
    
    return Math.max(0, diffHoras);
  };

  const horasDedicadas = calcularHoras();

  // Buscar áreas de atuação/causas relacionadas ao evento
  const obterAreas = () => {
    if (!event?.areas || event.areas.length === 0) {
      return null;
    }
    
    // Se houver múltiplas áreas, mostrar os nomes completos
    const areasList = event.areas.map(item => {
      const tipo = item.tipo || item;
      return tipo.nome || null;
    }).filter(Boolean);
    
    if (areasList.length === 0) return null;
    if (areasList.length === 1) return areasList[0];
    return areasList.join(', ');
  };

  const nomeCausa = obterAreas() || 'esta causa';

  // Atualizar estado local quando prop mudar
  useEffect(() => {
    setLocalSelectedGuests(selectedGuests || []);
  }, [selectedGuests]);

  const handleGuestsSelected = (colaboradores) => {
    setLocalSelectedGuests(colaboradores);
    if (onSelectedGuestsChange) {
      onSelectedGuestsChange(colaboradores);
    }
  };

  const handleRemoveGuest = (guestId) => {
    const updated = localSelectedGuests.filter(g => g.id !== guestId);
    setLocalSelectedGuests(updated);
    if (onSelectedGuestsChange) {
      onSelectedGuestsChange(updated);
    }
  };

  return (
    <>
      <button 
        className={className}
        onClick={() => setIsModalOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-start',
          padding: 0,
          width: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}
      >
      {/* Texto com gradiente */}
      <p 
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '1.5',
          margin: 0,
          width: '100%',
          whiteSpace: 'pre-wrap',
          textAlign: 'left'
        }}
      >
        <span 
          style={{
            fontWeight: '700',
            background: 'linear-gradient(177.14deg, rgba(0, 134, 255, 1) 16.451%, rgba(0, 181, 211, 1) 54.473%, rgba(0, 234, 162, 1) 97.15%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {horasDedicadas} horas
        </span>
        {' '}
        <span style={{ color: '#64748B' }}>
          dedicadas a causa de
        </span>
        {' '}
        <span 
          style={{
            fontWeight: '700',
            background: 'linear-gradient(177.14deg, rgba(0, 134, 255, 1) 16.451%, rgba(0, 181, 211, 1) 54.473%, rgba(0, 234, 162, 1) 97.15%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {nomeCausa}.
        </span>
      </p>

      {/* Campo "Adicionar convidados" */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          alignItems: 'flex-start',
          width: '100%'
        }}
      >
        <div 
          style={{
            backgroundColor: '#F2F2F2',
            borderBottom: '2px solid #0086FF',
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px',
            borderRadius: '8px 8px 0 0',
            width: '100%'
          }}
        >
          <p 
            style={{
              flex: '1 0 0',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '400',
              lineHeight: '1.5',
              margin: 0,
              color: '#595959',
              fontSize: '14px',
              textAlign: 'left',
              whiteSpace: 'pre-wrap'
            }}
          >
            Adicionar convidados
          </p>
        </div>
      </div>
    </button>

    {/* Div mostrando convidados selecionados */}
    {localSelectedGuests.length > 0 && (
      <div 
        style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#F8F9FA',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          width: '100%'
        }}
      >
        <p 
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1E293B',
            marginBottom: '8px'
          }}
        >
          Convidados selecionados ({localSelectedGuests.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {localSelectedGuests.map((guest) => (
            <div
              key={guest.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #E2E8F0'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p 
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1E293B',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {guest.nome}
                </p>
                <p 
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: '#64748B',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {guest.email}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveGuest(guest.id);
                }}
                style={{
                  marginLeft: '8px',
                  padding: '4px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.color = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    <AddGuestsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      eventoId={event?.id}
      onAddGuests={handleGuestsSelected}
    />
    </>
  );
};

export default GuestBar;
