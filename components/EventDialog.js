'use client';

import Image from 'next/image';
import { X, Calendar, Clock, Users } from 'lucide-react';
import Button from './ui/Button';
import GuestBar from './GuestBar';

const EventDialog = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  // Função para formatar data (ex: "Sáb, 13 dez")
  const formatEventDateShort = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekday = weekdays[date.getDay()];
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    
    return `${weekday}, ${day} ${month}`;
  };

  // Função para formatar hora (ex: "10:00 - 14:00")
  const formatEventTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Lisbon'
    });
  };

  // Calcular vagas
  const vagasTotal = event.maxParticipantes || 0;
  const vagasOcupadas = vagasTotal > 0 ? 10 : 0; // Simulado - ajustar quando houver API de inscrições
  const vagasDisponiveis = vagasTotal - vagasOcupadas;

  // Obter localização
  const localizacao = event.localizacao || event.morada || event.ngo?.localizacao || '';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col md:flex-row"
        style={{
          width: '914px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface-page, #F8FAFC)',
          border: '1px solid var(--border-default, #CBD5E1)',
          borderRadius: '32px',
          padding: '24px 24px 24px 0',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <X size={20} color="#64748B" />
        </button>

        {/* Left Content */}
        <div 
          className="flex flex-col"
          style={{
            flex: 1,
            gap: '16px',
            width: '421px',
            maxWidth: '100%',
            paddingLeft: '24px',
            overflowY: 'auto',
            maxHeight: '90vh'
          }}
        >
          {/* Main Content Frame */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {/* Title and Location */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <h2 
                style={{
                  color: 'var(--content-content-fill-primary, #020617)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '24px',
                  fontWeight: '600',
                  lineHeight: '139.9999976158142%',
                  margin: 0,
                  width: '354.45px'
                }}
              >
                {event.nome}
              </h2>

              {localizacao && (
                <p 
                  style={{
                    color: 'var(--content-content-text-tertiary, #64748B)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '150%',
                    margin: 0
                  }}
                >
                  {localizacao}
                </p>
              )}
            </div>

            {/* Date, Time and Participants */}
            <div className="flex items-start" style={{ gap: '16px' }}>
              {/* Date and Time */}
              <div className="flex items-center" style={{ gap: '16px' }}>
                {event.dataInicio && (
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <Calendar size={16} color="#595959" style={{ opacity: 0.7 }} />
                    <span 
                      style={{
                        color: '#595959',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: '400',
                        lineHeight: '150%',
                        opacity: 0.7,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatEventDateShort(event.dataInicio)}
                    </span>
                  </div>
                )}

                {event.dataInicio && (
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <Clock size={16} color="#595959" style={{ opacity: 0.7 }} />
                    <span 
                      style={{
                        color: '#595959',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: '400',
                        lineHeight: '150%',
                        opacity: 0.7,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatEventTime(event.dataInicio)}
                      {event.dataFim && ` - ${formatEventTime(event.dataFim)}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Participants Badge */}
              {vagasTotal > 0 && (
                <div 
                  className="flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(26, 26, 26, 0.75)',
                    backdropFilter: 'blur(100px)',
                    borderRadius: '200px',
                    padding: '4px 8px',
                    height: '25px',
                    gap: '8px'
                  }}
                >
                  <Users size={16} color="#F1F5F9" />
                  <span 
                    style={{
                      color: '#F1F5F9',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '150%',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ fontWeight: '700' }}>{vagasOcupadas}</span>
                    <span style={{ color: '#CBD5E1' }}> / {vagasTotal}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {event.descricao && (
            <p 
              style={{
                color: '#595959',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '150%',
                height: '96px',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {event.descricao}
            </p>
          )}

          {/* GuestBar */}
          <GuestBar />

          {/* Participants Info */}
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <div className="flex items-center" style={{ gap: '4px' }}>
              {/* Avatares simulados */}
              <div className="flex" style={{ width: '60px', height: '30px', position: 'relative' }}>
                <div 
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#E2E8F0',
                    position: 'absolute',
                    left: 0,
                    border: '2px solid white'
                  }}
                />
                <div 
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#CBD5E1',
                    position: 'absolute',
                    left: '15px',
                    border: '2px solid white'
                  }}
                />
                <div 
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#94A3B8',
                    position: 'absolute',
                    left: '30px',
                    border: '2px solid white'
                  }}
                />
              </div>
              <p 
                style={{
                  color: 'var(--content-content-text-tertiary, #64748B)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: '500',
                  lineHeight: '139.9999976158142%',
                  margin: 0
                }}
              >
                Abel, Pedro e {vagasOcupadas > 2 ? vagasOcupadas - 2 : 0} pessoas já se registraram.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col" style={{ gap: '24px', paddingTop: '0' }}>
            <div 
              className="flex items-center"
              style={{
                backgroundColor: '#F2F2F2',
                borderRadius: '200px',
                minHeight: '64px',
                padding: '8px 12px 8px 24px',
                gap: '8px'
              }}
            >
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: Implementar inscrição
                  console.log('Participar no evento:', event.id);
                  onClose();
                }}
                className="flex-shrink-0"
              >
                Participar
              </Button>
              
              {vagasDisponiveis > 0 && (
                <p 
                  style={{
                    color: '#595959',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400',
                    lineHeight: '16.8px',
                    margin: 0,
                    flex: 1
                  }}
                >
                  <span style={{ fontWeight: '700' }}>Faltam {vagasDisponiveis} vagas.</span>
                  <span> Não fiques de fora!</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div 
          className="relative flex-shrink-0 hidden md:block"
          style={{
            width: '421px',
            minHeight: '650px',
            height: '100%'
          }}
        >
          {event.imagem ? (
            <Image
              src={event.imagem}
              alt={event.nome}
              fill
              className="object-cover"
              style={{ borderRadius: '0 32px 32px 0' }}
            />
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#E2E8F0',
                borderRadius: '0 32px 32px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#CBD5E1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Calendar size={40} color="#64748B" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDialog;

