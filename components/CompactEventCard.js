import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const CompactEventCard = ({ event, className = '' }) => {
  // Função para formatar data
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
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
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(64, 64, 64, 0.15)',
        borderRadius: '32px',
        borderWidth: '1px'
      }}
    >
      <Link href={`/eventos/${event.id}`} className="block">
        <div className="flex flex-col" style={{ gap: '16px' }}>
          {/* Event Image with Badge */}
          <div className="relative" style={{ height: '250px' }}>
            {event.imagem ? (
              <Image
                src={event.imagem}
                alt={event.nome}
                fill
                className="object-cover"
                style={{ borderRadius: '32px 32px 0 0' }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center" 
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '32px 32px 0 0'
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
                className="absolute flex items-center gap-2"
                style={{
                  top: '14px',
                  right: '14px',
                  backgroundColor: '#C4D6FF',
                  borderRadius: '200px',
                  padding: '4px 8px'
                }}
              >
                <Users className="h-4 w-4" style={{ color: 'var(--color-button-primary)' }} />
                <span 
                  style={{ 
                    color: 'var(--color-button-primary)',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '1.2'
                  }}
                >
                  {vagasOcupadas} / {vagasTotal}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col" style={{ gap: '16px' }}>
            {/* Title and Info */}
            <div className="flex flex-col" style={{ gap: '8px', padding: '0 16px' }}>
              <h3 
                className="line-clamp-2" 
                style={{ 
                  color: '#404040',
                  fontSize: '18px',
                  fontWeight: '700',
                  lineHeight: '1.4',
                  minHeight: '50px'
                }}
              >
                {event.nome}
              </h3>
              
              {/* Event Info */}
              <div className="flex flex-wrap items-center" style={{ gap: '8px' }}>
                {/* Location */}
                {event.localizacao && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#595959', opacity: 0.7 }} />
                    <span 
                      style={{ 
                        color: '#595959',
                        fontSize: '14px',
                        fontWeight: '500',
                        lineHeight: '1.2',
                        opacity: 0.7
                      }}
                    >
                      {event.localizacao}
                    </span>
                  </div>
                )}

                {/* Time */}
                {event.dataInicio && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#595959', opacity: 0.7 }} />
                    <span 
                      style={{ 
                        color: '#595959',
                        fontSize: '14px',
                        fontWeight: '500',
                        lineHeight: '1.2',
                        opacity: 0.7
                      }}
                    >
                      {formatEventTime(event.dataInicio)}
                    </span>
                  </div>
                )}

                {/* Date */}
                {event.dataInicio && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#595959', opacity: 0.7 }} />
                    <span 
                      style={{ 
                        color: '#595959',
                        fontSize: '14px',
                        fontWeight: '500',
                        lineHeight: '1.2',
                        opacity: 0.7
                      }}
                    >
                      {formatEventDate(event.dataInicio)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.descricao && (
              <div style={{ padding: '0 16px' }}>
                <p 
                  className="line-clamp-2" 
                  style={{ 
                    color: '#595959',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}
                >
                  {event.descricao}
                </p>
              </div>
            )}

            {/* Button */}
            <div className="flex flex-col" style={{ gap: '8px', padding: '0 16px 16px 16px' }}>
              <div 
                className="flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--color-button-primary)',
                  borderRadius: '100px',
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
              >
                <span 
                  style={{ 
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '500',
                    lineHeight: '1.2'
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
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CompactEventCard;
