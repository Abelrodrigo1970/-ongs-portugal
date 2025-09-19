import { getFeaturedNGOs } from '@/lib/repositories/ngos';
import { getFeaturedEvents } from '@/lib/repositories/events';
import { getAllODS as getAllODSData } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';
import Link from 'next/link';
import Hero from '@/components/home/Hero';
import FeaturedNGOs from '@/components/home/FeaturedNGOs';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import ODSSection from '@/components/home/ODSSection';
import CTASection from '@/components/home/CTASection';
import EventCard from '@/components/EventCard';
import Button from '@/components/ui/Button';

export default async function HomePage() {
  const [featuredNGOs, featuredEvents, allODS, allAreas, colaboracaoTipos] = await Promise.all([
    getFeaturedNGOs(6),
    getFeaturedEvents(6),
    getAllODSData(),
    getAllAreas(),
    getAllColaboracaoTipos()
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

  const colaboracaoOptions = colaboracaoTipos.map(tipo => ({
    value: tipo.id,
    label: tipo.nome
  }));

  return (
    <div className="min-h-screen">
      <Hero 
        odsOptions={odsOptions} 
        areasOptions={areasOptions}
        colaboracaoOptions={colaboracaoOptions}
      />
      
      {/* Nova seção de eventos com container-custom */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Próximos Eventos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descobre as próximas oportunidades de voluntariado e eventos organizados por ONGs
            </p>
          </div>

          {featuredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredEvents.slice(0, 6).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/eventos">
                  <Button size="lg">
                    Ver Todos os Eventos
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum evento encontrado.</p>
            </div>
          )}
        </div>
      </section>
      
      <FeaturedEvents events={featuredEvents} />
      <FeaturedNGOs ngos={featuredNGOs} />
      <ODSSection ods={allODS} />
      <CTASection />
    </div>
  );
}
