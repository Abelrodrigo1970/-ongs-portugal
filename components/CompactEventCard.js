'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Card from './ui/Card';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const CompactEventCard = ({ event, className = '', onCardClick }) => {
  const [vagasInfo, setVagasInfo] = useState({
    ocupadas: 0,
    total: 0
  });

  // Buscar vagas do evento
  useEffect(() => {
    const fetchVagas = async () => {
      if (!event?.id) return;

      try {
        const response = await fetch(`/api/events/${event.id}/vagas`);
        const data = await response.json();

        if (data.success && data.data) {
          setVagasInfo({
            ocupadas: data.data.ocupadas || 0,
            total: data.data.total || 0
          });
        } else {
          // Fallback: usar dados do evento
          setVagasInfo({
            ocupadas: 0,
            total: event.maxParticipantes || 0
          });
        }
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        // Fallback em caso de erro
        setVagasInfo({
          ocupadas: 0,
          total: event.maxParticipantes || 0
        });
      }
    };

    fetchVagas();
  }, [event?.id, event?.maxParticipantes]);

  // Função para formatar data
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month}, ${year}`;
  };

  // Função para formatar hora
  const formatEventTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Lisbon'
    });
  };

  // Usar dados reais das vagas
  const vagasTotal = vagasInfo.total || event.maxParticipantes || 0;
  const vagasOcupadas = vagasInfo.ocupadas || 0;

  // Formatar data no estilo do Figma (ex: "Sáb, 13 dez")
  const formatEventDateShort = (dateString) => {
    if (!dateString) return 'DD MM, YYYY';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekday = weekdays[date.getDay()];
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    
    return `${weekday}, ${day} ${month}`;
  };

  return (
    <Card 
      className={`hover:shadow-xl transition-all duration-300 overflow-clip cursor-pointer ${className}`}
      padding="none"
      onClick={onCardClick}
      style={{ 
        backgroundColor: '#f8fafc',
        borderColor: '#cbd5e1',
        borderRadius: '36px',
        borderWidth: '1px',
        borderStyle: 'solid',
        width: '310px', // Mantém 310px conforme Figma original
        padding: 0 // Sem padding no card
      }}
    >
      <div className="block" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="flex flex-col" style={{ flex: 1 }}>
          {/* Event Image with Badge - sem padding */}
          <div className="relative w-full overflow-hidden" style={{ height: '144px' }}> {/* h-36 = 144px como no código fornecido */}
            {event.imagem ? (
              <Image
                src={event.imagem}
                alt={event.nome}
                fill
                className="object-cover"
                style={{ objectPosition: '50% 50%' }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center" 
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <div 
                  className="flex items-center justify-center" 
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px'
                  }}
                >
                  <svg className="text-white" style={{ width: '40px', height: '40px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Badge de Vagas - Estilo Figma (fundo escuro com blur) */}
            {vagasTotal > 0 && (
              <div 
                className="absolute flex flex-col backdrop-blur-[100px]"
                style={{
                  top: '16px', // Como no código fornecido
                  left: '202px', // Como no código fornecido
                  width: '96px', // w-24 = 96px como no código fornecido
                  height: '24px', // h-6 = 24px como no código fornecido
                  backgroundColor: 'rgba(26, 26, 26, 0.75)',
                  backdropFilter: 'blur(100px)',
                  borderRadius: '200px',
                  padding: '4px 8px',
                  gap: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  <Users className="h-4 w-4 flex-shrink-0" style={{ color: '#f1f5f9', width: '16px', height: '16px' }} />
                  <p 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '1.2',
                      margin: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ fontWeight: '700', color: '#f1f5f9' }}>{vagasOcupadas}</span>
                    <span style={{ color: '#cbd5e1' }}> / {vagasTotal}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div 
            className="flex flex-col" 
            style={{ 
              gap: '8px',
              paddingTop: '8px',
              paddingBottom: '24px',
              paddingLeft: '24px',
              paddingRight: '24px',
              backgroundColor: '#f8fafc',
              width: '310px', // Mantém 310px conforme Figma original
              minHeight: '252px' // Altura mínima: título(60) + data/hora(24) + descrição(72) + gaps/padding(96)
            }}
          >
            {/* Title and Location */}
            <div className="flex flex-col items-start" style={{ gap: '0px', minHeight: '60px' }}>
              <h3 
                className="font-bold whitespace-pre-wrap" 
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#020617',
                  fontSize: '20px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  margin: 0,
                  width: '100%',
                  minHeight: '48px' // Garante altura mínima de 2 linhas (20px * 1.2 * 2)
                }}
              >
                {event.nome}
              </h3>
              
              {/* Location (below title) */}
              {(event.localizacao || event.ngo?.localizacao) ? (
                <p 
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    margin: 0,
                    width: '100%'
                  }}
                >
                  {event.localizacao || event.ngo?.localizacao}
                </p>
              ) : (
                <div style={{ height: '21px' }}></div>
              )}
            </div>

            {/* Date and Time (same line) */}
            {event.dataInicio && (
              <div className="flex items-start" style={{ gap: '12px' }}>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#595959', opacity: 0.7, width: '16px', height: '16px' }} />
                  <span 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: '#595959',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.5',
                      opacity: 0.7,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatEventDateShort(event.dataInicio)}
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#595959', opacity: 0.7, width: '16px', height: '16px' }} />
                  <span 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: '#595959',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.5',
                      opacity: 0.7,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatEventTime(event.dataInicio)}
                    {event.dataFim && ` - ${formatEventTime(event.dataFim)}`}
                  </span>
                </div>
              </div>
            )}

            {/* Description - altura fixa de 72px como no Figma */}
            {event.descricao && (
              <p 
                className="font-normal whitespace-pre-wrap" 
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#595959',
                  fontSize: '16px',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  height: '72px',
                  margin: 0,
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {event.descricao}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompactEventCard;
