'use client';

import { useState } from 'react';
import CompactEventCard from './CompactEventCard';
import EventDialog from './EventDialog';
import EmptyState from './ui/EmptyState';
import { Search } from 'lucide-react';

const EventsList = ({ events, pagination, searchParams }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      {/* Iniciativas para si Section */}
      {events.length > 0 && (
        <div 
          className="w-full flex flex-col items-center"
          style={{ 
            gap: '24px',
            width: '100%'
          }}
        >
          {/* Container para título e cards alinhados */}
          <div 
            className="flex flex-col"
            style={{ 
              gap: '24px',
              width: '100%',
              maxWidth: '1312px' // Largura fixa como no Figma
            }}
          >
            {/* Section Header */}
            <div className="w-full flex items-center" style={{ marginBottom: '24px' }}>
              <h2 
                style={{ 
                  color: '#020617',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '32px',
                  fontWeight: '600',
                  lineHeight: 1.2,
                  margin: 0
                }}
              >
                Eventos para si
              </h2>
            </div>

            {/* First 4 cards in horizontal row */}
            <div 
              className="w-full flex items-start"
              style={{ 
                gap: '24px',
                overflow: 'clip' // Como no Figma
              }}
            >
              {events.slice(0, 4).map((event) => (
                <div key={event.id} style={{ flexShrink: 0 }}>
                  <CompactEventCard event={event} onCardClick={() => handleCardClick(event)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Todas as iniciativas Section */}
      <div 
        className="w-full flex flex-col items-center"
        style={{ 
          gap: '24px',
          width: '100%'
        }}
      >
        {/* Container para título e cards alinhados */}
        <div 
          className="flex flex-col items-center"
          style={{ 
            gap: '24px',
            width: '100%',
            maxWidth: '1312px' // Largura fixa como no Figma
          }}
        >
          {/* Section Header */}
          <div className="w-full flex items-center" style={{ marginBottom: '24px' }}>
            <h2 
              style={{ 
                color: '#020617',
                fontFamily: 'Inter, sans-serif',
                fontSize: '32px',
                fontWeight: '600',
                lineHeight: 1.2,
                margin: 0
              }}
            >
              Todas as iniciativas
            </h2>
          </div>

          {/* Events Grid */}
          {events.length > 0 ? (
            <>
              {/* First Row of 4 cards */}
              <div 
                className="w-full flex items-start"
                style={{ 
                  gap: '24px',
                  overflow: 'clip' // Como no Figma
                }}
              >
                {events.slice(events.length > 4 ? 4 : 0, events.length > 4 ? 8 : 4).map((event) => (
                  <div key={event.id} style={{ flexShrink: 0 }}>
                    <CompactEventCard event={event} onCardClick={() => handleCardClick(event)} />
                  </div>
                ))}
              </div>
              
              {/* Second Row of 4 cards */}
              {events.length > 8 && (
                <div 
                  className="w-full flex items-start"
                  style={{ 
                    gap: '24px',
                    overflow: 'clip' // Como no Figma
                  }}
                >
                  {events.slice(8, 12).map((event) => (
                    <div key={event.id} style={{ flexShrink: 0 }}>
                      <CompactEventCard event={event} onCardClick={() => handleCardClick(event)} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="w-full flex justify-center" style={{ marginTop: '40px', marginBottom: '40px' }}>
                  <div className="flex gap-3">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      
                      return (
                        <a
                          key={page}
                          href={`/eventos?${params.toString()}`}
                          className={`rounded-full transition-all duration-200 ${
                            page === pagination.page
                              ? 'text-white shadow-lg'
                              : 'border hover:shadow-md hover:scale-105'
                          }`}
                          style={
                            page === pagination.page
                              ? { 
                                  backgroundColor: 'var(--color-button-primary)',
                                  padding: '12px 24px',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  lineHeight: '1.2'
                                }
                              : { 
                                  backgroundColor: '#FFFFFF', 
                                  color: '#595959', 
                                  borderColor: 'rgba(64, 64, 64, 0.15)',
                                  padding: '12px 24px',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  lineHeight: '1.2'
                                }
                          }
                        >
                          {page}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex justify-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
              <EmptyState
                icon={Search}
                title="Nenhum evento encontrado"
                description="Tenta ajustar os filtros para encontrar mais resultados."
              />
            </div>
          )}
        </div>
      </div>

      {/* Event Dialog Modal */}
      <EventDialog 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </>
  );
};

export default EventsList;

