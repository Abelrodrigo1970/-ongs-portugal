import { Suspense } from 'react';
import { getEvents } from '@/lib/repositories/events';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getEventTypes } from '@/lib/repositories/events';
import FilterBar from '@/components/FilterBar';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import { Calendar } from 'lucide-react';

async function EventsContent({ searchParams }) {
  const filters = {
    query: searchParams.query || '',
    ods: searchParams.ods ? searchParams.ods.split(',') : [],
    areas: searchParams.areas ? searchParams.areas.split(',') : [],
    tipo: searchParams.tipo ? searchParams.tipo.split(',') : [],
    inscricoesAbertas: searchParams.inscricoesAbertas === 'true' ? true : null,
    visivel: searchParams.visivel !== 'false',
    sort: searchParams.sort || 'dataInicio-asc',
    page: parseInt(searchParams.page) || 1,
    limit: 12
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Eventos de Voluntariado
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Descobre eventos e oportunidades de voluntariado organizados por ONGs em Portugal
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <FilterBar
            odsOptions={formattedOdsOptions}
            areasOptions={formattedAreasOptions}
            tipoOptions={tipoOptions}
            showEventFilters={true}
            className="max-w-6xl mx-auto"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {events.length > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      
                      return (
                        <a
                          key={page}
                          href={`/eventos?${params.toString()}`}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            page === pagination.page
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200'
                          }`}
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
            <div className="flex justify-center py-16">
              <EmptyState
                icon={Calendar}
                title="Nenhum evento encontrado"
                description="Tenta ajustar os filtros para encontrar mais resultados."
              />
            </div>
          )}
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


