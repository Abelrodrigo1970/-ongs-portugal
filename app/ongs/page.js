import { Suspense } from 'react';
import Link from 'next/link';
import { getNGOs } from '@/lib/repositories/ngos';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';
import { getUpcomingEvents } from '@/lib/repositories/events';
import FilterBar from '@/components/FilterBar';
import NgoCard from '@/components/NgoCard';
import CompactEventCard from '@/components/CompactEventCard';
import MetricBanner from '@/components/ngo/MetricBanner';
import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import { Search, ChevronRight } from 'lucide-react';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

async function ONGsContent({ searchParams }) {
  const filters = {
    query: searchParams.query || '',
    ods: searchParams.ods ? searchParams.ods.split(',') : [],
    areas: searchParams.areas ? searchParams.areas.split(',') : [],
    colaboracao: searchParams.colaboracao ? searchParams.colaboracao.split(',') : [],
    localizacao: searchParams.localizacao || '',
    visivel: searchParams.visivel !== 'false', // Por padrão mostrar ONGs visíveis
    sort: searchParams.sort || 'nome-asc',
    page: parseInt(searchParams.page) || 1,
    limit: 12
  };

  const [ngosResult, odsOptions, areasOptions, colaboracaoOptions, upcomingEvents, totalNgos] = await Promise.all([
    getNGOs(filters),
    getAllODS(),
    getAllAreas(),
    getAllColaboracaoTipos(),
    getUpcomingEvents(3),
    getNGOs({ visivel: true, limit: 1000 }) // Get total visible NGOs for metrics
  ]);

  const { ngos, pagination } = ngosResult;

  const formattedOdsOptions = odsOptions.map(ods => ({
    value: ods.id,
    label: `ODS ${ods.numero} - ${ods.nome}`
  }));

  const formattedAreasOptions = areasOptions.map(area => ({
    value: area.id,
    label: area.nome
  }));

  const formattedColaboracaoOptions = colaboracaoOptions.map(colab => ({
    value: colab.id,
    label: colab.nome
  }));

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Hero Section */}
      <div className="w-full py-16 md:py-20" style={{ backgroundColor: '#F2F2F7' }}>
        <div className="w-full max-w-[1440px] mx-auto px-8 md:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              style={{ 
                color: '#404040',
                fontSize: '48px',
                lineHeight: '1.2',
                fontWeight: '700',
                marginBottom: '24px'
              }}
            >
              ONGs em Portugal
            </h1>
            <p 
              style={{ 
                color: '#595959',
                fontSize: '20px',
                lineHeight: '1.4',
                fontWeight: '500'
              }}
            >
              Descobre organizações não-governamentais e encontra formas de colaborar para um mundo melhor
            </p>
          </div>
        </div>
      </div>

      {/* About Us - Métricas */}
      <div className="w-full" style={{ paddingTop: '32px', paddingBottom: '64px', backgroundColor: '#F2F2F7' }}>
        <div className="w-full max-w-[1440px] mx-auto px-8 md:px-16">
          <div className="w-full max-w-[918px] mx-auto">
            <div 
              className="flex flex-col md:flex-row items-stretch w-full"
              style={{ 
                gap: '24px',
                backgroundColor: 'rgba(242, 242, 247, 0.05)'
              }}
            >
              <MetricBanner 
                value={totalNgos.pagination.total}
                label="ONGs Registadas"
              />
              <MetricBanner 
                value={areasOptions.length}
                label="Áreas de Atuação"
              />
              <MetricBanner 
                value={odsOptions.length}
                label="ODS Representados"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="w-full border-b" style={{ backgroundColor: '#F2F2F7', borderColor: 'rgba(64, 64, 64, 0.15)', paddingBottom: '32px' }}>
        <div className="w-full max-w-[1440px] mx-auto px-8 md:px-16">
          <FilterBar
            odsOptions={formattedOdsOptions}
            areasOptions={formattedAreasOptions}
            colaboracaoOptions={formattedColaboracaoOptions}
            className="max-w-6xl mx-auto"
          />
        </div>
      </div>

      {/* Próximos Eventos */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div className="w-full" style={{ paddingTop: '64px', paddingBottom: '64px', backgroundColor: '#F2F2F7' }}>
          <div className="w-full max-w-[1440px] mx-auto px-8 md:px-16">
            <div className="w-full max-w-[918px] mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between" style={{ paddingBottom: '32px' }}>
                <h2 
                  style={{ 
                    color: '#1E1E1E',
                    fontSize: '39px',
                    fontWeight: '700',
                    lineHeight: '1.2'
                  }}
                >
                  Próximos eventos
                </h2>
                <Link 
                  href="/eventos"
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: '#1E1E1E' }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Link>
              </div>

              {/* Events Grid */}
              <div className="flex flex-col gap-6">
                {upcomingEvents.map((event) => (
                  <CompactEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="w-full" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div className="w-full max-w-[1440px] mx-auto px-8 md:px-16">
          {ngos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ marginBottom: '64px' }}>
                {ngos.map((ngo) => (
                  <NgoCard key={ngo.id} ngo={ngo} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center">
                  <div className="flex gap-3">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      
                      return (
                        <a
                          key={page}
                          href={`/ongs?${params.toString()}`}
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
            <div className="flex justify-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
              <EmptyState
                icon={Search}
                title="Nenhuma ONG encontrada"
                description="Tenta ajustar os filtros para encontrar mais resultados."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ONGsPage({ searchParams }) {
  return (
    <Suspense fallback={
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </div>
    }>
      <ONGsContent searchParams={searchParams} />
    </Suspense>
  );
}
