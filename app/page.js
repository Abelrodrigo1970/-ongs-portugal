import { getFeaturedNGOs } from '@/lib/repositories/ngos';
import { getFeaturedEvents, getEventTypes } from '@/lib/repositories/events';
import { getAllODS as getAllODSData } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';
import SearchableHomePage from '@/components/SearchableHomePage';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

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

  const tipoOptions = getEventTypes();

  return (
    <SearchableHomePage 
      featuredNGOs={featuredNGOs}
      featuredEvents={featuredEvents}
      allODS={allODS}
      odsOptions={odsOptions}
      areasOptions={areasOptions}
      colaboracaoOptions={colaboracaoOptions}
      tipoOptions={tipoOptions}
    />
  );
}
