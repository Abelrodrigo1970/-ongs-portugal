'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, Clock, Users, Loader2, User } from 'lucide-react';
import GuestBar from './GuestBar';
import './EventDialog.css';

const EventDialog = ({ isOpen, onClose, event }) => {
  const [vagasInfo, setVagasInfo] = useState({
    total: 0,
    ocupadas: 0,
    disponiveis: 0,
    hasLimit: false
  });
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantes, setParticipantes] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchVagas = async () => {
      if (!isOpen || !event?.id) {
        return;
      }

      try {
        const response = await fetch(`/api/events/${event.id}/vagas`);
        const data = await response.json();

        if (data.success && data.data) {
          setVagasInfo(data.data);
        } else {
          // Fallback: usar dados do evento se disponível
          const total = event.maxParticipantes || 0;
          const ocupadas = event.inscricoes?.length || 0;
          setVagasInfo({
            total,
            ocupadas,
            disponiveis: total > 0 ? Math.max(0, total - ocupadas) : null,
            hasLimit: total > 0
          });
        }
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        // Fallback em caso de erro
        const total = event.maxParticipantes || 0;
        setVagasInfo({
          total,
          ocupadas: 0,
          disponiveis: total,
          hasLimit: total > 0
        });
      }
    };

    if (isOpen && event?.id) {
      fetchVagas();
    }
  }, [isOpen, event?.id]);

  // Limpar convidados selecionados e mensagem quando fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedGuests([]);
      setSuccessMessage('');
    }
  }, [isOpen]);

  // Buscar participantes registrados
  useEffect(() => {
    const fetchParticipantes = async () => {
      if (!isOpen || !event?.id) {
        return;
      }

      try {
        const response = await fetch(`/api/inscricoes?eventoId=${event.id}`);
        const data = await response.json();

        if (data.success && data.data) {
          // Buscar avatares dos colaboradores pelos emails
          const participantesComAvatares = await Promise.all(
            data.data.slice(0, 3).map(async (inscricao) => {
              try {
                // Tentar buscar colaborador pelo email usando query
                const colaboradorResponse = await fetch(
                  `/api/colaboradores/search?query=${encodeURIComponent(inscricao.emailColaborador)}`
                );
                const colaboradorData = await colaboradorResponse.json();
                
                // Procurar colaborador com email exato (buscar o primeiro resultado, pois a busca pode retornar múltiplos)
                const colaborador = colaboradorData.colaboradores?.find(
                  (c) => c.email?.toLowerCase() === inscricao.emailColaborador?.toLowerCase()
                ) || colaboradorData.colaboradores?.[0];
                
                return {
                  nome: inscricao.nomeColaborador,
                  email: inscricao.emailColaborador,
                  avatar: colaborador?.avatar || null
                };
              } catch (error) {
                console.error('Erro ao buscar colaborador:', error);
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
  }, [isOpen, event?.id]);

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

  // Usar dados reais de vagas
  const vagasTotal = vagasInfo.total;
  const vagasOcupadas = vagasInfo.ocupadas;
  const vagasDisponiveis = vagasInfo.disponiveis !== null ? vagasInfo.disponiveis : null;

  // Obter localização completa
  const localizacao = event.morada || event.localizacao || event.ngo?.localizacao || '';

  // Função para participar no evento (inserir na tabela)
  const handleParticipar = async () => {
    if (!event?.id) {
      console.error('ID do evento não encontrado');
      return;
    }

    setIsParticipating(true);

    try {
      // Inserir o próprio colaborador se houver (do localStorage)
      let colaboradorAtual = null;
      if (typeof window !== 'undefined') {
        const savedColaborador = localStorage.getItem('colaborador');
        if (savedColaborador) {
          try {
            colaboradorAtual = JSON.parse(savedColaborador);
          } catch (error) {
            console.error('Erro ao carregar colaborador:', error);
          }
        }
      }

      // Lista de todos os colaboradores para inscrever (incluindo o próprio)
      const colaboradoresParaInscricao = [];
      
      if (colaboradorAtual) {
        colaboradoresParaInscricao.push({
          nome: colaboradorAtual.nome,
          email: colaboradorAtual.email
        });
      }

      // Adicionar convidados selecionados
      selectedGuests.forEach(guest => {
        colaboradoresParaInscricao.push({
          nome: guest.nome,
          email: guest.email
        });
      });

      // Criar inscrições para todos os colaboradores
      const promises = colaboradoresParaInscricao.map(async (colaborador) => {
        try {
          const response = await fetch('/api/inscricoes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              eventoId: event.id,
              nomeColaborador: colaborador.nome,
              emailColaborador: colaborador.email,
              telefone: null,
              mensagem: null
            })
          });

          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            console.error('Erro ao fazer parse da resposta:', parseError);
            const text = await response.text().catch(() => 'Erro desconhecido');
            return {
              colaborador,
              success: false,
              error: `Erro do servidor (${response.status}): ${text}`,
              status: response.status
            };
          }
          
          return {
            colaborador,
            success: response.ok,
            error: response.ok ? null : (data.error || data.details || 'Erro desconhecido'),
            status: response.status
          };
        } catch (error) {
          console.error('Erro ao processar inscrição:', error);
          return {
            colaborador,
            success: false,
            error: error.message || 'Erro de conexão',
            status: 0
          };
        }
      });

      const results = await Promise.all(promises);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        // Mostrar mensagem de sucesso
        setSuccessMessage('Convidado Adicionado com Sucesso');
        
        // Limpar convidados selecionados
        setSelectedGuests([]);
        
        // Recarregar vagas e participantes
        const fetchVagas = async () => {
          try {
            const response = await fetch(`/api/events/${event.id}/vagas`);
            const data = await response.json();
            if (data.success && data.data) {
              setVagasInfo(data.data);
            }
          } catch (error) {
            console.error('Erro ao recarregar vagas:', error);
          }
        };
        
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
                    console.error('Erro ao buscar colaborador:', error);
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
            console.error('Erro ao recarregar participantes:', error);
          }
        };
        
        await Promise.all([fetchVagas(), fetchParticipantes()]);
        
        // Remover mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        console.error('Erro ao participar no evento:', failed);
        alert('Erro ao participar no evento. Verifique se já não está inscrito.');
      }
    } catch (err) {
      console.error('Error participating in event:', err);
      alert('Erro ao participar no evento. Tente novamente.');
    } finally {
      setIsParticipating(false);
    }
  };

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

                  {vagasInfo.hasLimit && (
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

            <GuestBar 
              className="guest-bar-instance" 
              event={event}
              selectedGuests={selectedGuests}
              onSelectedGuestsChange={setSelectedGuests}
            />
            
            <div className="frame-4">
              <div className="frame-4">
                <div className="frame-12">
                  {/* Mensagem de sucesso */}
                  {successMessage && (
                    <div 
                      style={{
                        marginBottom: '12px',
                        padding: '12px 16px',
                        backgroundColor: '#10B981',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {successMessage}
                    </div>
                  )}
                  <div className="frame-13">
                    {/* Avatares sobrepostos */}
                    <div 
                      className="group"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        height: '30px',
                        width: participantes.length > 0 ? `${32 + (participantes.length - 1) * 24}px` : '60px'
                      }}
                    >
                      {participantes.length > 0 ? (
                        participantes.map((participante, index) => (
                          <div
                            key={index}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              border: '2px solid white',
                              backgroundColor: '#E2E8F0',
                              left: `${index * 24}px`,
                              position: 'absolute',
                              top: 0,
                              zIndex: participantes.length - index,
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {participante.avatar ? (
                              <Image
                                src={participante.avatar}
                                alt={participante.nome}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <User size={16} color="#64748B" />
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="ellipse" />
                          <div className="ellipse-2" />
                          <div className="ellipse-3" />
                        </>
                      )}
                    </div>

                    {/* Texto com nomes e contagem */}
                    <p className="text-wrapper-6">
                      {vagasOcupadas > 0 ? (
                        participantes.length > 0 ? (
                          (() => {
                            // Mostrar apenas os 2 primeiros nomes
                            const primeirosNomes = participantes.map(p => p.nome).slice(0, 2);
                            // Calcular restantes: total de inscrições - 2 nomes mostrados
                            const restantes = vagasOcupadas - 2;
                            if (restantes > 0) {
                              return `${primeirosNomes.join(', ')} e ${restantes} ${restantes === 1 ? 'pessoa' : 'pessoas'} já se registraram.`;
                            } else {
                              // Se não há restantes, mostrar apenas os nomes (pode ser 1 ou 2)
                              return `${primeirosNomes.join(', ')} ${primeirosNomes.length === 1 ? 'já se registrou' : 'já se registraram'}.`;
                            }
                          })()
                        ) : (
                          `${vagasOcupadas} ${vagasOcupadas === 1 ? 'pessoa já se registrou' : 'pessoas já se registraram'}.`
                        )
                      ) : (
                        'Ainda não há inscrições neste evento.'
                      )}
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
                onClick={handleParticipar}
                disabled={isParticipating}
                style={{
                  opacity: isParticipating ? 0.7 : 1,
                  cursor: isParticipating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isParticipating ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <div className="button-text">A participar...</div>
                  </>
                ) : (
                  <div className="button-text">Participar</div>
                )}
              </button>

              {vagasInfo.hasLimit && vagasDisponiveis !== null && vagasDisponiveis > 0 && (
                <p className="faltam-vagas-n-o">
                  <span className="text-wrapper-7">Faltam {vagasDisponiveis} {vagasDisponiveis === 1 ? 'vaga' : 'vagas'}.</span>
                  <span className="text-wrapper-8"> Não fiques de fora!</span>
                </p>
              )}
              {vagasInfo.hasLimit && vagasDisponiveis !== null && vagasDisponiveis === 0 && (
                <p className="faltam-vagas-n-o">
                  <span className="text-wrapper-7">Evento lotado.</span>
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
