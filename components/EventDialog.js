'use client';

import Image from 'next/image';
import { X, Calendar, Clock, Users } from 'lucide-react';
import GuestBar from './GuestBar';
import './EventDialog.css';

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

  // Obter localização completa
  const localizacao = event.morada || event.localizacao || event.ngo?.localizacao || '';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div className="dialog-volunteer" onClick={(e) => e.stopPropagation()}>
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

        <div className="div">
          <div className="frame-2">
            <div className="frame-3">
              <div className="frame-4">
                <p className="p">
                  {event.nome}
                </p>

                <div className="event-and-NPO-name-wrapper">
                  <div className="event-and-NPO-name">
                    <p className="text-wrapper-2">
                      {localizacao}
                    </p>
                  </div>
                </div>

                <div className="frame-5">
                  <div className="frame-6">
                    <div className="frame-7">
                      {event.dataInicio && (
                        <div className="frame-8">
                          <Calendar 
                            size={16} 
                            color="#595959" 
                            style={{ opacity: 0.7, width: '16px', height: '16px' }}
                          />
                          <div className="text-wrapper-3">{formatEventDateShort(event.dataInicio)}</div>
                        </div>
                      )}

                      {event.dataInicio && (
                        <div className="frame-8">
                          <Clock 
                            size={16} 
                            color="#595959" 
                            style={{ opacity: 0.7, width: '16px', height: '16px' }}
                          />
                          <div className="text-wrapper-3">
                            {formatEventTime(event.dataInicio)}
                            {event.dataFim && ` - ${formatEventTime(event.dataFim)}`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {vagasTotal > 0 && (
                    <div className="frame-9">
                      <div className="frame-10">
                        <div className="frame-11">
                          <Users size={16} color="#F1F5F9" style={{ width: '16px', height: '16px' }} />
                          <p className="element">
                            <span className="span">{vagasOcupadas} </span>
                            <span className="text-wrapper-4">/ </span>
                            <span className="span">{vagasTotal}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-wrapper-5">
                {event.descricao}
              </p>
            </div>

            <GuestBar className="guest-bar-instance" />
            
            <div className="frame-4">
              <div className="frame-4">
                <div className="frame-12">
                  <div className="frame-13">
                    <div className="group">
                      <div className="ellipse" />
                      <div className="ellipse-2" />
                      <div className="ellipse-3" />
                    </div>

                    <p className="text-wrapper-6">
                      Abel, Pedro e {vagasOcupadas > 2 ? vagasOcupadas - 2 : 0} pessoas já se registraram.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons">
            <div className="frame-14">
              <button
                className="button-primary"
                onClick={() => {
                  // TODO: Implementar inscrição
                  console.log('Participar no evento:', event.id);
                  onClose();
                }}
              >
                <div className="button-text">Participar</div>
              </button>

              {vagasDisponiveis > 0 && (
                <p className="faltam-vagas-n-o">
                  <span className="text-wrapper-7">Faltam {vagasDisponiveis} vagas.</span>
                  <span className="text-wrapper-8"> Não fiques de fora!</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="placeholder-image">
          {event.imagem ? (
            <Image
              src={event.imagem}
              alt={event.nome}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#E2E8F0',
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
