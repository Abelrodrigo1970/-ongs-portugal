'use client';

import { useState, useEffect } from 'react';
import AddGuestsModal from './AddGuestsModal';

const GuestBar = ({ className = '', event = null }) => {
  const [colaborador, setColaborador] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Buscar ODS relacionados ao evento
  const obterODS = () => {
    if (!event?.ods || event.ods.length === 0) {
      return null;
    }
    
    // Se houver múltiplos ODS, mostrar os nomes completos
    const odsList = event.ods.map(item => {
      const ods = item.ods || item;
      return ods.nome || null;
    }).filter(Boolean);
    
    if (odsList.length === 0) return null;
    if (odsList.length === 1) return odsList[0];
    return odsList.join(', ');
  };

  const nomeODS = obterODS() || 'esta causa';

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
          {horasDedicadas.toString().padStart(2, '0')} horas
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
          {nomeODS}.
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

    <AddGuestsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      eventoId={event?.id}
      onAddGuests={(colaboradores) => {
        // Callback quando colaboradores são adicionados
        console.log('Colaboradores adicionados:', colaboradores);
        // Aqui você pode atualizar a lista de inscritos se necessário
      }}
    />
    </>
  );
};

export default GuestBar;
