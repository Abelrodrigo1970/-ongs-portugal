import Image from 'next/image';
import Card from './ui/Card';
import { Calendar, Building2 } from 'lucide-react';

const PropostaCard = ({ proposta, className = '' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800',
      'EM_ANALISE': 'bg-blue-100 text-blue-800',
      'APROVADA': 'bg-green-100 text-green-800',
      'REJEITADA': 'bg-red-100 text-red-800',
      'ARQUIVADA': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDENTE': 'Pendente',
      'EM_ANALISE': 'Em Análise',
      'APROVADA': 'Aprovada',
      'REJEITADA': 'Rejeitada',
      'ARQUIVADA': 'Arquivada'
    };
    return labels[status] || status;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      <div className="p-4">
        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposta.status)}`}>
            {getStatusLabel(proposta.status)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {proposta.titulo}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {proposta.descricao}
        </p>

        {/* ONG Info */}
        {proposta.ong && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
            {proposta.ong.logo && (
              <div className="relative w-8 h-8">
                <Image
                  src={proposta.ong.logo}
                  alt={proposta.ong.nome}
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
            <div className="flex-grow">
              <div className="text-sm font-medium text-gray-900 truncate">
                {proposta.ong.nome}
              </div>
              {proposta.ong.localizacao && (
                <div className="text-xs text-gray-500 truncate">
                  {proposta.ong.localizacao}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Enviada em {formatDate(proposta.createdAt)}</span>
        </div>

        {/* Initiative link */}
        {proposta.iniciativa && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-primary-600">
              <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{proposta.iniciativa.titulo}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropostaCard;
