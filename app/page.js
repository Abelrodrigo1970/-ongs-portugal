import { getFeaturedNGOs } from '@/lib/repositories/ngos';
import { getAllODS as getAllODSData } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import Hero from '@/components/home/Hero';
import FeaturedNGOs from '@/components/home/FeaturedNGOs';
import ODSSection from '@/components/home/ODSSection';
import CTASection from '@/components/home/CTASection';

export default async function HomePage() {
  const [featuredNGOs, allODS, allAreas] = await Promise.all([
    getFeaturedNGOs(6),
    getAllODSData(),
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
    <div className="min-h-screen">
      <Hero odsOptions={odsOptions} areasOptions={areasOptions} />
      <FeaturedNGOs ngos={featuredNGOs} />
      <ODSSection ods={allODS} />
      <CTASection />
    </div>
  );
}
