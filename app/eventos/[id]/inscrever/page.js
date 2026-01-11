'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import AddGuestsModal from '@/components/AddGuestsModal';

export default function EventInscricaoPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const [vagasInfo, setVagasInfo] = useState({
    total: 0,
    ocupadas: 0,
    disponiveis: 0,
    hasLimit: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadEventData();
  }, [params.id]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do evento
      const eventResponse = await fetch(`/api/events/${params.id}`);
      const eventData = await eventResponse.json();
      if (eventData.success && eventData.data) {
        setEvent(eventData.data);
      }
      
      // Buscar informações de vagas
      const vagasResponse = await fetch(`/api/events/${params.id}/vagas`);
      const vagasData = await vagasResponse.json();
      if (vagasData.success && vagasData.data) {
        setVagasInfo(vagasData.data);
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
    } finally {
      setLoading(false);
    }
  };

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
        // Redirecionar para a página do evento após sucesso
        router.push(`/eventos/${event.id}`);
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

  const handleGuestsSelected = (colaboradores) => {
    setSelectedGuests(colaboradores);
  };

  const handleRemoveGuest = (guestId) => {
    setSelectedGuests(prev => prev.filter(g => g.id !== guestId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Evento não encontrado</p>
      </div>
    );
  }

  const vagasDisponiveis = vagasInfo.disponiveis !== null ? vagasInfo.disponiveis : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <Link 
          href={`/eventos/${event.id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao evento
        </Link>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Inscrever-se no evento: {event.nome}
        </h1>

        {/* Div Adicionar convidados */}
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              alignItems: 'flex-start',
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <div 
              style={{
                backgroundColor: 'rgb(242, 242, 242)',
                borderBottom: '2px solid rgb(0, 134, 255)',
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '8px',
                borderRadius: '8px 8px 0px 0px',
                width: '100%'
              }}
            >
              <p 
                style={{
                  flex: '1 0 0px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  margin: '0px',
                  color: 'rgb(89, 89, 89)',
                  fontSize: '14px',
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap'
                }}
              >
                Adicionar convidados
              </p>
            </div>
          </button>

          {/* Lista de convidados selecionados */}
          {selectedGuests.length > 0 && (
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
                Convidados selecionados ({selectedGuests.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedGuests.map((guest) => (
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
                      onClick={() => handleRemoveGuest(guest.id)}
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
        </div>

        {/* Div com botão Participar e mensagem de vagas */}
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
              gap: '8px',
              backgroundColor: '#0086FF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {isParticipating ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <div>A participar...</div>
              </>
            ) : (
              <div>Participar</div>
            )}
          </button>

          {vagasInfo.hasLimit && vagasDisponiveis !== null && vagasDisponiveis > 0 && (
            <p 
              className="faltam-vagas-n-o"
              style={{
                marginTop: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#595959'
              }}
            >
              <span style={{ fontWeight: '400' }}>Faltam {vagasDisponiveis} {vagasDisponiveis === 1 ? 'vaga' : 'vagas'}.</span>
              <span style={{ fontWeight: '600' }}> Não fiques de fora!</span>
            </p>
          )}
          {vagasInfo.hasLimit && vagasDisponiveis !== null && vagasDisponiveis === 0 && (
            <p 
              className="faltam-vagas-n-o"
              style={{
                marginTop: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#595959',
                fontWeight: '400'
              }}
            >
              Evento lotado.
            </p>
          )}
        </div>

        <AddGuestsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventoId={event.id}
          onAddGuests={handleGuestsSelected}
        />
      </div>
    </div>
  );
}
