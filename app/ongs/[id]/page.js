import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getNGOById, getRelatedNGOs } from '@/lib/repositories/ngos';
import { getEventsByNGO } from '@/lib/repositories/events';
import CompactEventCard from '@/components/CompactEventCard';
import MetricBanner from '@/components/ngo/MetricBanner';
import AreaBanner from '@/components/ngo/AreaBanner';
import ProjectCard from '@/components/ngo/ProjectCard';
import { getAreaIcon } from '@/lib/utils/areaIcons';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ResponsiveVideo from '@/components/ResponsiveVideo';
import { 
  MapPin, 
  Mail, 
  Phone,
  Globe,
  Instagram,
  ArrowRight,
  Bookmark,
  Calendar
} from 'lucide-react';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const ngo = await getNGOById(params.id);
  
  if (!ngo) {
    return {
      title: 'ONG não encontrada',
    };
  }

  return {
    title: `${ngo.nome} - ONGs Portugal`,
    description: ngo.descricao,
  };
}

export default async function NGODetailPage({ params }) {
  const [ngo, relatedNGOs, ngoEvents] = await Promise.all([
    getNGOById(params.id),
    getRelatedNGOs(params.id, 4),
    getEventsByNGO(params.id, { limit: 3 })
  ]);

  if (!ngo) {
    notFound();
  }

  const odsList = ngo.ods?.map(ngoods => ngoods.ods) || [];
  const areasList = ngo.areaAtuacao?.map(area => area.tipo.nome) || [];
  const colaboracaoList = ngo.colaboracao?.map(colab => colab.tipo.nome) || [];

  // Parse impacto to get metrics
  let impactMetrics = [];
  if (ngo.impacto) {
    try {
      impactMetrics = JSON.parse(ngo.impacto);
    } catch (e) {
      impactMetrics = [];
    }
  }

  return (
    <div className="w-full bg-white">
      {/* Main Container - matches Figma 1440px width with 64px padding */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        
        {/* About Section - centered, 918px width */}
        <div className="w-full flex flex-col items-center pt-8 md:pt-16 lg:pt-32 xl:pt-[304px] gap-10">
          
          {/* Frame 403 - Header Card with logo, title, actions */}
          <div 
            className="w-full max-w-[918px] rounded-[32px] border border-gray-200 p-8 backdrop-blur-[200px]"
            style={{ 
              background: 'rgba(242, 242, 247, 0.05)',
              borderColor: 'rgba(64, 64, 64, 0.15)'
            }}
          >
            {/* Frame 439 - Top Row: Logo + Title + Location/Website */}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Logo and Title */}
              <div className="flex items-center gap-2">
                {ngo.logo && (
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0" style={{ background: '#EF4037' }}>
                    <Image
                      src={ngo.logo}
                      alt={`${ngo.nome} logo`}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-[48px] font-extrabold leading-[1.2]" style={{ color: '#404040' }}>
                  {ngo.nome}
                </h1>
              </div>

              {/* Location and Website */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm md:text-base font-medium text-gray-600">{ngo.localizacao}</span>
                </div>
                {ngo.websiteUrl && (
                  <>
                    <div className="hidden md:block w-[1px] h-full bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <Link 
                        href={ngo.websiteUrl}
                        target="_blank"
                        className="text-sm md:text-base font-medium text-gray-600 hover:underline break-all"
                      >
                        {ngo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Frame 359 - Tags/Áreas */}
            {areasList.length > 0 && (
              <div className="w-full flex flex-wrap items-center gap-4 px-2 py-10 border-t border-gray-200">
                {areasList.map((area, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-[200px] border"
                    style={{ borderColor: 'rgba(64, 64, 64, 0.5)' }}
                  >
                    <span className="text-xs md:text-sm font-medium" style={{ color: 'rgba(64, 64, 64, 0.5)' }}>
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="w-full flex flex-col md:flex-row gap-4">
              <Button 
                className="w-full md:flex-1 bg-[#155DFC] text-white rounded-[100px] px-3 py-4 text-xl font-semibold gap-4 hover:bg-[#1247b8]"
              >
                Quero colaborar
                <ArrowRight className="w-6 h-6" />
              </Button>
              <Button 
                className="w-full md:flex-1 rounded-[100px] px-3 py-4 text-xl font-semibold gap-4 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Seguir ONG
                <Bookmark className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Frame 428 - About Text */}
          <div className="w-full max-w-[918px] flex flex-col gap-16">
            {/* Title */}
            <div className="w-full">
              <h2 className="text-4xl font-bold leading-[1.4]" style={{ color: '#404040' }}>
                Transformamos vidas, todos os dias.
              </h2>
            </div>

            {/* Description */}
            <div className="w-full flex justify-center">
              <p className="text-xl font-medium leading-[1.4] text-center" style={{ color: '#595959' }}>
                {ngo.missao}
              </p>
            </div>
          </div>

          {/* About us - Métrica - Impacto */}
          {impactMetrics.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col">
              {/* Metrics Grid */}
              <div className="w-full flex flex-col md:flex-row gap-6">
                {impactMetrics.map((metric, index) => (
                  <MetricBanner 
                    key={index}
                    value="755"
                    label="Pessoas apoiadas"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Áreas de Atuação */}
          {areasList.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col">
              <div className="w-full pb-8">
                <h3 className="text-4xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>
                  Áreas de Atuação
                </h3>
              </div>

              {/* Areas Grid */}
              <div className="w-full flex flex-wrap gap-8 justify-center">
                {areasList.map((area, index) => (
                  <AreaBanner key={index} className="w-auto" icon={getAreaIcon(area)}>
                    <div className="w-full flex flex-col items-center gap-8">
                      <span className="text-center text-base font-medium">{area}</span>
                    </div>
                  </AreaBanner>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Eventos */}
          {ngoEvents.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col gap-6">
              <div className="w-full flex justify-between items-center py-2">
                <h3 className="text-4xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>
                  Próximos eventos
                </h3>
                <div className="flex items-center gap-5">
                  {/* Pagination dots or navigation */}
                </div>
              </div>

              {/* Events Grid */}
              <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6">
                {ngoEvents.map((event) => (
                  <div key={event.id} className="flex-1">
                    <CompactEventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vídeo Section */}
          {ngo.videoUrl && (
            <div className="w-full py-8 pb-[60px]">
              <ResponsiveVideo
                url={ngo.videoUrl}
                title={`Vídeo da ${ngo.nome}`}
                className="w-full"
              />
            </div>
          )}

          {/* Projects Gallery */}
          <div 
            className="w-full flex flex-col gap-1"
            style={{ background: 'rgba(21, 93, 252, 0.05)' }}
          >
            {/* You can add project cards here if you have project data */}
          </div>

          {/* Contact Information */}
          <div 
            className="w-full max-w-[918px] rounded-[32px] border border-gray-200 p-4 md:p-6 lg:p-8 backdrop-blur-[200px]"
            style={{ 
              background: 'rgba(242, 242, 247, 0.05)',
              borderColor: 'rgba(64, 64, 64, 0.15)'
            }}
          >
            <div className="w-full flex flex-col gap-8">
              {/* Contact sections with dividers */}
              {ngo.websiteUrl && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 pb-6 md:pb-8 border-b" style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}>
                  <span className="text-lg md:text-xl font-bold">Site:</span>
                  <Link href={ngo.websiteUrl} target="_blank" className="text-base md:text-xl hover:underline break-all">
                    {ngo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </Link>
                </div>
              )}

              {colaboracaoList.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 pb-6 md:pb-8 border-b" style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}>
                  <span className="text-lg md:text-xl font-bold">Tipos de Colaboração</span>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    {colaboracaoList.map((colab, index) => (
                      <React.Fragment key={`colab-${index}`}>
                        <span className="text-base md:text-xl">{colab}</span>
                        {index < colaboracaoList.length - 1 && (
                          <div className="hidden md:block w-[1px] h-full bg-gray-300"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {odsList.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 pb-6 md:pb-8 border-b" style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}>
                  <span className="text-lg md:text-xl font-bold">ODS</span>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    {odsList.map((ods, index) => (
                      <React.Fragment key={`ods-${index}`}>
                        <span className="text-base md:text-xl">ODS {ods.numero}</span>
                        {index < odsList.length - 1 && (
                          <div className="hidden md:block w-[1px] h-full bg-gray-300"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 pb-6 md:pb-8 border-b" style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}>
                <span className="text-lg md:text-xl font-bold">Contacto</span>
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <Link href={`mailto:${ngo.email}`} className="text-base md:text-xl hover:underline break-all">
                    {ngo.email}
                  </Link>
                  <div className="hidden md:block w-[1px] h-full bg-gray-300"></div>
                  <Link href={`tel:${ngo.telefone}`} className="text-base md:text-xl hover:underline">
                    {ngo.telefone}
                  </Link>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                <span className="text-lg md:text-xl font-bold">Morada</span>
                <span className="text-base md:text-xl">{ngo.localizacao}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
