import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MetricBanner from '@/components/ngo/MetricBanner';
import AreaBanner from '@/components/ngo/AreaBanner';
import ProjectCard from '@/components/ngo/ProjectCard';
import { getAreaIcon } from '@/lib/utils/areaIcons';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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

// Static page
export const dynamic = 'force-static';

export const metadata = {
  title: 'Associação CAIS - ONGs Portugal',
  description: 'A CAIS trabalha há mais de 30 anos para criar oportunidades e promover a inclusão social e profissional de pessoas em situação de vulnerabilidade.',
};

export default function ONG22Page() {
  // Dados estáticos da ONG CAIS baseados no Figma
  const ngo = {
    id: 'cais-ong-22',
    nome: 'Associação CAIS',
    descricao: 'A CAIS trabalha há mais de 30 anos para criar oportunidades e promover a inclusão social e profissional de pessoas em situação de vulnerabilidade. Através dos nossos projetos, ajudamos a reconstruir trajetórias de vida e a devolver dignidade e autonomia a quem mais precisa.',
    missao: 'Transformamos vidas, todos os dias.',
    email: 'cais@cais.pt',
    telefone: '222 071 320',
    localizacao: 'Porto, Portugal',
    latitude: 41.1579,
    longitude: -8.6291,
    websiteUrl: 'https://cais.pt',
    logo: '/images/logo-cais-44eb9c.svg',
    imagem: '/images/ongs/hero-cais-70a430.png',
    impacto: [
      '85% da população sem-abrigo',
      'Acompanhamento a centenas de pessoas',
      'Promoção da (re)integração no mercado de trabalho'
    ],
    ods: [
      { numero: 1, nome: 'Erradicar a pobreza' },
      { numero: 8, nome: 'Trabalho Digno e Crescimento Económico' },
      { numero: 10, nome: 'Redução das Desigualdades' }
    ],
    areaAtuacao: [
      'Inclusão social',
      'Empregabilidade',
      'Comunidade',
      'Formação',
      'Desporto',
      'Cultura',
      'Reinserção',
      'Educação'
    ],
    colaboracao: [
      'Voluntariado 🤝',
      'Recursos 🧩',
      'Mentoria 💡',
      'Capacitação'
    ],
    redesSociais: {
      facebook: 'https://facebook.com/cais',
      tiktok: 'https://tiktok.com/@cais',
      linkedin: 'https://linkedin.com/company/cais',
      instagram: 'https://instagram.com/cais'
    },
    morada: 'Rua da Ribeira Negra 55, 4050-321 Porto'
  };

  const eventos = [
    {
      id: 1,
      nome: 'Doações de Cestas Básicas',
      descricao: 'Evento de distribuição de cestas básicas para famílias carenciadas, ajudando a garantir segurança alimentar durante períodos difíceis.',
      dataInicio: '2024-12-20T10:00:00Z',
      localizacao: 'Rua da Ribeira Negra 55, 4050-321 Porto',
      imagem: '/images/events/event-cestas.png',
      vagas: '10 / 60'
    },
    {
      id: 2,
      nome: 'Futebol de Rua - Evento de Convívio',
      descricao: 'Evento desportivo e de convívio que junta participantes do projecto "Futebol de Rua", comunidade e voluntários para promover inclusão e bem-estar.',
      dataInicio: '2025-01-15T14:00:00Z',
      localizacao: 'Porto, Portugal',
      imagem: '/images/events/event-futebol.png',
      vagas: '10 / 60'
    },
    {
      id: 3,
      nome: 'Convívio de Natal',
      descricao: 'Evento de convívio social que junta toda a comunidade CAIS, voluntários e participantes para celebrar o Natal em conjunto.',
      dataInicio: '2024-12-21T16:00:00Z',
      localizacao: 'Porto, Portugal',
      imagem: '/images/events/event-convivio.png',
      vagas: '10 / 60'
    }
  ];

  const projetos = [
    {
      id: 1,
      titulo: 'Trabalhamos todos os dias',
      descricao: 'A Associação CAIS mantém como um dos seus principais objetivos a promoção da (re)integração no mercado de trabalho das pessoas em situação de vulnerabilidade.\n\nAtravés de programas de capacitação, acompanhamento social e projetos de empregabilidade, a CAIS procura melhorar as condições de vida de todos os que acompanha.​',
      imagem: '/images/projects/project-daily.png'
    },
    {
      id: 2,
      titulo: 'Projecto Futebol de Rua',
      descricao: 'Iniciado em 2004, pela Associação CAIS, em parceria com inúmeras entidades públicas e privadas, promove a prática desportiva e a sua utilização como estratégia inovadora de intervenção e promoção da inclusão social.',
      imagem: '/images/projects/project-futebol-rua.png'
    },
    {
      id: 3,
      titulo: 'Projecto Abrigo',
      descricao: 'Desde 2003, o conceito de Responsabilidade Social Empresarial tem vindo a ser cada vez mais integrado na atividade das empresas.\nO Projeto Abrigo insere-se neste âmbito, ao integrar-se nos objetivos sociais das empresas que, de forma voluntária, assumem preocupações sociais nas suas práticas empresariais. Este projeto desempenha um papel fundamental na sustentação da atividade da CAIS, através de um compromisso com a duração de dois anos.',
      imagem: '/images/projects/project-abrigo.png'
    }
  ];

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      {/* Menu fixo no topo */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ backgroundColor: '#F2F2F7', padding: '32px 64px 0px' }}>
        <div className="w-full max-w-[1440px] rounded-[200px] border-b px-3 py-3 flex items-center justify-between" style={{ backgroundColor: '#F2F2F7', borderColor: '#F2F2F7' }}>
          <div className="w-[176px] h-12">
            <Image src="/images/logo-cais-44eb9c.svg" alt="Logo" width={176} height={48} />
          </div>
          
          <div className="flex items-center gap-10">
            <Link href="#" className="text-sm font-medium uppercase" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Plataforma</Link>
            <Link href="#" className="text-sm font-medium uppercase" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Planos</Link>
            <Link href="#" className="text-sm font-medium uppercase" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Sobre</Link>
            <Link href="#" className="text-sm font-medium uppercase" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Blog</Link>
          </div>
          
          <div className="w-[176px] flex justify-end">
            <button className="w-12 h-12 rounded-full bg-gray-200"></button>
          </div>
        </div>
      </div>

      {/* Hero Section com imagem */}
      <div className="relative w-full h-[450px]">
        <Image
          src={ngo.imagem}
          alt={ngo.nome}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F2F2F7]" style={{ background: 'linear-gradient(180deg, rgba(242, 242, 247, 0) 68%, rgba(242, 242, 247, 1) 94%)' }} />
      </div>

      {/* Conteúdo principal */}
      <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-16">
        {/* About Section - centered, 918px width */}
        <div className="w-full flex flex-col items-center gap-10" style={{ paddingTop: '304px' }}>
          
          {/* Frame 403 - Header Card com logo, title, actions */}
          <div 
            className="w-full max-w-[918px] rounded-[32px] border p-8"
            style={{ 
              background: 'rgba(242, 242, 247, 0.05)',
              borderColor: 'rgba(64, 64, 64, 0.15)',
              backdropFilter: 'blur(200px)'
            }}
          >
            {/* Frame 439 - Top Row: Logo + Title + Location/Website */}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              {/* Logo and Title */}
              <div className="flex items-center gap-2">
                {ngo.logo && (
                  <div className="w-14 h-[58px] rounded-[200px] bg-[#EF4037] flex items-center justify-center overflow-hidden">
                    <Image src={ngo.logo} alt={`${ngo.nome} logo`} width={56} height={58} className="object-cover" />
                  </div>
                )}
                <h1 className="text-5xl font-extrabold" style={{ color: '#404040' }}>{ngo.nome}</h1>
              </div>

              {/* Location + Website */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" style={{ color: '#595959' }} />
                  <span className="text-base font-medium" style={{ color: '#595959' }}>{ngo.localizacao}</span>
                </div>
                <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" style={{ color: '#595959' }} />
                  <a href={ngo.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-base font-medium hover:underline" style={{ color: '#595959' }}>
                    cais.pt
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-4 py-10 px-2">
              {ngo.colaboracao.map((colab, index) => (
                <div key={index} className="px-4 py-2 rounded-[200px] border" style={{ borderColor: 'rgba(64, 64, 64, 0.5)' }}>
                  <span className="text-sm font-medium" style={{ color: 'rgba(64, 64, 64, 0.5)' }}>{colab}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 px-3 py-4 rounded-[100px] flex items-center justify-center gap-4" style={{ backgroundColor: '#155DFC' }}>
                <span className="text-xl font-semibold text-white">Quero colaborar</span>
                <ArrowRight className="w-6 h-6 text-white" />
              </button>
              <button className="flex-1 px-3 py-4 rounded-[100px] border flex items-center justify-center gap-4" style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}>
                <span className="text-xl font-semibold" style={{ color: '#595959' }}>Seguir ONG</span>
                <Bookmark className="w-6 h-6" style={{ color: '#595959' }} />
              </button>
            </div>
          </div>

          {/* Missão Section */}
          <div className="w-full max-w-[918px] flex flex-col gap-2">
            <div className="w-full">
              <h3 className="text-2xl md:text-3xl lg:text-[39px] font-bold leading-[1.4]" style={{ color: '#404040' }}>
                {ngo.missao}
              </h3>
            </div>

            <div className="w-full flex justify-center py-2">
              <p className="w-full text-xl font-medium leading-[1.4]" style={{ color: '#595959' }}>
                {ngo.descricao}
              </p>
            </div>
          </div>

          {/* Métricas Section - 3 banners */}
          {ngo.impacto && ngo.impacto.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col md:flex-row gap-6">
              {ngo.impacto.slice(0, 3).map((impacto, index) => (
                <MetricBanner
                  key={index}
                  label={impacto}
                  className="flex-1"
                />
              ))}
            </div>
          )}

          {/* Áreas de Atuação Section */}
          {ngo.areaAtuacao.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col gap-6">
              <div className="w-full pb-4 lg:pb-8">
                <h3 className="text-2xl md:text-3xl lg:text-[39px] font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>
                  Áreas de Atuação
                </h3>
              </div>

              {/* Areas Grid */}
              <div className="w-full flex flex-wrap gap-8 justify-center">
                {ngo.areaAtuacao.map((area, index) => (
                  <AreaBanner key={index} className="w-auto" icon={getAreaIcon(area)}>
                    <div className="w-full flex flex-col items-center gap-8">
                      <span className="text-center text-base font-medium">{area}</span>
                    </div>
                  </AreaBanner>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Eventos Section */}
          {eventos.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col gap-6">
              <div className="w-full flex items-center justify-between py-2">
                <h3 className="text-2xl md:text-3xl lg:text-[39px] font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>
                  Próximos eventos
                </h3>
                <button className="flex items-center gap-4">
                  <span className="text-base font-medium" style={{ color: '#595959' }}>Ver todos</span>
                  <ArrowRight className="w-6 h-6" style={{ color: '#595959' }} />
                </button>
              </div>

              {/* Events Grid */}
              <div className="w-full flex flex-col md:flex-row gap-6">
                {eventos.map((evento) => (
                  <Card key={evento.id} className="flex-1 overflow-hidden rounded-[32px] border" style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}>
                    <div className="relative w-full h-[120px]">
                      <Image
                        src={evento.imagem}
                        alt={evento.nome}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3.5 right-[189px] px-2 py-2 rounded-[200px]" style={{ backgroundColor: '#C4D6FF' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#155DFC' }} />
                          <span className="text-sm font-medium" style={{ color: '#155DFC' }}>{evento.vagas}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-0 flex flex-col gap-4">
                      <div className="px-4 flex flex-col gap-2">
                        <h4 className="text-lg font-bold leading-[1.4]" style={{ color: '#404040' }}>{evento.nome}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Event metadata badges would go here */}
                        </div>
                      </div>

                      <div className="px-4">
                        <p className="text-sm font-medium leading-[1.4]" style={{ color: '#595959' }}>{evento.descricao}</p>
                      </div>

                      <div className="px-4 pb-4 flex flex-col gap-2">
                        <button className="w-full px-4 py-2 rounded-[100px] flex items-center justify-center gap-4" style={{ backgroundColor: '#155DFC' }}>
                          <span className="text-base font-medium text-white">Participar</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                        <p className="text-xs font-bold text-center leading-[1.4]" style={{ color: '#404040' }}>Faltam 50 vagas</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Vídeo Section - Placeholder */}
          <div className="w-full max-w-[918px] py-8 pb-[60px]">
            <div className="relative w-full h-[472.5px] rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[75px] h-[60px] rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1C1B1F' }}>
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Projetos Section */}
          {projetos.length > 0 && (
            <div className="w-full max-w-[918px] flex flex-col gap-1" style={{ backgroundColor: 'rgba(21, 93, 252, 0.05)' }}>
              {projetos.map((projeto, index) => (
                <div key={projeto.id} className="w-full flex flex-col md:flex-row items-center gap-6 rounded-[32px]">
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-full md:w-[290px] h-full rounded-2xl overflow-hidden">
                        <Image
                          src={projeto.imagem}
                          alt={projeto.titulo}
                          width={290}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-2">
                        <h4 className="text-2xl font-bold leading-[1.4]" style={{ color: '#404040' }}>{projeto.titulo}</h4>
                        <p className="text-xl font-normal leading-[1.4] whitespace-pre-line" style={{ color: '#595959' }}>{projeto.descricao}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 flex flex-col justify-center gap-2 order-2 md:order-1">
                        <h4 className="text-2xl font-bold leading-[1.4]" style={{ color: '#404040' }}>{projeto.titulo}</h4>
                        <p className="text-xl font-normal leading-[1.4] whitespace-pre-line" style={{ color: '#595959' }}>{projeto.descricao}</p>
                      </div>
                      <div className="w-full md:w-[290px] h-[277.32px] rounded-2xl overflow-hidden order-1 md:order-2">
                        <Image
                          src={projeto.imagem}
                          alt={projeto.titulo}
                          width={290}
                          height={277}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Informações Adicionais Section */}
          <div className="w-full max-w-[918px] rounded-[32px] border flex flex-col gap-8 p-8 pt-6 pb-8" style={{ background: 'rgba(242, 242, 247, 0.05)', borderColor: 'rgba(64, 64, 64, 0.15)', backdropFilter: 'blur(200px)' }}>
            {/* Site */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-1 py-2">
                <span className="text-xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>Site:</span>
                <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>cais.pt</span>
              </div>
            </div>

            <div className="w-full h-px rounded-[200px]" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />

            {/* Tipos de Colaboração */}
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 py-2">
                <span className="text-xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>Tipos de Colaboração</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Voluntariado 🤝</span>
                  <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Recursos 🧩</span>
                  <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Mentoria 💡</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px rounded-[200px]" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />

            {/* ODS */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-1 py-2">
                <span className="text-xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>ODS</span>
                <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>-</span>
              </div>
            </div>

            <div className="w-full h-px rounded-[200px]" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />

            {/* Redes Sociais */}
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 py-2">
                <span className="text-xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>Redes Sociais:</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Facebook</span>
                  <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Tiktok</span>
                  <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Linkedin</span>
                  <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>Instagram</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px rounded-[200px]" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />

            {/* Contacto */}
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 py-2">
                <span className="text-xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>Contacto</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>{ngo.email}</span>
                  <div className="w-px h-4" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>{ngo.telefone}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px rounded-[200px]" style={{ backgroundColor: 'rgba(64, 64, 64, 0.15)' }} />

            {/* Morada */}
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 py-2">
                <span className="text-xl font-bold leading-[1.2]" style={{ color: '#1E1E1E' }}>Morada</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-normal leading-[1.2]" style={{ color: '#404040' }}>{ngo.morada}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col items-center gap-[120px] pt-[120px]">
        <div className="w-full border-t shadow-sm" style={{ backgroundColor: '#F2F2F7', borderColor: 'rgba(10, 10, 10, 0.05)', boxShadow: '0px 2px 15px 0px rgba(238, 238, 238, 1)' }}>
          <div className="w-full max-w-[1440px] mx-auto px-16 py-10 pb-6 flex flex-col justify-between gap-4 min-h-[306px]">
            <div className="flex gap-[136px]">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase" style={{ color: '#1C1B1F' }}>Sobre nós</h4>
                <div className="flex flex-col gap-2">
                  <Link href="#" className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Quem somos</Link>
                  <Link href="#" className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Equipa</Link>
                  <Link href="#" className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Carreiras</Link>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase" style={{ color: '#1C1B1F' }}>Recursos</h4>
                <div className="flex flex-col gap-2">
                  <Link href="#" className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Blog</Link>
                  <Link href="#" className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Ajuda</Link>
                  <Link href="#" className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.7)' }}>Contacto</Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-full h-px" style={{ backgroundColor: 'rgba(10, 10, 10, 0.05)' }} />
              <p className="text-sm" style={{ color: 'rgba(28, 27, 31, 0.5)' }}>© 2024 ONGs Portugal. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

