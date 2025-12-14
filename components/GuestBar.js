'use client';

import { useState, useEffect } from 'react';

const GuestBar = ({ className = '', event = null }) => {
  const [colaborador, setColaborador] = useState(null);

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

  // Valores padrão para demonstração (será substituído por dados reais)
  const horasDedicadas = colaborador?.horasDedicadas || 4;
  const nomeCausa = event?.areas?.[0]?.tipo?.nome || event?.ods?.[0]?.ods?.nome || 'esta causa';

  return (
    <button 
      className={className}
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
          whiteSpace: 'pre-wrap'
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
            justifyContent: 'center',
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
  );
};

export default GuestBar;
