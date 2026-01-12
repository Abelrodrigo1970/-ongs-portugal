'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ArrowLeft, ArrowRight, Search, Check, Calendar, Clock, Users } from 'lucide-react';
import './EventTeamDialog.css';

const EventTeamDialog = ({ isOpen, onClose, event, onBack }) => {
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);
  const [teamName, setTeamName] = useState('UNIVA team');
  const [participantes, setParticipantes] = useState([]);
  const [vagasInfo, setVagasInfo] = useState({
    total: 0,
    ocupadas: 0,
    disponiveis: 0,
    hasLimit: false
  });

  // Buscar empresaId do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const colaboradorData = localStorage.getItem('colaborador');
      if (colaboradorData) {
        try {
          const data = JSON.parse(colaboradorData);
          setEmpresaId(data.empresaId);
          if (data.empresaNome) {
            setTeamName(data.empresaNome);
          }
        } catch (e) {
          console.error('Erro ao parsear dados do colaborador:', e);
        }
      }
    }
  }, []);

  // Buscar membros da equipa
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!isOpen || !empresaId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/colaboradores/search?empresaId=${empresaId}&ativo=true&limit=100`);
        const data = await response.json();
        
        if (data.success && data.colaboradores) {
          setTeamMembers(data.colaboradores);
        }
      } catch (error) {
        console.error('Erro ao buscar membros da equipa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [isOpen, empresaId]);

  // Buscar vagas do evento
  useEffect(() => {
    const fetchVagas = async () => {
      if (!isOpen || !event?.id) return;
      
      try {
        const response = await fetch(`/api/events/${event.id}/vagas`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setVagasInfo(data.data);
        } else {
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

  // Buscar participantes registrados (apenas para mostrar no texto)
  useEffect(() => {
    const fetchParticipantes = async () => {
      if (!isOpen || !event?.id) return;
      
      try {
        const response = await fetch(`/api/inscricoes?eventoId=${event.id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const participantesComAvatares = await Promise.all(
            data.data.slice(0, 2).map(async (inscricao) => {
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
        console.error('Erro ao buscar participantes:', error);
      }
    };

    if (isOpen && event?.id) {
      fetchParticipantes();
    }
  }, [isOpen, event?.id]);

  // Filtrar membros pela pesquisa
  const filteredMembers = teamMembers.filter(member => 
    member.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle seleção individual
  const toggleMember = (memberId) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
    setSelectAll(newSelected.size === filteredMembers.length);
  };

  // Toggle selecionar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(filteredMembers.map(m => m.id));
      setSelectedMembers(allIds);
      setSelectAll(true);
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Formatar hora
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const endDate = event.dataFim ? new Date(event.dataFim) : null;
    const startTime = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate ? endDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : null;
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };

  const vagasOcupadas = vagasInfo.ocupadas;
  const vagasTotal = vagasInfo.total;
  const localizacao = event.morada || event.localizacao || event.ngo?.localizacao || 'Localização não especificada';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="dialog-team" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-box-heading">
          <button onClick={onBack} className="icon-button">
            <ArrowLeft className="icon-instance-node" />
          </button>
          <div className="close-wrapper">
            <button onClick={onClose} className="icon-button">
              <X className="icon-instance-node" />
            </button>
          </div>
        </div>
        <div className="div-2">
          {/* Left Content */}
          <div className="content">
            <div className="frame-2">
              <div className="div-3">
                <div className="frame-3">
                  <div className="frame-wrapper">
                    <div className="div-3">
                      <p className="p">{event.nome}</p>

                      <div className="event-and-NPO-name-wrapper">
                        <div className="event-and-NPO-name">
                          <p className="text-wrapper-2">{localizacao}</p>
                        </div>
                      </div>

                      <div className="frame-4">
                        <div className="div-wrapper">
                          <div className="frame-5">
                            {event.dataInicio && (
                              <div className="frame-6">
                                <Calendar className="img" size={16} />
                                <div className="text-wrapper-3">{formatDate(event.dataInicio)}</div>
                              </div>
                            )}
                            {event.dataInicio && (
                              <div className="frame-6">
                                <Clock className="img" size={16} />
                                <div className="text-wrapper-3">{formatTime(event.dataInicio)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="frame-7">
                    <div className="frame-8">
                      <Users className="img" size={16} color="#F1F5F9" />
                      <p className="element">
                        <span className="span">{vagasOcupadas} </span>
                        <span className="text-wrapper-4">/ </span>
                        <span className="span">{vagasTotal}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="div-3">
                  <div className="div-3">
                    <div className="frame-9">
                      <div className="frame-10">
                        <div className="group">
                          {/* Avatares placeholder - sempre mostrar os 3 placeholders conforme Figma */}
                          <div className="ellipse-2" />
                          <div className="ellipse-3" />
                          <div className="ellipse-4" />
                        </div>

                        {/* Texto com nomes e contagem */}
                        <p className="text-wrapper-5">
                          {vagasOcupadas > 0 ? (
                            participantes.length > 0 ? (
                              (() => {
                                const primeirosNomes = participantes.map(p => p.nome).slice(0, 2);
                                const restantes = vagasOcupadas - 2;
                                if (restantes > 0) {
                                  return `${primeirosNomes.join(', ')} e ${restantes} ${restantes === 1 ? 'pessoa' : 'pessoas'} já se registraram.`;
                                } else {
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

              <div className="button">
                <div className="div-2" />
                <div className="buttons">
                  <div className="button-box">
                    <button className="button-primary-instance">
                      <div className="button-text">Inscrever {selectedMembers.size} {selectedMembers.size === 1 ? 'pessoa' : 'pessoas'}</div>
                      <ArrowRight className="icon-instance-node" size={20} />
                    </button>
                    {vagasTotal > 0 && (
                      <p className="faltam-vagas-n-o">
                        <span className="text-wrapper-6">Faltam {Math.max(0, vagasTotal - vagasOcupadas)} vagas.</span>
                        <span className="text-wrapper-7"> Não fiques de fora!</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Team Selection */}
          <div className="frame-11">
            <div className="frame-12">
              <div className="text-wrapper-8">{teamName}</div>
              <div className="frame-6">
                <div className="text-wrapper-9">All team members</div>
                <div className="switch" onClick={handleSelectAll}>
                  <div className="handle">
                    <div className="target">
                      <div className="state-layer">
                        <div className={`handle-shape ${selectAll ? 'selected' : ''}`}>
                          <div className="container" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="frame-13">
              <Search className="icon-instance-node" size={16} />
              <input
                type="text"
                className="text-wrapper-10"
                placeholder="Search for team members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="frame-14">
              <div className="frame-15">
                <div className="frame-16">
                  {filteredMembers.slice(0, 10).map((member) => (
                    <div
                      key={member.id}
                      className={`frame-449 ${selectedMembers.has(member.id) ? 'selected' : ''}`}
                      onClick={() => toggleMember(member.id)}
                    >
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.nome}
                          width={40}
                          height={40}
                          className="ellipse-member"
                        />
                      ) : (
                        <div className="ellipse-member ellipse-placeholder">
                          <span>{member.nome?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                      )}
                      <div className="member-name">
                        {member.nome}
                      </div>
                      {selectedMembers.has(member.id) && (
                        <div className="check-icon">
                          <Check size={16} color="#fff" />
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredMembers.length > 10 && (
                    <div className="rectangle" />
                  )}
                </div>
              </div>

              <div className="frame-17">
                <div className="polygon" />
                <div className="rectangle-wrapper">
                  <div className="rectangle-2" />
                </div>
                <div className="polygon-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTeamDialog;
