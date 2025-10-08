import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import { Calendar, MapPin, Users, Briefcase } from 'lucide-react';

const IniciativaCard = ({ iniciativa, className = '' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTipoApoio = (tipo) => {
    const tipos = {
      'TEMPO_VOLUNTARIADO': 'Voluntariado',
      'CONHECIMENTO_CAPACITACAO': 'Capacitação',
      'RECURSOS_SERVICOS': 'Serviços',
      'PRODUTOS_BENS': 'Produtos'
    };
    return tipos[tipo] || tipo;
  };

  const getStatusColor = (status) => {
    const colors = {
      'RASCUNHO': 'bg-gray-100 text-gray-800',
      'ATIVA': 'bg-green-100 text-green-800',
      'PAUSADA': 'bg-yellow-100 text-yellow-800',
      'CONCLUIDA': 'bg-blue-100 text-blue-800',
      'CANCELADA': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      <div className="p-4">
        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(iniciativa.status)}`}>
            {iniciativa.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {iniciativa.titulo}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {iniciativa.descricao}
        </p>

        {/* Company */}
        {iniciativa.empresa && (
          <div className="flex items-center gap-2 mb-3">
            {iniciativa.empresa.logo && (
              <div className="relative w-6 h-6">
                <Image
                  src={iniciativa.empresa.logo}
                  alt={iniciativa.empresa.nome}
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
            <span className="text-sm text-gray-600 truncate">
              {iniciativa.empresa.nome}
            </span>
          </div>
        )}

        {/* Info Grid */}
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(iniciativa.dataInicio)}</span>
          </div>

          {/* Type */}
          <div className="flex items-center text-sm text-gray-500">
            <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatTipoApoio(iniciativa.tipoApoio)}</span>
          </div>

          {/* Vagas */}
          {iniciativa.vagas && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{iniciativa.vagasPreenchidas || 0}/{iniciativa.vagas} vagas</span>
            </div>
          )}

          {/* Location */}
          {iniciativa.localizacao && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{iniciativa.localizacao}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default IniciativaCard;
