'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import Button from './ui/Button';
import InscricaoModal from './InscricaoModal';
import { MapPin, Calendar, UserPlus } from 'lucide-react';

const EventCard = ({ event, className = '', showInscricao = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Função para formatar data e hora
  const formatEventDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Lisbon'
    };
    
    return date.toLocaleString('pt-PT', options);
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
        <div className="flex flex-col h-full">
          <Link href={`/eventos/${event.id}`} className="block">
            {/* Event Image */}
            <div className="relative h-32 bg-gray-200 rounded-t-lg overflow-hidden">
              {event.imagem ? (
                <Image
                  src={event.imagem}
                  alt={event.nome}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Event Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.nome}
              </h3>
              
              {/* NGO Name */}
              <p className="text-sm text-gray-600 mb-2 truncate">
                {event.ngo?.nome}
              </p>

              {/* Date and Time */}
              {event.dataInicio && (
                <div className="flex items-center text-sm text-blue-600 mb-2">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{formatEventDateTime(event.dataInicio)}</span>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{event.localizacao}</span>
              </div>
            </div>
          </Link>

          {/* Inscription Button */}
          {showInscricao && (
            <div className="px-4 pb-4">
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                className="w-full"
              >
                Inscrever-me
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Inscription Modal */}
      <InscricaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventoId={event.id}
        tipo="evento"
      />
    </>
  );
};

export default EventCard;