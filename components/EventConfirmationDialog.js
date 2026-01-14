'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ArrowLeft, Calendar, Clock, Users, CalendarPlus, ArrowRight } from 'lucide-react';
import './EventConfirmationDialog.css';

const EventConfirmationDialog = ({ isOpen, onClose, onBack, event, inscritos }) => {
  const [participantes, setParticipantes] = useState([]);

  useEffect(() => {
    if (isOpen && event?.id) {
      // Buscar participantes para mostrar avatares
      const fetchParticipantes = async () => {
        try {
          const response = await fetch(`/api/inscricoes?eventoId=${event.id}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            const participantesComAvatares = await Promise.all(
              data.data.slice(0, 3).map(async (inscricao) => {
                try {
                  const colaboradorResponse = await fetch(
                    `/api/colaboradores/search?query=${encodeURIComponent(inscricao.emailColaborador)}`
                  );
                  const colaboradorData = await colaboradorResponse.json();
                  const colaborador = colaboradorData.colaboradores?.find(
                    (c) => c.email?.toLowerCase() === inscricao.emailColaborador?.toLowerCase()
                  ) || colaboradorData.colaboradores?.[0];
                  
                  return {
                    nome: inscricao.nomeColaborador,
                    email: inscricao.emailColaborador,
                    avatar: colaborador?.avatar || null
                  };
                } catch (error) {
                  return {
                    nome: inscricao.nomeColaborador,
                    email: inscricao.emailColaborador,
                    avatar: null
                  };
                }
              })
            );
            setParticipantes(participantesComAvatares);
          }
        } catch (error) {
          console.error('Erro ao buscar participantes:', error);
        }
      };

      fetchParticipantes();
    }
  }, [isOpen, event?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const endDate = event.dataFim ? new Date(event.dataFim) : null;
    const startTime = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate ? endDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : null;
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };

  const handleAddToCalendar = () => {
    if (!event.dataInicio || !event.dataFim) return;
    
    const startDate = new Date(event.dataInicio);
    const endDate = new Date(event.dataFim);
    const formatDate = (date) => {
      return date.toISOString().replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z';
    };

    const eventTitle = encodeURIComponent(event.nome || 'Evento');
    const eventLocation = encodeURIComponent(event.morada || event.localizacao || '');
    const eventDescription = encodeURIComponent(event.descricao || '');
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${start}/${end}&details=${eventDescription}&location=${eventLocation}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleGoToDashboard = () => {
    if (typeof window !== 'undefined') {
      const colaboradorData = localStorage.getItem('colaborador');
      if (colaboradorData) {
        try {
          const colaborador = JSON.parse(colaboradorData);
          if (colaborador.empresaId) {
            window.location.href = `/empresas/dashboard/${colaborador.empresaId}`;
          } else {
            window.location.href = '/empresas';
          }
        } catch (error) {
          window.location.href = '/empresas';
        }
      } else {
        window.location.href = '/empresas';
      }
    }
  };

  const localizacao = event?.morada || event?.localizacao || event?.ngo?.localizacao || 'Localização não especificada';
  const totalParticipantes = inscritos || participantes.length || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="dialog-confirmation" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-confirmation-content">
          {/* Header */}
          <div className="dialog-confirmation-heading">
            <button onClick={onBack} className="icon-button">
              <ArrowLeft className="icon-instance-node" />
            </button>
            <div className="close-wrapper">
              <button onClick={onClose} className="icon-button">
                <X className="icon-instance-node" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="dialog-confirmation-main">
            {/* Title */}
            <h1 className="dialog-confirmation-title">Participação confirmada!</h1>
            <p className="dialog-confirmation-subtitle">Para gerir os teus eventos, aceda ao dashboard.</p>

            {/* Event Details Card */}
            <div className="dialog-confirmation-card">
              <h2 className="dialog-confirmation-event-title">{event?.nome || 'Evento'}</h2>
              <p className="dialog-confirmation-location">{localizacao}</p>
              
              <div className="dialog-confirmation-details">
                <div className="dialog-confirmation-detail-item">
                  <Calendar className="dialog-confirmation-icon" size={16} />
                  <span className="dialog-confirmation-detail-text">
                    {event?.dataInicio ? formatDate(event.dataInicio) : ''}
                  </span>
                </div>
                <div className="dialog-confirmation-detail-item">
                  <Clock className="dialog-confirmation-icon" size={16} />
                  <span className="dialog-confirmation-detail-text">
                    {event?.dataInicio ? formatTime(event.dataInicio) : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Participants Section */}
            {totalParticipantes > 0 && (
              <div className="dialog-confirmation-participants">
                <div className="dialog-confirmation-avatars">
                  {participantes.slice(0, 3).map((p, index) => (
                    <div key={index} className="dialog-confirmation-avatar" style={{ left: `${index * 15}px`, zIndex: 3 - index }}>
                      {p.avatar ? (
                        <Image
                          src={p.avatar}
                          alt={p.nome}
                          width={30}
                          height={30}
                          style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid white'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: '#E2E8F0',
                          border: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748B',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {p.nome?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="dialog-confirmation-participants-text">
                  {participantes.length > 0 ? (
                    (() => {
                      const primeirosNomes = participantes.map(p => p.nome).slice(0, 2);
                      const restantes = totalParticipantes - 2;
                      if (restantes > 0) {
                        return `${primeirosNomes.join(', ')} e ${restantes} ${restantes === 1 ? 'pessoa' : 'pessoas'} já se registraram.`;
                      } else {
                        return `${primeirosNomes.join(', ')} ${primeirosNomes.length === 1 ? 'já se registrou' : 'já se registraram'}.`;
                      }
                    })()
                  ) : (
                    `${totalParticipantes} ${totalParticipantes === 1 ? 'pessoa já se registrou' : 'pessoas já se registraram'}.`
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="dialog-confirmation-footer">
            <button onClick={handleAddToCalendar} className="dialog-confirmation-button">
              <span className="dialog-confirmation-button-text">Adicionar ao calendário</span>
              <CalendarPlus size={20} />
            </button>
            <button onClick={handleGoToDashboard} className="dialog-confirmation-button">
              <span className="dialog-confirmation-button-text">Ir para o dashboard</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventConfirmationDialog;
