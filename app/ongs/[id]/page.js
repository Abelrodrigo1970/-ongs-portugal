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
            className="w-full max-w-[918px] flex flex-col items-center relative z-10"
            style={{ 
              paddingTop: ngo.imagem ? '0px' : '304px',
              paddingBottom: '40px',
              marginTop: ngo.imagem ? '-200px' : '0px',
              gap: '40px'
            }}
          >
            {/* Frame 403 - Header Card */}
            <div 
              className="w-[918px] flex flex-col items-center rounded-[32px] border border-solid backdrop-blur-[100px]"
              style={{ 
                background: 'rgba(242, 242, 247, 0.05)',
                borderColor: 'rgba(64, 64, 64, 0.15)',
                padding: '32px'
              }}
            >
              {/* Top Row: Logo + Title + Location/Website */}
              <div className="w-full flex items-center">
                <div className="flex-1 flex gap-2 items-center justify-center">
                  {ngo.logo && (
                    <div 
                      className="relative rounded-[200px] overflow-hidden"
                      style={{ width: '56px', height: '58px', background: '#EF4037' }}
                    >
                      <Image
                        src={ngo.logo}
                        alt={`${ngo.nome} logo`}
                        width={56}
                        height={58}
                        className="object-contain"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                  )}
                  <h1 
                    className="flex-1 font-extrabold whitespace-pre-wrap"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '48px',
                      lineHeight: '1.2',
                      color: '#404040'
                    }}
                  >
                    {ngo.nome}
                  </h1>
                </div>

                <div className="flex gap-4 items-center justify-center" style={{ padding: '8px 0' }}>
                  <div className="flex gap-1 items-center">
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    <span 
                      className="font-medium"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.2',
                        color: '#595959'
                      }}
                    >
                      {ngo.localizacao}
                    </span>
                  </div>
                  
                  {ngo.websiteUrl && (
                    <>
                      <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                      <div className="flex gap-1 items-center">
                        <Globe style={{ width: '16px', height: '16px' }} />
                        <Link 
                          href={ngo.websiteUrl}
                          target="_blank"
                          className="font-medium hover:underline"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '16px',
                            lineHeight: '1.2',
                            color: '#595959'
                          }}
                        >
                          {ngo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tags - Tipos de Colaboração */}
              {colaboracaoList.length > 0 && (
                <div 
                  className="w-full flex gap-4 items-center overflow-clip"
                  style={{ padding: '40px 0 40px 8px' }}
                >
                  {colaboracaoList.map((colab, index) => (
                    <div 
                      key={index}
                      className="flex gap-2 items-center justify-center rounded-[200px] border border-solid"
                      style={{ 
                        borderColor: 'rgba(64, 64, 64, 0.5)',
                        padding: '8px 16px'
                      }}
                    >
                      <span 
                        className="font-semibold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          color: 'rgba(64, 64, 64, 0.5)'
                        }}
                      >
                        {colab}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="w-full flex gap-4 items-center justify-center">
                <button 
                  className="flex-1 flex gap-4 items-center justify-center rounded-[100px]"
                  style={{
                    background: 'var(--color-button-primary)',
                    padding: '16px 12px'
                  }}
                >
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '20px',
                      lineHeight: 'normal',
                      color: '#F2F2F7'
                    }}
                  >
                    Quero colaborar
                  </span>
                  <ArrowRight style={{ width: '24px', height: '24px' }} />
                </button>
                <button 
                  className="flex-1 flex gap-4 items-center justify-center rounded-[100px] border border-solid"
                  style={{
                    borderColor: 'rgba(64, 64, 64, 0.15)',
                    padding: '16px 12px'
                  }}
                >
                  <span 
                    className="font-semibold"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '20px',
                      lineHeight: 'normal',
                      color: '#595959'
                    }}
                  >
                    Seguir ONG
                  </span>
                  <Bookmark style={{ width: '24px', height: '24px' }} />
                </button>
              </div>
            </div>

            {/* Frame 428 - About Text */}
            <div className="w-full flex flex-col items-start">
              <div className="w-full flex flex-col items-start">
                <div 
                  className="w-full flex flex-col gap-4 items-start"
                  style={{ height: '65px' }}
                >
                  <h2 
                    className="font-bold w-full whitespace-pre-wrap"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '39px',
                      lineHeight: '1.4',
                      color: '#404040'
                    }}
                  >
                    {ngo.missao 
                      ? (ngo.missao.length > 45 ? ngo.missao.substring(0, 45) + '...' : ngo.missao)
                      : 'Transformamos vidas, todos os dias.'}
                  </h2>
                </div>
              </div>
              <div className="flex gap-2 items-center justify-center" style={{ padding: '8px 0' }}>
                <p 
                  className="font-medium whitespace-pre-wrap"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '20px',
                    lineHeight: '1.4',
                    color: '#595959',
                    width: '918px'
                  }}
                >
                  {ngo.descricao}
                </p>
              </div>
            </div>

            {/* About us - Métrica */}
            {impactMetrics.length > 0 && (
              <div className="w-full flex gap-6 items-center">
                <div className="flex-1 flex items-center" style={{ background: 'rgba(242, 242, 247, 0.05)' }}>
                  {impactMetrics.slice(0, 3).map((metric, index) => (
                    <div key={index} className="flex-1">
                      <MetricBanner 
                        value={index === 0 ? "755" : index === 1 ? "187" : "27.630"}
                        label={metric}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Áreas de Atuação */}
            {areasList.length > 0 && (
              <div className="w-full flex flex-col gap-4 items-start">
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div 
                      className="w-full flex gap-1 items-center"
                      style={{ padding: '0 0 32px 0' }}
                    >
                      <h3 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '39px',
                          lineHeight: '1.2',
                          color: '#1E1E1E'
                        }}
                      >
                        Áreas de Atuação
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-6 items-center justify-center">
                  <div 
                    className="w-full flex flex-wrap gap-8 items-center justify-center overflow-clip"
                    style={{ gap: '32px' }}
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

            {/* Projetos em destaque */}
            {projetosToDisplay.length > 0 && (
              <div className="w-full flex flex-col gap-6 items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex gap-1 items-center" style={{ padding: '8px 0' }}>
                    <h3
                      className="font-bold"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '39px',
                        lineHeight: '1.2',
                        color: '#1E1E1E'
                      }}
                    >
                      Projetos em destaque
                    </h3>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-10">
                  {projetosToDisplay.map((project, index) => (
                    <div
                      key={`${project.titulo}-${index}`}
                      className="flex flex-col md:flex-row gap-6 items-center md:items-start"
                      style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px' }}
                    >
                      {project.imagem && (
                        <div
                          className="relative overflow-hidden rounded-[24px]"
                          style={{ width: '260px', height: '200px', flexShrink: 0 }}
                        >
                          <Image
                            src={project.imagem}
                            alt={project.titulo}
                            fill
                            sizes="(max-width: 768px) 100vw, 260px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col gap-3 text-left">
                        <h4
                          className="font-bold"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '28px',
                            lineHeight: '1.3',
                            color: '#1E1E1E'
                          }}
                        >
                          {project.titulo}
                        </h4>
                        <p
                          className="text-base text-gray-600 whitespace-pre-wrap"
                          style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
                        >
                          {project.descricao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximos Eventos */}
            {ngoEvents.length > 0 && (
              <div className="w-full flex flex-col gap-6 items-start">
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div 
                      className="w-full flex gap-1 items-center"
                      style={{ padding: '8px 0' }}
                    >
                      <h3 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '39px',
                          lineHeight: '1.2',
                          color: '#1E1E1E'
                        }}
                      >
                        Próximos eventos
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full flex gap-6 items-start">
                  {ngoEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex-1">
                      <CompactEventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            <div 
              className="w-full flex flex-col gap-2 items-start"
              style={{ padding: '32px 0 60px 0' }}
            >
              <div className="w-full flex flex-col gap-2 items-start">
                {ngo.videoUrl ? (
                  <ResponsiveVideo
                    url={ngo.videoUrl}
                    title={`Vídeo da ${ngo.nome}`}
                  />
                ) : (
                  <p 
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}
                  >
                    Esta ONG ainda não adicionou um vídeo institucional.
                  </p>
                )}
              </div>
            </div>

            {/* Frame 403 - Informações Adicionais Section */}
            <div 
              className="w-[918px] flex flex-col items-center rounded-[32px] border border-solid backdrop-blur-[100px]"
              style={{ 
                background: 'rgba(242, 242, 247, 0.05)',
                borderColor: 'rgba(64, 64, 64, 0.15)',
                padding: '24px 32px 32px 32px',
                gap: '32px'
              }}
            >
              {/* Site */}
              {ngo.websiteUrl && (
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-between" style={{ height: '40px' }}>
                    <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1E1E1E'
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
                            color: '#404040',
                            textUnderlinePosition: 'from-font',
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid'
                          }}
                        >
                          {ngo.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Tipos de Colaboração */}
              {colaboracaoList.length > 0 && (
                <div className="w-full flex flex-col items-start">
                  <div className="w-full flex flex-col items-start justify-center">
                    <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                      <span 
                        className="font-bold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#1E1E1E'
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
                                  color: '#404040'
                                }}
                              >
                                {colab} {emoji}
                              </span>
                              {index < colaboracaoList.length - 1 && (
                                <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ODS */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1E1E1E'
                      }}
                    >
                      ODS
                    </span>
                    <div className="flex gap-2 items-center flex-wrap justify-end">
                      {odsList.length > 0 ? (
                        odsList.map((ods) => (
                          <div 
                            key={ods.id} 
                            className="relative rounded-lg overflow-hidden" 
                            style={{ width: '40px', height: '40px' }}
                          >
                            <Image
                              src={`/ods/ods-${ods.numero.toString().padStart(2, '0')}.png`}
                              alt={`ODS ${ods.numero} - ${ods.nome}`}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <span 
                          className="font-normal underline"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '20px',
                            lineHeight: '1.2',
                            color: '#404040',
                            textUnderlinePosition: 'from-font',
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid'
                          }}
                        >
                          -
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1E1E1E'
                      }}
                    >
                      Redes Sociais:
                    </span>
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <span 
                        className="font-normal underline"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#404040',
                          textUnderlinePosition: 'from-font',
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid'
                        }}
                      >
                        Facebook
                      </span>
                      <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                      <span 
                        className="font-normal underline"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#404040',
                          textUnderlinePosition: 'from-font',
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid'
                        }}
                      >
                        Tiktok
                      </span>
                      <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                      <span 
                        className="font-normal underline"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#404040',
                          textUnderlinePosition: 'from-font',
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid'
                        }}
                      >
                        Linkedin
                      </span>
                      <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                      {ngo.instagramUrl ? (
                        <Link 
                          href={ngo.instagramUrl}
                          target="_blank"
                          className="font-normal underline hover:no-underline"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '20px',
                            lineHeight: '1.2',
                            color: '#404040',
                            textUnderlinePosition: 'from-font',
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid'
                          }}
                        >
                          Instagram
                        </Link>
                      ) : (
                        <span 
                          className="font-normal underline"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '20px',
                            lineHeight: '1.2',
                            color: '#404040',
                            textUnderlinePosition: 'from-font',
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid'
                          }}
                        >
                          Instagram
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1E1E1E'
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
                          color: '#404040'
                        }}
                      >
                        {ngo.email}
                      </span>
                      <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                      <span 
                        className="font-normal"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '20px',
                          lineHeight: '1.2',
                          color: '#404040'
                        }}
                      >
                        {ngo.telefone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Morada */}
              <div className="w-full flex flex-col items-start">
                <div className="w-full flex flex-col items-start justify-center">
                  <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        lineHeight: '1.2',
                        color: '#1E1E1E'
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
                          color: '#404040'
                        }}
                      >
                        {ngo.localizacao}
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
