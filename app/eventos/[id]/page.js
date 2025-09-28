import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventById } from '@/lib/repositories/events';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import OdsBadge from '@/components/OdsBadge';
import LeafletMap from '@/components/LeafletMap';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  Share2
} from 'lucide-react';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

export default async function EventPage({ params }) {
  const event = await getEventById(params.id);

  if (!event || !event.visivel) {
    notFound();
  }

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
      weekday: 'long',
      day: '2-digit',
      month: 'long',
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/eventos" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos eventos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              {/* Event Image */}
              {event.imagem && (
                <div className="relative h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={event.imagem}
                    alt={event.nome}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Event Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge color={getEventTypeColor(event.tipo)}>
                    {getEventTypeLabel(event.tipo)}
                  </Badge>
                  <Badge color={status.color}>
                    {status.text}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 p-2">
                  {event.nome}
                </h1>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {event.descricao}
                </p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date & Time */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data e Horário</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{formatDate(startDate)}</div>
                        {endDate && endDate.toDateString() !== startDate.toDateString() && (
                          <div className="text-sm">até {formatDate(endDate)}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">
                          {formatTime(startDate)}
                          {endDate && ` - ${formatTime(endDate)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Localização</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>{event.localizacao}</span>
                  </div>
                </div>

                {/* Participants */}
                {event.maxParticipantes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Participantes</h3>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3" />
                      <span>Máximo {event.maxParticipantes} participantes</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ODS */}
              {odsList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Objetivos de Desenvolvimento Sustentável
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {odsList.map(ods => (
                      <OdsBadge
                        key={ods.id}
                        numero={ods.numero}
                        nome={ods.nome}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Areas */}
              {areasList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Áreas de Atuação</h3>
                  <div className="flex flex-wrap gap-2">
                    {areasList.map((area, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Map */}
            {event.latitude && event.longitude && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização no Mapa</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <LeafletMap
                    latitude={event.latitude}
                    longitude={event.longitude}
                    title={event.nome}
                    description={event.localizacao}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration CTA */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participar</h3>
              
              {event.linkInscricao && event.inscricoesAbertas && !isPast ? (
                <Button
                  as="a"
                  href={event.linkInscricao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mb-3"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Inscrever-me
                </Button>
              ) : (
                <div className="text-center py-4">
                  <Badge color={status.color} size="lg">
                    {status.text}
                  </Badge>
                </div>
              )}

              {event.linkEvento && event.tipo !== 'PRESENCIAL' && (
                <Button
                  as="a"
                  href={event.linkEvento}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="w-full"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Aceder ao evento
                </Button>
              )}
            </Card>

            {/* NGO Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizado por</h3>
              
              <Link href={`/ongs/${event.ngo.id}`} className="block hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
                    {event.ngo.logo ? (
                      <Image
                        src={event.ngo.logo}
                        alt={`Logo ${event.ngo.nome}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 font-semibold">
                        {event.ngo.nome.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.ngo.nome}</h4>
                    <p className="text-sm text-gray-600">{event.ngo.localizacao}</p>
                  </div>
                </div>
              </Link>

              <div className="space-y-2 mt-4">
                {event.ngo.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${event.ngo.email}`} className="hover:text-gray-900">
                      {event.ngo.email}
                    </a>
                  </div>
                )}
                
                {event.ngo.telefone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${event.ngo.telefone}`} className="hover:text-gray-900">
                      {event.ngo.telefone}
                    </a>
                  </div>
                )}
                
                {event.ngo.websiteUrl && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={event.ngo.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gray-900"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              <Button
                as={Link}
                href={`/ongs/${event.ngo.id}`}
                variant="outline"
                className="w-full mt-4"
              >
                Ver perfil da ONG
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}








