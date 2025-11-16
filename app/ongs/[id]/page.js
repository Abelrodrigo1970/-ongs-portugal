import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getNGOById, getRelatedNGOs } from '@/lib/repositories/ngos';
import { getEventsByNGO } from '@/lib/repositories/events';
import CompactEventCard from '@/components/CompactEventCard';
import MetricBanner from '@/components/ngo/MetricBanner';
import AreaBanner from '@/components/ngo/AreaBanner';
import { getAreaIcon } from '@/lib/utils/areaIcons';
import ResponsiveVideo from '@/components/ResponsiveVideo';
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
  const colaboracaoList = ngo.colaboracao?.map(colab => colab.tipo.nome) || [];
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
        <div className="relative w-full h-[450px]">
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
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(242,242,247,0) 67.696%, rgba(242,242,247,1) 94.162%)'
            }}
          />
        </div>
      )}

      {/* About us section */}
      <div className="w-full flex flex-col items-start relative" style={{ width: '1440px', margin: '0 auto' }}>
        <div className="w-full flex flex-col gap-2 items-center px-16 py-2" style={{ padding: '8px 64px' }}>
          <div 
            className="w-full max-w-[920px] flex flex-col items-center relative z-10"
            style={{ 
              paddingTop: ngo.imagem ? '0px' : '304px',
              paddingBottom: '0px',
              marginTop: ngo.imagem ? '-200px' : '0px',
              gap: '32px'
            }}
          >
            {/* Frame 403 - Header Card */}
            <div 
              className="w-[918px] flex flex-col items-center rounded-[32px] border border-solid backdrop-blur-[100px]"
              style={{ 
                background: 'rgba(248, 250, 252, 0.05)',
                borderColor: '#cbd5e1',
                padding: '40px'
              }}
            >
              {/* Top Row: Logo + Title + Location/Website */}
              <div className="w-full flex items-center" style={{ padding: '0' }}>
                <div className="flex-1 flex gap-2 items-center justify-center min-w-0">
                  {ngo.logo && (
                    <div 
                      className="relative rounded-full overflow-hidden flex-shrink-0"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <Image
                        src={ngo.logo}
                        alt={`${ngo.nome} logo`}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h1 
                    className="flex-1 font-semibold whitespace-pre-wrap min-w-0"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '40px',
                      lineHeight: '1.2',
                      color: '#020617'
                    }}
                  >
                    {ngo.nome}
                  </h1>
                </div>

                <div className="flex gap-2 items-center justify-center flex-shrink-0" style={{ padding: '0' }}>
                  <div className="flex gap-1 items-center">
                    <MapPin style={{ width: '16px', height: '16px', color: '#64748b' }} />
                    <span 
                      className="font-normal"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.5',
                        color: '#64748b'
                      }}
                    >
                      {ngo.localizacao}
                    </span>
                  </div>
                  
                  {ngo.websiteUrl && (
                    <>
                      <div style={{ background: '#e2e8f0', width: '1px', height: '24px' }} />
                      <div className="flex gap-1 items-center">
                        <Globe style={{ width: '16px', height: '16px', color: '#64748b' }} />
                        <Link 
                          href={ngo.websiteUrl}
                          target="_blank"
                          className="font-normal hover:underline"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '16px',
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
                  className="w-full flex flex-nowrap gap-4 items-center justify-center overflow-hidden"
                  style={{ padding: '32px 0' }}
                >
                  {heroAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="flex-shrink-0 flex gap-2 items-center justify-center rounded-[8px] border border-solid"
                      style={{ 
                        borderColor: '#64748b',
                        padding: '4px 16px'
                      }}
                    >
                      <span 
                        className="font-semibold whitespace-nowrap"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
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
                        padding: '4px 16px'
                      }}
                    >
                      <span 
                        className="font-semibold whitespace-nowrap"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
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
              <div className="w-full flex gap-4 items-center justify-center" style={{ padding: '0' }}>
                <button 
                  className="flex-1 flex gap-2 items-center justify-center rounded-[100px]"
                  style={{
                    background: '#155dfc',
                    padding: '8px 24px'
                  }}
                >
                  <span 
                    className="font-bold"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      lineHeight: '1.75',
                      color: '#f1f5f9'
                    }}
                  >
                    Quero colaborar
                  </span>
                  <ArrowRight style={{ width: '24px', height: '24px', color: '#f1f5f9' }} />
                </button>
                <button 
                  className="flex-1 flex gap-2 items-center justify-center rounded-[100px] border-2 border-solid"
                  style={{
                    borderColor: '#cbd5e1',
                    padding: '8px 24px'
                  }}
                >
                  <span 
                    className="font-bold"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      lineHeight: '1.75',
                      color: '#020617'
                    }}
                  >
                    Seguir ONG
                  </span>
                  <Bookmark style={{ width: '24px', height: '24px', color: '#020617' }} />
                </button>
              </div>
            </div>

            {/* Frame 428 - About Text */}
            <div className="w-full flex flex-col items-start" style={{ width: '920px' }}>
              <div className="w-full flex flex-col gap-4 items-start" style={{ padding: '16px 0 32px 0' }}>
                <h2 
                  className="font-semibold w-full whitespace-pre-wrap"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '40px',
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
                    className="font-normal whitespace-pre-wrap"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      lineHeight: '1.75',
                      color: '#595959',
                      width: '918px'
                    }}
                  >
                    {ngo.descricao}
                  </p>
                </div>
              </div>
            </div>

            {/* About us - Métrica */}
            {impactosData.length > 0 && (
              <div className="w-full flex items-center justify-between" style={{ padding: '0 16px', width: '920px' }}>
                <div className="flex-1 flex gap-[60px] items-center justify-center" style={{ background: 'rgba(242, 242, 247, 0.05)' }}>
                  {impactosData.slice(0, 3).map((impact, index) => (
                    <React.Fragment key={index}>
                      <div style={{ width: '188px', height: '94px' }}>
                        <MetricBanner 
                          value={impact.valor || ''}
                          label={impact.descricao}
                        />
                      </div>
                      {index < 2 && (
                        <div style={{ background: '#e2e8f0', width: '1px', height: '64px' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Áreas de Atuação */}
            {areasList.length > 0 && (
              <div className="w-full flex flex-col gap-4 items-start" style={{ width: '920px' }}>
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div 
                      className="w-full flex gap-1 items-center"
                      style={{ padding: '0 0 16px 0' }}
                    >
                      <h3 
                        className="font-semibold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '40px',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Áreas de Atuação
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-6 items-start" style={{ gap: '24px' }}>
                  <div 
                    className="w-full flex flex-wrap gap-6 items-center justify-center overflow-clip"
                    style={{ gap: '24px' }}
                  >
                    {areasList.map((area, index) => {
                      const iconPath = getAreaIcon(area);
                      return (
                        <AreaBanner 
                          key={index}
                          icon={iconPath ? (
                            <img 
                              src={iconPath}
                              alt={area}
                              style={{ width: '100%', height: '100%' }}
                            />
                          ) : null}
                          name={area}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Próximos Eventos */}
            {ngoEvents.length > 0 && (
              <div className="w-full flex flex-col gap-6 items-start" style={{ width: '920px', gap: '24px' }}>
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div 
                      className="w-full flex gap-1 items-center"
                      style={{ padding: '8px 0' }}
                    >
                      <h3 
                        className="font-semibold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '40px',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Próximos eventos
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full flex gap-6 items-start" style={{ gap: '24px' }}>
                  {ngoEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex-1" style={{ minWidth: '0' }}>
                      <CompactEventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vídeo Section */}
            <div 
              className="w-full flex flex-col gap-2 items-start"
              style={{ padding: '32px 0 60px 0', width: '920px' }}
            >
              <div className="w-full flex flex-col gap-2 items-start">
                {ngo.videoUrl ? (
                  <ResponsiveVideo
                    url={ngo.videoUrl}
                    title={`Vídeo da ${ngo.nome}`}
                    className="w-full"
                    style={{ height: '472.5px', borderRadius: '4px' }}
                  />
                ) : (
                  <div 
                    className="w-full relative rounded-[4px] overflow-hidden"
                    style={{ height: '472.5px', backgroundColor: '#f1f5f9' }}
                  >
                    <p 
                      className="absolute inset-0 flex items-center justify-center text-gray-500"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: '1.5' }}
                    >
                      Esta ONG ainda não adicionou um vídeo institucional.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Projetos em destaque */}
            {projetosToDisplay.length > 0 && (
              <div className="w-full flex flex-col gap-16 items-start" style={{ width: '920px', gap: '64px' }}>
                {projetosToDisplay.map((project, index) => {
                  const isEven = index % 2 === 1; // Alternar layout
                  return (
                    <div
                      key={`${project.titulo}-${index}`}
                      className="flex gap-6 items-center"
                      style={{ borderRadius: '32px', gap: '24px' }}
                    >
                      {!isEven && project.imagem && (
                        <div
                          className="relative overflow-hidden rounded-[16px] flex-shrink-0"
                          style={{ width: '290px', height: index === 0 ? '266px' : index === 1 ? '277px' : '298px' }}
                        >
                          <Image
                            src={project.imagem}
                            alt={project.titulo}
                            fill
                            sizes="290px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col gap-2 text-left" style={{ width: '606px', gap: '8px' }}>
                        <h4
                          className="font-semibold"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '24px',
                            lineHeight: '1.4',
                            color: '#1e293b',
                            width: '526px'
                          }}
                        >
                          {project.titulo}
                        </h4>
                        <p
                          className="font-normal whitespace-pre-wrap"
                          style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            fontSize: '18px',
                            lineHeight: '1.75',
                            color: '#595959',
                            width: '606px'
                          }}
                        >
                          {project.descricao}
                        </p>
                      </div>

                      {isEven && project.imagem && (
                        <div
                          className="relative overflow-hidden rounded-[16px] flex-shrink-0"
                          style={{ width: '290px', height: index === 0 ? '266px' : index === 1 ? '277px' : '298px' }}
                        >
                          <Image
                            src={project.imagem}
                            alt={project.titulo}
                            fill
                            sizes="290px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Frame 403 - Informações Adicionais Section */}
            <div 
              className="w-[918px] flex flex-col items-center rounded-[32px] border border-solid backdrop-blur-[100px]"
              style={{ 
                background: 'rgba(242, 242, 247, 0.05)',
                borderColor: 'rgba(64, 64, 64, 0.15)',
                padding: '24px 32px 32px 32px',
                gap: '32px',
                width: '918px'
              }}
            >
              {/* Site */}
              {ngo.websiteUrl && (
                <div className="w-full flex flex-col items-start" style={{ width: '854px' }}>
                  <div className="w-full flex flex-col items-start justify-between" style={{ height: '40px' }}>
                    <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Site:
                      </span>
                        <Link 
                          href={ngo.websiteUrl}
                          target="_blank"
                          className="font-normal underline hover:no-underline"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '20px',
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
                  </div>
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '854px', height: '1px', marginTop: '32px' }} />
                </div>
              )}

              {/* Tipos de Colaboração */}
              {colaboracaoList.length > 0 && (
                <div className="w-full flex flex-col items-start" style={{ width: '854px' }}>
                  <div className="w-full flex flex-col items-start justify-center">
                    <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Tipos de Colaboração
                      </span>
                      <div className="flex items-center" style={{ gap: '16px' }}>
                        {colaboracaoList.map((colab, index) => {
                          // Map collaboration types to emojis
                          const emojiMap = {
                            'Voluntariado presencial': '🤝',
                            'Voluntariado remoto': '🤝',
                            'Voluntariado': '🤝',
                            'Donativos em espécie': '🧩',
                            'Donativos monetários': '🧩',
                            'Recursos': '🧩',
                            'Mentoria': '💡',
                            'Parcerias': '🤝',
                            'Patrocínios': '💼'
                          };
                          const emoji = emojiMap[colab] || '';
                          
                          return (
                            <React.Fragment key={index}>
                              <span 
                                className="font-normal"
                                style={{ 
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '20px',
                                  lineHeight: '1.2',
                                  color: '#1e293b'
                                }}
                              >
                                {colab} {emoji}
                              </span>
                              {index < colaboracaoList.length - 1 && (
                                <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '854px', height: '1px', marginTop: '32px' }} />
                </div>
              )}

              {/* ODS */}
              <div className="w-full flex flex-col items-start" style={{ width: '854px' }}>
                <div className="w-full flex flex-col items-start justify-between" style={{ height: '40px' }}>
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1e1e1e'
                      }}
                    >
                      ODS
                    </span>
                    <span 
                      className="font-normal underline"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
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
                </div>
                <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '854px', height: '1px', marginTop: '32px' }} />
              </div>

              {/* Redes Sociais */}
              {(ngo.instagramUrl || ngo.facebookUrl || ngo.linkedinUrl || ngo.tiktokUrl) && (
                <div className="w-full flex flex-col items-start" style={{ width: '854px' }}>
                  <div className="w-full flex flex-col items-start justify-center">
                    <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1e1e1e'
                        }}
                      >
                        Redes Sociais:
                      </span>
                      <div className="flex items-center" style={{ gap: '16px' }}>
                        {ngo.facebookUrl && (
                          <Link 
                            href={ngo.facebookUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '20px',
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
                          <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                        )}
                        {ngo.tiktokUrl && (
                          <Link 
                            href={ngo.tiktokUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '20px',
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
                          <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                        )}
                        {ngo.linkedinUrl && (
                          <Link 
                            href={ngo.linkedinUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '20px',
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
                          <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                        )}
                        {ngo.instagramUrl && (
                          <Link 
                            href={ngo.instagramUrl}
                            target="_blank"
                            className="font-normal underline hover:no-underline"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '20px',
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
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '854px', height: '1px', marginTop: '32px' }} />
                </div>
              )}

              {/* Contacto */}
              <div className="w-full flex flex-col items-start" style={{ width: '854px' }}>
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1e1e1e'
                      }}
                    >
                      Contacto
                    </span>
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <span 
                        className="font-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1e293b'
                        }}
                      >
                        {ngo.email}
                      </span>
                      <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '24px' }} />
                      <span 
                        className="font-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1e293b'
                        }}
                      >
                        {ngo.telefone}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '854px', height: '1px', marginTop: '32px' }} />
              </div>

              {/* Morada */}
              <div className="w-full flex flex-col items-start" style={{ width: '854px' }}>
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1e1e1e'
                      }}
                    >
                      Morada
                    </span>
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <span 
                        className="font-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1e293b'
                        }}
                      >
                        {ngo.morada || ngo.localizacao}
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
