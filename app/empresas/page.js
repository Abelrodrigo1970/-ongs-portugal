import { Suspense } from 'react';
import { getEmpresas } from '@/lib/repositories/empresas';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import FilterBar from '@/components/FilterBar';
import EmpresaCard from '@/components/EmpresaCard';
import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Empresas Parceiras - ONGs Portugal',
  description: 'Descubra empresas que apoiam causas sociais e ambientais em Portugal.',
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function EmpresasContent({ searchParams }) {
  const filters = {
    query: searchParams.query || '',
    ods: searchParams.ods ? searchParams.ods.split(',') : [],
    causas: searchParams.areas ? searchParams.areas.split(',') : [], // Mapear areas para causas
    localizacao: searchParams.localizacao || '',
    visivel: searchParams.visivel !== 'false',
    sort: searchParams.sort || 'nome-asc',
    page: parseInt(searchParams.page) || 1,
    limit: 8 // 2 linhas de 4 cards = 8 cards por página
  };

  const [empresasResult, odsOptions, areasOptions] = await Promise.all([
    getEmpresas(filters),
    getAllODS(),
    getAllAreas()
  ]);

  const { empresas, pagination } = empresasResult;

  const formattedOdsOptions = odsOptions.map(ods => ({
    value: ods.id,
    label: `ODS ${ods.numero} - ${ods.nome}`
  }));

  const formattedAreasOptions = areasOptions.map(area => ({
    value: area.id,
    label: area.nome
  }));

  return (
    <div className="w-full min-h-screen relative" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Hero gradient overlay - baseado no .hero do Figma */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '450px',
          margin: 0,
          borderRadius: '0 0 200px 200px',
          background:
            'linear-gradient(0deg, rgba(248, 250, 252, 0), rgba(134, 252, 219, 0.25) 50%, rgba(21, 93, 252, 0.5))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* About Us Section - Baseado no Figma */}
      <div className="w-full flex flex-col items-center relative" style={{ zIndex: 1 }}>
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
              padding: '100px 0px 0px',
              gap: '40px'
            }}
          >
            {/* Frame 2 - Search and Filters (Frame 445) */}
            <div 
              className="w-full flex flex-col items-center"
              style={{ 
                padding: '64px 0px 0px 0px',
                gap: '16px'
              }}
            >
              {/* Frame Wrapper - Search Bar */}
              <div 
                className="flex items-center justify-center"
                style={{ 
                  boxShadow: '0px 0px 50px #d4e6ff',
                  width: '866px',
                  maxWidth: '100%'
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
                    action="/empresas" 
                    method="get"
                    className="flex-1 flex items-center"
                    style={{ gap: '16px' }}
                  >
                    <input
                      type="text"
                      name="query"
                      placeholder="Pesquisa Empresas"
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
                  gap: '16px'
                }}
              >
                <FilterBar
                  odsOptions={formattedOdsOptions}
                  areasOptions={formattedAreasOptions}
                  colaboracaoOptions={[]}
                  tipoOptions={[]}
                  className="w-full"
                  figmaStyle={true}
                  basePath="/empresas"
                />
              </div>
            </div>

            {/* Frame 5 - Empresas Section */}
            <div 
              className="w-full flex flex-col items-center"
              style={{ 
                gap: '24px'
              }}
            >
              {/* Container para título e cards alinhados */}
              <div
                className="flex flex-col"
                style={{
                  gap: '24px',
                  width: '100%',
                  maxWidth: 'calc(4 * 310px + 3 * 24px)'
                }}
              >
                {/* Frame 6 - Section Header */}
                <div 
                  className="w-full flex items-center justify-start"
                  style={{ gap: '24px', width: '100%' }}
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
                    Empresas
                  </h2>
                </div>

                {/* Frame 8 - First Row of 4 cards */}
                {empresas.length > 0 ? (
                  <>
                    <div 
                      className="w-full flex flex-wrap justify-start"
                      style={{ gap: '24px' }}
                    >
                      {empresas.slice(0, 4).map((empresa) => (
                        <EmpresaCard key={empresa.id} empresa={empresa} />
                      ))}
                    </div>
                    
                    {/* Frame 8 - Second Row of 4 cards */}
                    {empresas.length > 4 && (
                      <div 
                        className="w-full flex flex-wrap justify-start"
                        style={{ gap: '24px' }}
                      >
                        {empresas.slice(4, 8).map((empresa) => (
                          <EmpresaCard key={empresa.id} empresa={empresa} />
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
                                href={`/empresas?${params.toString()}`}
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
                      title="Nenhuma empresa encontrada"
                      description="Tenta ajustar os filtros para encontrar mais resultados."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmpresasPage({ searchParams }) {
  return (
    <Suspense fallback={
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </div>
    }>
      <EmpresasContent searchParams={searchParams} />
    </Suspense>
  );
}
