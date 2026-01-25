import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getNGOById, getRelatedNGOs } from '@/lib/repositories/ngos';
import { getEventsByNGO } from '@/lib/repositories/events';
import MetricBanner from '@/components/ngo/MetricBanner';
import AreaBanner from '@/components/ngo/AreaBanner';
import ResponsiveVideo from '@/components/ResponsiveVideo';
import EventsSection from '@/components/ngo/EventsSection';
import { 
  MapPin, 
  Globe,
  ArrowRight,
  Bookmark
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
  const colaboracaoList =
    ngo.colaboracao?.map(colab => ({
      nome: colab.tipo.nome,
      emoji: colab.tipo.emoji || ''
    })) || [];
  const projetos = ngo.projetos || [];
  const impactosData = ngo.impactos && ngo.impactos.length > 0
    ? [...ngo.impactos].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
    : [];
  const maxHeroAreas = 3;
  const heroAreas = areasList.slice(0, maxHeroAreas);
  const extraAreasCount = Math.max(areasList.length - heroAreas.length, 0);
  const defaultProjetos = [
    {
      titulo: 'Trabalhamos todos os dias',
      descricao:
        'A Associação CAIS mantém como um dos seus principais objetivos a promoção da (re)integração no mercado de trabalho das pessoas em situação de vulnerabilidade.\n\nAtravés de programas de capacitação, acompanhamento social e projetos de empregabilidade, a CAIS procura melhorar as condições de vida de todos os que acompanha.',
      imagem: '/images/projects/project-daily.png'
    },
    {
      titulo: 'Projecto Futebol de Rua',
      descricao:
        'Iniciado em 2004, pela Associação CAIS, em parceria com inúmeras entidades públicas e privadas, promove a prática desportiva e a sua utilização como estratégia inovadora de intervenção e promoção da inclusão social.',
      imagem: '/images/projects/project-futebol-rua.png'
    },
    {
      titulo: 'Projecto Abrigo',
      descricao:
        'Desde 2003, o conceito de Responsabilidade Social Empresarial tem vindo a ser cada vez mais integrado na atividade das empresas.\n\nO Projeto Abrigo integra-se nos objetivos sociais das empresas que assumem preocupações sociais nas suas práticas empresariais, desempenhando um papel fundamental na sustentação da atividade da CAIS.',
      imagem: '/images/projects/project-abrigo.png'
    }
  ];
  const projetosToDisplay = projetos.length > 0 ? projetos : defaultProjetos;

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
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Hero Section with background image */}
      {ngo.imagem && (
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden rounded-b-[200px]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={ngo.imagem}
              alt={ngo.nome}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: '50% 50%' }}
              priority
            />
          </div>
          {/* Gradient Overlay - match Figma .hero */}
          <div 
            className="absolute inset-0 flex flex-col items-start"
            style={{
              borderRadius: '0 0 200px 200px',
              background: 'linear-gradient(0deg, rgba(248, 250, 252, 0), rgba(134, 252, 219, 0.25) 50%, rgba(21, 93, 252, 0.5))'
            }}
          />
        </div>
      )}

      {/* About us section */}
      <div className="w-full flex flex-col items-start relative max-w-[1440px] mx-auto">
        <div className="w-full flex flex-col gap-2 items-center px-4 sm:px-8 md:px-16 py-2">
          <div 
            className="w-full max-w-[920px] flex flex-col items-center relative z-10 px-4 sm:px-6 md:px-0"
            style={{ 
              paddingTop: ngo.imagem ? '0px' : '40px',
              paddingBottom: '0px',
              marginTop: ngo.imagem ? '-60px' : '0px',
              gap: '24px'
            }}
          >
            {/* Frame 403 - Header Card */}
            <div 
              className="w-full max-w-[918px] flex flex-col items-center rounded-[24px] md:rounded-[32px] border border-solid backdrop-blur-[100px] px-4 sm:px-6 md:px-10"
              style={{ 
                background: 'rgba(248, 250, 252, 0.05)',
                borderColor: '#cbd5e1',
                paddingTop: '20px',
                paddingBottom: '20px'
              }}
            >
              {/* Top Row: Logo + Title + Location/Website */}
              <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0" style={{ padding: '0' }}>
                <div className="flex-1 flex gap-2 items-center justify-start sm:justify-center min-w-0 w-full sm:w-auto">
                  {ngo.logo && (
                    <div 
                      className="relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <Image
                        src={ngo.logo}
                        alt={`${ngo.nome} logo`}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                  <h1 
                    className="flex-1 font-semibold whitespace-pre-wrap min-w-0 text-2xl sm:text-3xl md:text-[40px]"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.2',
                      color: '#020617'
                    }}
                  >
                    {ngo.nome}
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-start sm:items-center justify-start sm:justify-center flex-shrink-0 w-full sm:w-auto" style={{ padding: '0' }}>
                  <div className="flex gap-1 items-center">
                    <MapPin style={{ width: '16px', height: '16px', color: '#64748b' }} />
                    <span 
                      className="font-normal text-sm sm:text-base"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.5',
                        color: '#64748b'
                      }}
                    >
                      {ngo.localizacao}
                    </span>
                  </div>
                  
                  {ngo.websiteUrl && (
                    <>
                      <div className="hidden sm:block" style={{ background: '#e2e8f0', width: '1px', height: '24px' }} />
                      <div className="flex gap-1 items-center">
                        <Globe style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        <Link 
                          href={ngo.websiteUrl}
                          target="_blank"
                          className="font-normal hover:underline text-sm sm:text-base"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: '1.5',
                            color: '#64748b'
                          }}
                        >
                          {ngo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tags - Áreas de Atuação */}
              {heroAreas.length > 0 && (
                <div 
                  className="w-full flex flex-wrap gap-2 sm:gap-4 items-center justify-center overflow-hidden"
                  style={{ padding: '24px 0' }}
                >
                  {heroAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="flex-shrink-0 flex gap-2 items-center justify-center rounded-[8px] border border-solid"
                      style={{ 
                        borderColor: '#64748b',
                        padding: '4px 12px'
                      }}
                    >
                      <span 
                        className="font-semibold whitespace-nowrap text-xs sm:text-sm"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.4',
                          color: '#64748b'
                        }}
                      >
                        {area}
                      </span>
                    </div>
                  ))}
                  {extraAreasCount > 0 && (
                    <div 
                      className="flex-shrink-0 flex gap-2 items-center justify-center rounded-[8px] border border-solid"
                      style={{ 
                        borderColor: 'rgba(64, 64, 64, 0.15)',
                        padding: '4px 12px'
                      }}
                    >
                      <span 
                        className="font-semibold whitespace-nowrap text-xs sm:text-sm"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.4',
                          color: '#64748b'
                        }}
                      >
                        +{extraAreasCount}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center" style={{ padding: '0' }}>
                <button 
                  className="flex-1 flex gap-2 items-center justify-center rounded-[100px]"
                  style={{
                    background: '#155dfc',
                    padding: '8px 20px'
                  }}
                >
                  <span 
                    className="font-bold text-sm sm:text-base md:text-lg"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.75',
                      color: '#f1f5f9'
                    }}
                  >
                    Próximos Eventos
                  </span>
                  <ArrowRight className="hidden sm:block" style={{ width: '20px', height: '20px', color: '#f1f5f9' }} />
                </button>
                <button 
                  className="flex-1 flex gap-2 items-center justify-center rounded-[100px] border-2 border-solid"
                  style={{
                    borderColor: '#cbd5e1',
                    padding: '8px 20px'
                  }}
                >
                  <span 
                    className="font-bold text-sm sm:text-base md:text-lg"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.75',
                      color: '#020617'
                    }}
                  >
                    Seguir ONG
                  </span>
                  <Bookmark className="hidden sm:block" style={{ width: '20px', height: '20px', color: '#020617' }} />
                </button>
              </div>
            </div>

            {/* Frame 428 - About Text */}
            <div className="w-full flex flex-col items-start max-w-[920px] px-4 sm:px-6 md:px-0">
              <div className="w-full flex flex-col gap-4 items-start" style={{ padding: '16px 0 24px 0' }}>
                <h2 
                  className="font-semibold w-full whitespace-pre-wrap text-2xl sm:text-3xl md:text-[40px]"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.2',
                    color: '#1e293b'
                  }}
                >
                  {ngo.missao 
                    ? (ngo.missao.length > 45 ? ngo.missao.substring(0, 45) + '...' : ngo.missao)
                    : 'Transformamos vidas, todos os dias.'}
                </h2>
                <div style={{ padding: '8px 0' }}>
                  <p 
                    className="font-normal whitespace-pre-wrap text-base sm:text-lg w-full"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.75',
                      color: '#595959'
                    }}
                  >
                    {ngo.descricao}
                  </p>
                </div>
              </div>
            </div>

            {/* About us - Métrica */}
            {impactosData.length > 0 && (
              <div className="w-full flex items-center justify-center max-w-[920px] px-4 sm:px-6 md:px-0">
                <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-[60px] items-center justify-center px-4 sm:px-8" style={{ background: 'rgba(242, 242, 247, 0.05)', borderRadius: '16px', padding: '16px' }}>
                  {impactosData.slice(0, 3).map((impact, index) => (
                    <React.Fragment key={index}>
                      <div className="w-full sm:w-auto" style={{ minWidth: '150px', maxWidth: '188px' }}>
                        <MetricBanner 
                          value={impact.valor || ''}
                          label={impact.descricao}
                        />
                      </div>
                      {index < 2 && (
                        <div className="hidden sm:block" style={{ background: '#e2e8f0', width: '1px', height: '64px' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Áreas de Atuação */}
            {areasList.length > 0 && (
              <div className="w-full flex flex-col gap-4 items-start max-w-[920px] px-4 sm:px-6 md:px-0">
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div 
                      className="w-full flex gap-1 items-center"
                      style={{ padding: '0 0 16px 0' }}
                    >
                      <h3 
                        className="font-semibold text-2xl sm:text-3xl md:text-[40px]"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Causas Principais
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-6 items-start" style={{ gap: '16px' }}>
                  <div 
                    className="w-full flex flex-wrap gap-4 sm:gap-6 items-center justify-center overflow-clip"
                  >
                    {areasList.map((area, index) => (
                      <AreaBanner 
                        key={index}
                        name={area}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Próximos Eventos */}
            <EventsSection events={ngoEvents} />

            {/* Vídeo Section */}
            <div 
              className="w-full flex flex-col gap-2 items-start max-w-[920px] px-4 sm:px-6 md:px-0"
              style={{ padding: '24px 0 40px 0' }}
            >
              <div className="w-full flex flex-col gap-2 items-start">
                {ngo.videoUrl ? (
                  <ResponsiveVideo
                    url={ngo.videoUrl}
                    title={`Vídeo da ${ngo.nome}`}
                    className="w-full"
                    style={{ height: 'auto', minHeight: '200px', aspectRatio: '16/9', borderRadius: '4px' }}
                  />
                ) : (
                  <div 
                    className="w-full relative rounded-[4px] overflow-hidden"
                    style={{ height: '200px', minHeight: '200px', aspectRatio: '16/9', backgroundColor: '#f1f5f9' }}
                  >
                    <p 
                      className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm sm:text-base px-4"
                      style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}
                    >
                      Esta ONG ainda não adicionou um vídeo institucional.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Projetos em destaque */}
            {projetosToDisplay.length > 0 && (
              <div className="w-full flex flex-col gap-12 sm:gap-16 items-start max-w-[920px] px-4 sm:px-6 md:px-0">
                {projetosToDisplay.map((project, index) => {
                  const isEven = index % 2 === 1; // Alternar layout (imagem à esquerda/direita)

                  return (
                    <div
                      key={`${project.titulo}-${index}`}
                      className="w-full"
                      style={{
                        width: '100%',
                        borderRadius: '32px',
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '24px'
                      }}
                    >
                      {/* Imagem à esquerda quando não é par */}
                      {!isEven && project.imagem && (
                        <div
                          style={{
                            width: '290px',
                            alignSelf: 'stretch',
                            padding: '4.75px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <div
                            className="relative"
                            style={{ width: '100%', height: '100%', minHeight: '200px' }}
                          >
                            <Image
                              src={project.imagem}
                              alt={project.titulo}
                              fill
                              sizes="(max-width: 640px) 100vw, 290px"
                              className="object-cover"
                              style={{ borderRadius: '16px' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Conteúdo de texto */}
                      <div
                        style={{
                          flex: '1 1 0',
                          display: 'inline-flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}
                      >
                        <div
                          style={{
                            width: '526px',
                            color: '#404040',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '24px',
                            fontWeight: 600,
                            lineHeight: '33.6px',
                            wordWrap: 'break-word'
                          }}
                        >
                          {project.titulo}
                        </div>
                        <div
                          style={{
                            alignSelf: 'stretch',
                            color: '#595959',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '18px',
                            fontWeight: 400,
                            lineHeight: '31.5px',
                            wordWrap: 'break-word'
                          }}
                        >
                          {project.descricao}
                        </div>
                      </div>

                      {/* Imagem à direita quando é par */}
                      {isEven && project.imagem && (
                        <div
                          style={{
                            width: '290px',
                            alignSelf: 'stretch',
                            padding: '4.75px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <div
                            className="relative"
                            style={{ width: '100%', height: '100%', minHeight: '200px' }}
                          >
                            <Image
                              src={project.imagem}
                              alt={project.titulo}
                              fill
                              sizes="(max-width: 640px) 100vw, 290px"
                              className="object-cover"
                              style={{ borderRadius: '16px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Frame 403 - Informações Adicionais Section */}
            <div 
              className="w-full max-w-[918px] flex flex-col items-center rounded-[24px] md:rounded-[32px] border border-solid backdrop-blur-[100px] px-4 sm:px-6 md:px-8"
              style={{ 
                background: 'rgba(242, 242, 247, 0.05)',
                borderColor: 'rgba(64, 64, 64, 0.15)',
                paddingTop: '20px',
                paddingBottom: '20px',
                gap: '24px'
              }}
            >
              {/* Site */}
              {ngo.websiteUrl && (
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" style={{ minHeight: '40px' }}>
                    <span 
                      className="font-bold text-base sm:text-lg md:text-xl"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.2',
                        color: '#1e1e1e'
                      }}
                    >
                      Site:
                    </span>
                      <Link 
                        href={ngo.websiteUrl}
                        target="_blank"
                        className="font-normal underline hover:no-underline text-sm sm:text-base md:text-xl break-all sm:break-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e293b',
                          textUnderlinePosition: 'from-font',
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid'
                        }}
                      >
                        {ngo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </Link>
                  </div>
                  <div className="w-full" style={{ background: 'rgba(64, 64, 64, 0.15)', height: '1px', marginTop: '24px' }} />
                </div>
              )}

              {/* Tipos de Colaboração */}
              {colaboracaoList.length > 0 && (
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold text-base sm:text-lg md:text-xl"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Tipos de Colaboração
                      </span>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        {colaboracaoList.map((colab, index) => (
                          <React.Fragment key={index}>
                            <span 
                              className="font-normal text-sm sm:text-base md:text-xl"
                              style={{ 
                                fontFamily: 'Inter, sans-serif',
                                lineHeight: '1.2',
                                color: '#1e293b'
                              }}
                            >
                              {colab.emoji ? `${colab.emoji} ${colab.nome}` : colab.nome}
                            </span>
                            {index < colaboracaoList.length - 1 && (
                              <div className="hidden sm:block" style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-full" style={{ background: 'rgba(64, 64, 64, 0.15)', height: '1px', marginTop: '24px' }} />
                </div>
              )}

              {/* ODS */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" style={{ minHeight: '40px' }}>
                  <span 
                    className="font-bold text-base sm:text-lg md:text-xl"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.2',
                      color: '#1e1e1e'
                    }}
                  >
                    ODS
                  </span>
                  <span 
                    className="font-normal underline text-sm sm:text-base md:text-xl"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.2',
                      color: '#1e293b',
                      textUnderlinePosition: 'from-font',
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid'
                    }}
                  >
                    -
                  </span>
                </div>
                <div className="w-full" style={{ background: 'rgba(64, 64, 64, 0.15)', height: '1px', marginTop: '24px' }} />
              </div>

              {/* Redes Sociais */}
              {(ngo.instagramUrl || ngo.facebookUrl || ngo.linkedinUrl || ngo.tiktokUrl) && (
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold text-base sm:text-lg md:text-xl"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Redes Sociais:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        {ngo.facebookUrl && (
                          <Link 
                            href={ngo.facebookUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline text-sm sm:text-base md:text-xl"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              lineHeight: '1.2',
                              color: '#1e293b',
                              textUnderlinePosition: 'from-font',
                              textDecorationLine: 'underline',
                              textDecorationStyle: 'solid'
                            }}
                          >
                            Facebook
                          </Link>
                        )}
                        {ngo.facebookUrl && (ngo.tiktokUrl || ngo.linkedinUrl || ngo.instagramUrl) && (
                          <div className="hidden sm:block" style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                        )}
                        {ngo.tiktokUrl && (
                          <Link 
                            href={ngo.tiktokUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline text-sm sm:text-base md:text-xl"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              lineHeight: '1.2',
                              color: '#1e293b',
                              textUnderlinePosition: 'from-font',
                              textDecorationLine: 'underline',
                              textDecorationStyle: 'solid'
                            }}
                          >
                            Tiktok
                          </Link>
                        )}
                        {ngo.tiktokUrl && (ngo.linkedinUrl || ngo.instagramUrl) && (
                          <div className="hidden sm:block" style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                        )}
                        {ngo.linkedinUrl && (
                          <Link 
                            href={ngo.linkedinUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline text-sm sm:text-base md:text-xl"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              lineHeight: '1.2',
                              color: '#1e293b',
                              textUnderlinePosition: 'from-font',
                              textDecorationLine: 'underline',
                              textDecorationStyle: 'solid'
                            }}
                          >
                            Linkedin
                          </Link>
                        )}
                        {ngo.linkedinUrl && ngo.instagramUrl && (
                          <div className="hidden sm:block" style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                        )}
                        {ngo.instagramUrl && (
                          <Link 
                            href={ngo.instagramUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline text-sm sm:text-base md:text-xl"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              lineHeight: '1.2',
                              color: '#1e293b',
                              textUnderlinePosition: 'from-font',
                              textDecorationLine: 'underline',
                              textDecorationStyle: 'solid'
                            }}
                          >
                            Instagram
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full" style={{ background: 'rgba(64, 64, 64, 0.15)', height: '1px', marginTop: '24px' }} />
                </div>
              )}

              {/* Contacto */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold text-base sm:text-lg md:text-xl"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.2',
                        color: '#1e1e1e'
                      }}
                    >
                      Contacto
                    </span>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <span 
                        className="font-normal text-sm sm:text-base md:text-xl break-all sm:break-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e293b'
                        }}
                      >
                        {ngo.email}
                      </span>
                      <div className="hidden sm:block" style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                      <span 
                        className="font-normal text-sm sm:text-base md:text-xl"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e293b'
                        }}
                      >
                        {ngo.telefone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full" style={{ background: 'rgba(64, 64, 64, 0.15)', height: '1px', marginTop: '24px' }} />
              </div>

              {/* Morada */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold text-base sm:text-lg md:text-xl"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.2',
                        color: '#1e1e1e'
                      }}
                    >
                      Morada
                    </span>
                    <div className="flex items-center">
                      <span 
                        className="font-normal text-sm sm:text-base md:text-xl break-all sm:break-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.2',
                          color: '#1e293b'
                        }}
                      >
                        {ngo.morada
                          ? `${ngo.morada}${ngo.localizacao ? ' - ' + ngo.localizacao : ''}`
                          : ngo.localizacao}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
