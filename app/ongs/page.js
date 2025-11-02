import { Suspense } from 'react';
import { getNGOs } from '@/lib/repositories/ngos';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';
import FilterBar from '@/components/FilterBar';
import NgoCard from '@/components/NgoCard';
import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import { Search } from 'lucide-react';

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

  const [ngosResult, odsOptions, areasOptions, colaboracaoOptions] = await Promise.all([
    getNGOs(filters),
    getAllODS(),
    getAllAreas(),
    getAllColaboracaoTipos()
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
      <div className="w-full" style={{ backgroundColor: '#F2F2F7' }}>
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6" style={{ color: '#404040' }}>
              ONGs em Portugal
            </h1>
            <p className="text-lg md:text-xl font-medium mb-8" style={{ color: '#595959' }}>
              Descobre organizações não-governamentais e encontra formas de colaborar para um mundo melhor
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="w-full border-b" style={{ backgroundColor: '#F2F2F7', borderColor: 'rgba(64, 64, 64, 0.15)' }}>
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-6">
          <FilterBar
            odsOptions={formattedOdsOptions}
            areasOptions={formattedAreasOptions}
            colaboracaoOptions={formattedColaboracaoOptions}
            className="max-w-6xl mx-auto"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="w-full min-h-screen py-8">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
          {ngos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {ngos.map((ngo) => (
                  <NgoCard key={ngo.id} ngo={ngo} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      
                      return (
                        <a
                          key={page}
                          href={`/ongs?${params.toString()}`}
                          className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
                            page === pagination.page
                              ? 'text-white shadow-md'
                              : 'border hover:shadow-sm'
                          }`}
                          style={
                            page === pagination.page
                              ? { backgroundColor: '#155DFC' }
                              : { backgroundColor: '#FFFFFF', color: '#595959', borderColor: 'rgba(64, 64, 64, 0.15)' }
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
            <div className="flex justify-center py-16">
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
