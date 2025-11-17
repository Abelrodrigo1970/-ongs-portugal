import { Suspense } from 'react';
import Link from 'next/link';
import { getNGOs } from '@/lib/repositories/ngos';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';
import { getUpcomingEvents } from '@/lib/repositories/events';
import FilterBar from '@/components/FilterBar';
import NgoCard from '@/components/NgoCard';
import FavoriteNPOSection from '@/components/ngo/FavoriteNPOSection';
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
      {/* About Section - Baseado no Figma */}
      <div 
        className="w-full flex flex-col items-center"
        style={{ 
          padding: '100px 0px 0px',
          gap: '40px'
        }}
      >
        {/* Frame 2 - Search and Filters */}
        <div 
          className="w-full flex flex-col items-start"
          style={{ 
            padding: '64px 0px 0px 0px',
            gap: '16px',
            maxWidth: '1440px',
            margin: '0 auto',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >
          {/* Search Bar Container */}
          <div 
            className="flex items-center"
            style={{ 
              boxShadow: '0px 0px 50px #d4e6ff',
              width: '866px',
              maxWidth: '100%',
              gap: '24px'
            }}
          >
            {/* Search Input */}
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
                action="/ongs" 
                method="get"
                className="flex-1 flex items-center"
                style={{ gap: '16px' }}
              >
                <input
                  type="text"
                  name="query"
                  placeholder="copy"
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

          {/* Filters Row */}
          <div 
            className="flex items-center justify-center w-full"
            style={{ 
              boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.05)',
              height: '46px',
              gap: '16px'
            }}
          >
            <FilterBar
              odsOptions={formattedOdsOptions}
              areasOptions={formattedAreasOptions}
              colaboracaoOptions={formattedColaboracaoOptions}
              className="w-full"
              figmaStyle={true}
            />
          </div>
        </div>

        {/* Frame 5 - Favorite NPO Section */}
        <FavoriteNPOSection ngos={ngos} />

        {/* Frame 5 - NPOs Section */}
        <div 
          className="w-full flex flex-col items-start"
          style={{ 
            gap: '24px',
            maxWidth: '1440px',
            margin: '0 auto',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >
          {/* Section Header */}
          <div 
            className="w-full flex items-center justify-center"
            style={{ gap: '24px' }}
          >
            <div 
              className="flex-1 flex items-center"
              style={{ gap: '8px' }}
            >
              <h2 
                style={{ 
                  color: 'rgba(2, 6, 23, 1)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '32px',
                  fontWeight: '600',
                  lineHeight: '120%',
                  marginTop: '-1px'
                }}
              >
                NPOs
              </h2>
            </div>
          </div>

          {/* NPOs Grid - 2 rows of 4 cards */}
          {ngos.length > 0 ? (
            <>
              {/* First Row */}
              <div 
                className="w-full flex flex-wrap justify-center"
                style={{ gap: '24px' }}
              >
                {ngos.slice(0, 4).map((ngo) => (
                  <NgoCard key={ngo.id} ngo={ngo} />
                ))}
              </div>
              
              {/* Second Row */}
              {ngos.length > 4 && (
                <div 
                  className="w-full flex flex-wrap justify-center"
                  style={{ gap: '24px' }}
                >
                  {ngos.slice(4, 8).map((ngo) => (
                    <NgoCard key={ngo.id} ngo={ngo} />
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
            <div className="w-full flex justify-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
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
