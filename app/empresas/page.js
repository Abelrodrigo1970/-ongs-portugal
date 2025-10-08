import { getEmpresas } from '@/lib/repositories/empresas';
import { getAllODS } from '@/lib/repositories/ods';
import EmpresaCard from '@/components/EmpresaCard';
import EmptyState from '@/components/ui/EmptyState';

export const metadata = {
  title: 'Empresas Parceiras - ONGs Portugal',
  description: 'Descubra empresas que apoiam causas sociais e ambientais em Portugal.',
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function EmpresasPage({ searchParams }) {
  const filters = {
    query: searchParams.query || '',
    ods: searchParams.ods?.split(',').filter(Boolean) || [],
    causas: searchParams.causas?.split(',').filter(Boolean) || [],
    localizacao: searchParams.localizacao || '',
    sort: searchParams.sort || 'nome-asc',
    page: parseInt(searchParams.page) || 1
  };

  const { empresas, pagination } = await getEmpresas(filters);
  const allODS = await getAllODS();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empresas Parceiras
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Conheça empresas comprometidas com o impacto social e ambiental em Portugal.
            </p>
          </div>
        </div>
      </section>

      {/* Empresas Grid */}
      <section className="container mx-auto px-4 py-12">
        {empresas.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Encontradas {pagination.total} empresa{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {empresas.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                  <a
                    key={pageNum}
                    href={`/empresas?${new URLSearchParams({ ...searchParams, page: pageNum.toString() })}`}
                    className={`px-4 py-2 rounded-lg ${
                      pageNum === pagination.page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Nenhuma empresa encontrada"
            description="Não foram encontradas empresas com os critérios selecionados."
          />
        )}
      </section>
    </div>
  );
}
