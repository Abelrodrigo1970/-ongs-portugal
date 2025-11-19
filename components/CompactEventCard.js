import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const CompactEventCard = ({ event, className = '' }) => {
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

  // Calcular vagas disponíveis
  // Como a tabela inscricoes não existe, usamos valores simulados para demonstração
  const vagasTotal = event.maxParticipantes || 0;
  // Simular inscrições (10 inscritos como exemplo fixo)
  const vagasOcupadas = vagasTotal > 0 ? 10 : 0;
  const vagasDisponiveis = vagasTotal - vagasOcupadas;

  return (
    <Card 
      className={`hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
      style={{ 
        backgroundColor: '#f8fafc',
        borderColor: '#cbd5e1',
        borderRadius: '36px',
        borderWidth: '1px',
        borderStyle: 'solid',
        width: '310px'
      }}
    >
      <Link href={`/eventos/${event.id}`} className="block">
        <div className="flex flex-col">
          {/* Event Image with Badge */}
          <div className="relative w-full" style={{ height: '120px' }}>
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
            
            {/* Badge de Vagas */}
            {vagasTotal > 0 && (
              <div 
                className="absolute flex flex-col"
                style={{
                  top: '13.33%',
                  left: '66.34%',
                  width: '28.43%',
                  height: '20.83%',
                  backgroundColor: '#ebf2ff',
                  borderRadius: '200px',
                  padding: '4px 8px',
                  gap: '8px'
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  <Users className="h-4 w-4 flex-shrink-0" style={{ color: '#155dfc', width: '16px', height: '16px' }} />
                  <p 
                  style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: '#155dfc',
                    fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '16.8px',
                      margin: 0,
                      whiteSpace: 'nowrap'
                  }}
                >
                    <span style={{ fontWeight: '700' }}>{vagasOcupadas}</span>
                    <span style={{ fontWeight: '500' }}> </span>
                    <span style={{ color: '#a3a3a3', fontWeight: '500' }}>/ {vagasTotal}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div 
            className="flex flex-col" 
            style={{ 
              gap: '16px',
              paddingTop: '8px',
              paddingBottom: '24px',
              paddingLeft: '24px',
              paddingRight: '24px'
            }}
          >
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {/* Title */}
              <h3 
                className="font-bold whitespace-pre-wrap" 
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#020617',
                  fontSize: '20px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  height: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                {event.nome}
              </h3>
              
              {/* Location and Date/Time */}
              <div className="flex flex-col" style={{ gap: '4px' }}>
                {/* Location (separate line) */}
                {(event.localizacao || event.ngo?.localizacao) && (
                  <div className="flex items-start" style={{ gap: '8px' }}>
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#595959', opacity: 0.7, width: '16px', height: '16px' }} />
                    <span 
                      style={{ 
                          fontFamily: 'Inter, sans-serif',
                        color: '#595959',
                        fontSize: '14px',
                          fontWeight: '400',
                          lineHeight: '1.5',
                          opacity: 0.7,
                          marginTop: '-1px',
                          whiteSpace: 'nowrap'
                      }}
                    >
                        {event.localizacao || event.ngo?.localizacao}
                    </span>
                    </div>
                  </div>
                )}

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
                          marginTop: '-1px',
                          whiteSpace: 'nowrap'
                      }}
                    >
                        {formatEventDate(event.dataInicio)}
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
                          marginTop: '-1px',
                          whiteSpace: 'nowrap'
                      }}
                    >
                        {formatEventTime(event.dataInicio)}
                    </span>
                    </div>
                  </div>
                )}
            </div>

            {/* Description */}
            {event.descricao && (
                <p 
                  className="font-normal whitespace-pre-wrap" 
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: '#595959',
                    fontSize: '16px',
                    fontWeight: '400',
                    lineHeight: '1.5'
                  }}
                >
                  {event.descricao}
                </p>
            )}
            </div>

            {/* Button */}
            <div 
              className="flex items-center justify-center"
              style={{
                backgroundColor: '#155dfc',
                borderRadius: '100px',
                padding: '8px 16px',
                cursor: 'pointer',
                width: '100%',
                gap: '16px'
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '500',
                  lineHeight: 'normal',
                  marginTop: '-1px',
                  whiteSpace: 'nowrap'
                }}
              >
                Quero colaborar
              </span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CompactEventCard;
