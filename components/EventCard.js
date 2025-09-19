import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import OdsBadge from './OdsBadge';
import Badge from './ui/Badge';
import { MapPin, Calendar, Clock, Users, ExternalLink } from 'lucide-react';

const EventCard = ({ event, className = '' }) => {
  const odsList = event.ods?.map(eventods => eventods.ods) || [];
  const areasList = event.areas?.map(area => area.tipo.nome) || [];
  
  // Format dates
  const startDate = new Date(event.dataInicio);
  const endDate = event.dataFim ? new Date(event.dataFim) : null;
  const now = new Date();
  
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && (!endDate || endDate >= now);
  const isPast = endDate ? endDate < now : startDate < now;

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    if (!event.inscricoesAbertas) {
      return { text: 'Inscrições Encerradas', color: 'gray' };
    }
    if (isPast) {
      return { text: 'Finalizado', color: 'gray' };
    }
    if (isOngoing) {
      return { text: 'Em Curso', color: 'green' };
    }
    if (isUpcoming) {
      return { text: 'Inscrições Abertas', color: 'blue' };
    }
    return { text: 'Disponível', color: 'blue' };
  };

  const getEventTypeColor = (tipo) => {
    switch (tipo) {
      case 'PRESENCIAL':
        return 'blue';
      case 'REMOTO':
        return 'green';
      case 'HIBRIDO':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getEventTypeLabel = (tipo) => {
    switch (tipo) {
      case 'PRESENCIAL':
        return 'Presencial';
      case 'REMOTO':
        return 'Remoto';
      case 'HIBRIDO':
        return 'Híbrido';
      default:
        return tipo;
    }
  };

  const status = getEventStatus();

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link href={`/eventos/${event.id}`} className="block">
        <div className="flex flex-col h-full">
          {/* Event Image */}
          {event.imagem && (
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={event.imagem}
                alt={event.nome}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge color={status.color} size="sm">
                  {status.text}
                </Badge>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-grow">
            {/* Event Type & Status */}
            <div className="flex items-center justify-between mb-2">
              <Badge color={getEventTypeColor(event.tipo)} size="sm">
                {getEventTypeLabel(event.tipo)}
              </Badge>
              {!event.imagem && (
                <Badge color={status.color} size="sm">
                  {status.text}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {event.nome}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {event.descricao}
            </p>

            {/* NGO Info */}
            <div className="flex items-center mb-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-2">
                {event.ngo?.logo ? (
                  <Image
                    src={event.ngo.logo}
                    alt={`Logo ${event.ngo.nome}`}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold">
                    {event.ngo?.nome?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="truncate">{event.ngo?.nome}</span>
            </div>

            {/* Date & Time */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(startDate)}
                  {endDate && endDate.toDateString() !== startDate.toDateString() && 
                    ` - ${formatDate(endDate)}`
                  }
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {formatTime(startDate)}
                  {endDate && ` - ${formatTime(endDate)}`}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{event.localizacao}</span>
            </div>

            {/* Max Participants */}
            {event.maxParticipantes && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Users className="h-4 w-4 mr-2" />
                <span>Máximo {event.maxParticipantes} participantes</span>
              </div>
            )}

            {/* ODS Badges */}
            {odsList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {odsList.slice(0, 3).map(ods => (
                    <OdsBadge
                      key={ods.id}
                      numero={ods.numero}
                      nome={ods.nome}
                      size="sm"
                    />
                  ))}
                  {odsList.length > 3 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      +{odsList.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Areas */}
            {areasList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {areasList.slice(0, 2).map((area, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                  {areasList.length > 2 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      +{areasList.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Ver detalhes
              </span>
              {event.linkInscricao && event.inscricoesAbertas && !isPast && (
                <div className="flex items-center text-sm text-primary-600">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span>Inscrever</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default EventCard;


