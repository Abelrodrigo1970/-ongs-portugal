import { Suspense } from 'react';
import { getEvents } from '@/lib/repositories/events';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getEventTypes } from '@/lib/repositories/events';
import FilterBar from '@/components/FilterBar';
import CompactEventCard from '@/components/CompactEventCard';
import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import { Search, Calendar } from 'lucide-react';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

async function EventsContent({ searchParams }) {
  const filters = {
    query: searchParams.query || '',
    ods: searchParams.ods ? searchParams.ods.split(',') : [],
    areas: searchParams.areas ? searchParams.areas.split(',') : [],
    tipo: searchParams.tipo ? searchParams.tipo.split(',') : [],
    localizacao: searchParams.localizacao || '',
    inscricoesAbertas: searchParams.inscricoesAbertas === 'true' ? true : null,
    visivel: searchParams.visivel !== 'false',
    sort: searchParams.sort || 'dataInicio-asc',
    page: parseInt(searchParams.page) || 1,
    limit: 8 // 2 linhas de 4 cards = 8 cards por página
  };

  const [eventsResult, odsOptions, areasOptions, tipoOptions] = await Promise.all([
    getEvents(filters),
    getAllODS(),
    getAllAreas(),
    Promise.resolve(getEventTypes())
  ]);

  const { events, pagination } = eventsResult;

  const formattedOdsOptions = odsOptions.map(ods => ({
    value: ods.id,
    label: `ODS ${ods.numero} - ${ods.nome}`
  }));

  const formattedAreasOptions = areasOptions.map(area => ({
    value: area.id,
    label: area.nome
  }));

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* About Section - Baseado no Figma */}
      <div className="w-full flex flex-col items-center">
        {/* Page Content */}
        <div 
          className="w-full flex flex-col items-center"
          style={{ 
            padding: '8px 64px',
            maxWidth: '100%'
          }}
        >
          {/* About Section */}
          <div 
            className="w-full flex flex-col items-center"
            style={{ 
              paddingTop: '100px',
              paddingBottom: '0',
              paddingLeft: '0',
              paddingRight: '0',
              gap: '40px',
              width: '100%'
            }}
          >
            {/* Frame 2 - Search and Filters (Frame 445) */}
            <div 
              className="w-full flex flex-col items-start"
              style={{ 
                paddingTop: '64px',
                paddingBottom: '0',
                paddingLeft: '0',
                paddingRight: '0',
                gap: '16px',
                width: '100%'
              }}
            >
              {/* Frame Wrapper - Search Bar */}
              <div 
                className="flex items-center"
                style={{ 
                  boxShadow: '0px 0px 50px #d4e7ff',
                  width: '866px',
                  maxWidth: '100%',
                  gap: '24px',
                  position: 'sticky',
                  top: '0',
                  zIndex: 10
                }}
              >
                {/* Search Input - div inside frame-wrapper */}
                <div 
                  className="flex items-center flex-1"
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #d5e1ff',
                    borderRadius: '200px',
                    height: '46px',
                    padding: '16px',
                    gap: '16px'
                  }}
                >
                  <Search 
                    style={{ 
                      width: '24px', 
                      height: '24px',
                      color: 'rgba(100, 116, 139, 1)'
                    }} 
                  />
                  <form 
                    action="/eventos" 
                    method="get"
                    className="flex-1 flex items-center"
                    style={{ gap: '16px' }}
                  >
                    <input
                      type="text"
                      name="query"
                      placeholder="Pesquisa Iniciativas para participar"
                      defaultValue={searchParams.query || ''}
                      className="flex-1 outline-none bg-transparent"
                      style={{ 
                        color: 'rgba(100, 116, 139, 1)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        fontWeight: '400',
                        lineHeight: 'normal',
                        border: 'none'
                      }}
                    />
                  </form>
                </div>
              </div>

              {/* div-2 - Filters Row */}
              <div 
                className="flex items-center justify-center w-full"
                style={{ 
                  backgroundColor: 'transparent',
                  height: '46px',
                  gap: '16px',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.05)',
                  width: '100%'
                }}
              >
                <FilterBar
                  odsOptions={formattedOdsOptions}
                  areasOptions={formattedAreasOptions}
                  tipoOptions={tipoOptions}
                  showEventFilters={true}
                  className="w-full"
                  figmaStyle={true}
                />
              </div>
            </div>

            {/* Iniciativas para si Section */}
            {events.length > 0 && (
              <div 
                className="w-full flex flex-col items-start"
                style={{ 
                  gap: '24px',
                  width: '100%'
                }}
              >
                {/* Section Header */}
                <div 
                  className="w-full flex items-center"
                  style={{ 
                    gap: '24px',
                    width: '100%'
                  }}
                >
                  <div 
                    className="flex-1 flex items-center"
                    style={{ 
                      gap: '8px',
                      flex: '1 1 0%',
                      minWidth: '0',
                      minHeight: '0'
                    }}
                  >
                    <h2 
                      style={{ 
                        color: '#020617',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '32px',
                        fontWeight: '600',
                        lineHeight: 1.2
                      }}
                    >
                      Iniciativas para si
                    </h2>
                  </div>
                </div>

                {/* First 4 cards in horizontal row */}
                <div 
                  className="w-full flex justify-start items-start"
                  style={{ 
                    gap: '24px',
                    width: '100%',
                    overflowX: 'auto'
                  }}
                >
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} style={{ flexShrink: 0 }}>
                      <CompactEventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Todas as iniciativas Section */}
            <div 
              className="w-full flex flex-col items-start"
              style={{ 
                gap: '24px',
                width: '100%'
              }}
            >
              {/* Section Header */}
              <div 
                className="w-full flex items-center"
                style={{ 
                  gap: '24px',
                  width: '100%'
                }}
              >
                <div 
                  className="flex-1 flex items-center"
                  style={{ 
                    gap: '8px',
                    flex: '1 1 0%',
                    minWidth: '0',
                    minHeight: '0'
                  }}
                >
                  <h2 
                    style={{ 
                      color: '#020617',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '32px',
                      fontWeight: '600',
                      lineHeight: 1.2
                    }}
                  >
                    Todas as iniciativas
                  </h2>
                </div>
              </div>

              {/* Events Grid */}
              {events.length > 0 ? (
                <>
                  {/* First Row of 4 cards */}
                  <div 
                    className="w-full flex justify-start items-start"
                    style={{ 
                      gap: '24px',
                      width: '100%',
                      overflowX: 'auto'
                    }}
                  >
                    {events.slice(events.length > 4 ? 4 : 0, events.length > 4 ? 8 : 4).map((event) => (
                      <div key={event.id} style={{ flexShrink: 0 }}>
                        <CompactEventCard event={event} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Second Row of 4 cards */}
                  {events.length > 8 && (
                    <div 
                      className="w-full flex justify-start items-start"
                      style={{ 
                        gap: '24px',
                        width: '100%',
                        overflowX: 'auto'
                      }}
                    >
                      {events.slice(8, 12).map((event) => (
                        <div key={event.id} style={{ flexShrink: 0 }}>
                          <CompactEventCard event={event} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="w-full flex justify-center" style={{ marginTop: '40px' }}>
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
        </div>
      </div>
    </div>
  );
}

export default function EventsPage({ searchParams }) {
  return (
    <Suspense fallback={
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </div>
    }>
      <EventsContent searchParams={searchParams} />
    </Suspense>
  );
}


