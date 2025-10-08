import { getNGOs } from '@/lib/repositories/ngos';
import { getEvents } from '@/lib/repositories/events';
import { getAllODS } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import NgoCard from '@/components/NgoCard';
import CompactEventCard from '@/components/CompactEventCard';
import FilterBar from '@/components/FilterBar';
import { Heart, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Oportunidades de Voluntariado - ONGs Portugal',
  description: 'Descubra oportunidades de voluntariado em ONGs e eventos em Portugal.',
};

export const dynamic = 'force-dynamic';

export default async function VoluntariadoPage({ searchParams }) {
  const filters = {
    query: searchParams.query || '',
    ods: searchParams.ods?.split(',').filter(Boolean) || [],
    areas: searchParams.areas?.split(',').filter(Boolean) || [],
    localizacao: searchParams.localizacao || '',
    sort: searchParams.sort || 'nome-asc',
    page: parseInt(searchParams.page) || 1,
    limit: 12
  };

  const [
    { ngos, pagination: ngosPagination },
    { events, pagination: eventsPagination },
    allODS,
    allAreas
  ] = await Promise.all([
    getNGOs({ ...filters, limit: 8 }),
    getEvents({ ...filters, inscricoesAbertas: true, limit: 8 }),
    getAllODS(),
    getAllAreas()
  ]);

  const odsOptions = allODS.map(ods => ({
    value: ods.id,
    label: `ODS ${ods.numero} - ${ods.nome}`,
    numero: ods.numero
  }));

  const areasOptions = allAreas.map(area => ({
    value: area.id,
    label: area.nome
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Oportunidades de Voluntariado
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Descubra ONGs e eventos onde pode fazer a diferença como voluntário.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="container mx-auto px-4 py-8">
        <FilterBar
          odsOptions={odsOptions}
          areasOptions={areasOptions}
          colaboracaoOptions={[]}
          tipoOptions={[]}
          showEventFilters={false}
        />
      </section>

      {/* Eventos com Inscrições Abertas */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Eventos Disponíveis
          </h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {eventsPagination.total} oportunidades
          </span>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {events.map((event) => (
              <CompactEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">Nenhum evento com inscrições abertas no momento.</p>
          </div>
        )}
      </section>

      {/* ONGs Disponíveis */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            ONGs para Apoiar
          </h2>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {ngosPagination.total} organizações
          </span>
        </div>

        {ngos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ngos.map((ngo) => (
              <NgoCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">Nenhuma ONG encontrada.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para Fazer a Diferença?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Escolha uma ONG ou evento que se alinhe com os seus valores e comece a contribuir para um mundo melhor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#eventos" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Ver Eventos
            </a>
            <a href="#ongs" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Explorar ONGs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
