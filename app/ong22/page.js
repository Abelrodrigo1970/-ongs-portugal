import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Globe, ArrowRight, Bookmark, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export const metadata = {
  title: 'Associação CAIS - UNIVA',
  description: 'Transformamos vidas, todos os dias.'
};

export default function Ong22Page() {
  return (
    <div className="bg-[#f2f2f7] min-h-screen w-full">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[450px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1440&h=1440&fit=crop"
            alt="Associação CAIS"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: '50% 20%' }}
            priority
          />
        </div>
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(242,242,247,0) 67.696%, rgba(242,242,247,1) 94.162%)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="px-16 py-2">
          <div 
            className="w-full max-w-[918px] mx-auto flex flex-col items-center relative z-10"
            style={{ 
              paddingTop: '0px',
              paddingBottom: '40px',
              marginTop: '-200px',
              gap: '40px'
            }}
          >
            {/* Header Card - Frame 403 */}
            <div 
              className="w-full flex flex-col items-center rounded-[32px] border border-solid"
              style={{ 
                background: 'rgba(242, 242, 247, 0.05)',
                borderColor: 'rgba(64, 64, 64, 0.15)',
                padding: '32px',
                backdropFilter: 'blur(100px)'
              }}
            >
              {/* Logo + Title + Location/Website */}
              <div className="w-full flex items-center mb-10">
                <div className="flex-1 flex gap-2 items-center justify-center">
                  <div 
                    className="relative rounded-full overflow-hidden flex-shrink-0"
                    style={{ width: '56px', height: '58px', background: '#ef4037' }}
                  >
                    <div className="flex items-center justify-center w-full h-full text-white text-3xl font-bold">
                      C
                    </div>
                  </div>
                  <h1 
                    className="flex-1 font-extrabold"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '48px',
                      lineHeight: '1.2',
                      color: '#404040'
                    }}
                  >
                    Associação CAIS
                  </h1>
                </div>
                
                {/* Location and Website */}
                <div className="flex gap-4 items-center" style={{ padding: '8px 0' }}>
                  <div className="flex gap-1 items-center">
                    <MapPin style={{ width: '16px', height: '16px', color: '#595959' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '500', lineHeight: '1.2', color: '#595959' }}>
                      Porto, Portugal
                    </span>
                  </div>
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                  <div className="flex gap-1 items-center">
                    <Globe style={{ width: '16px', height: '16px', color: '#595959' }} />
                    <a 
                      href="https://cais.pt" 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '500', lineHeight: '1.2', color: '#595959' }}
                    >
                      cais.pt
                    </a>
                  </div>
                </div>
              </div>

              {/* Collaboration Tags */}
              <div className="w-full flex gap-4 items-center overflow-auto mb-10" style={{ padding: '0 8px' }}>
                {['Sem Abrigo', 'Inclusão social', 'Empregabilidade', 'Comunidade', 'Mentoria', 'Capacitação'].map((tag) => (
                  <div 
                    key={tag}
                    className="border border-solid rounded-full flex-shrink-0"
                    style={{ 
                      borderColor: 'rgba(64, 64, 64, 0.5)', 
                      padding: '8px 16px' 
                    }}
                  >
                    <span style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      lineHeight: '1.4', 
                      color: 'rgba(64, 64, 64, 0.5)' 
                    }}>
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="w-full flex gap-4 items-center">
                <button 
                  className="flex-1 flex gap-4 items-center justify-center rounded-full"
                  style={{ background: '#155dfc', padding: '16px 12px' }}
                >
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '600', color: '#f2f2f7' }}>
                    Quero colaborar
                  </span>
                  <ArrowRight style={{ width: '24px', height: '24px', color: '#f2f2f7' }} />
                </button>
                <button 
                  className="flex-1 flex gap-4 items-center justify-center rounded-full border border-solid"
                  style={{ borderColor: 'rgba(64, 64, 64, 0.15)', padding: '16px 12px' }}
                >
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '600', color: '#595959' }}>
                    Seguir ONG
                  </span>
                  <Bookmark style={{ width: '24px', height: '24px', color: '#595959' }} />
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="w-full flex flex-col items-start">
              <h2 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '39px',
                  lineHeight: '1.4',
                  color: '#404040'
                }}
              >
                Transformamos vidas, todos os dias.
              </h2>
              <p 
                className="w-full"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: '500',
                  lineHeight: '1.4',
                  color: '#595959',
                  padding: '8px 0'
                }}
              >
                A CAIS trabalha há mais de 30 anos para criar oportunidades e promover a inclusão social e profissional de pessoas em situação de vulnerabilidade. Através dos nossos projetos, ajudamos a reconstruir trajetórias de vida e a devolver dignidade e autonomia a quem mais precisa.
              </p>
            </div>

            {/* Metrics - 3 Banners */}
            <div className="w-full flex gap-6">
              {[
                { value: '755', label: '85% da população\nsem-abrigo' },
                { value: '187', label: '85% da população\nsem-abrigo' },
                { value: '27.630', label: '85% da população\nsem-abrigo' }
              ].map((metric, index) => (
                <div 
                  key={index}
                  className="flex-1 flex flex-col items-center overflow-hidden rounded-[32px]"
                  style={{ background: '#f2f2f7' }}
                >
                  <div style={{ padding: '16px 16px 0' }}>
                    <p style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '48px', 
                      fontWeight: '700', 
                      lineHeight: '1.2', 
                      color: '#404040',
                      textAlign: 'center'
                    }}>
                      {metric.value}
                    </p>
                  </div>
                  <div style={{ padding: '0 16px 16px' }}>
                    <p style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      lineHeight: '1.4', 
                      color: '#8c8c8c',
                      textAlign: 'center',
                      whiteSpace: 'pre-line'
                    }}>
                      {metric.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Áreas de Atuação */}
            <div className="w-full flex flex-col gap-4">
              <div style={{ paddingBottom: '32px' }}>
                <h3 style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '39px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  color: '#1e1e1e'
                }}>
                  Áreas de Atuação
                </h3>
              </div>
              <div className="w-full flex flex-wrap gap-8 items-center justify-center">
                {['Inclusão Social', 'Empregabilidade', 'Formação', 'Desporto', 'Cultura', 'Comunidade', 'Reinserção', 'Educação'].map((area) => (
                  <div 
                    key={area}
                    className="flex flex-col items-center justify-center border border-solid rounded-2xl"
                    style={{ 
                      width: '150px',
                      background: '#f2f2f7',
                      borderColor: 'rgba(64, 64, 64, 0.15)',
                      padding: '24px 16px',
                      gap: '32px'
                    }}
                  >
                    <div style={{ width: '24px', height: '24px', opacity: '0.9' }}>
                      {/* Icon placeholder */}
                      <div className="w-full h-full rounded-full" style={{ background: 'rgba(64, 64, 64, 0.2)' }} />
                    </div>
                    <p style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      fontWeight: '400',
                      lineHeight: '1.5',
                      color: '#404040',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      {area}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Eventos */}
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex items-center" style={{ padding: '8px 0' }}>
                <h3 style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '39px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  color: '#1e1e1e'
                }}>
                  Próximos eventos
                </h3>
                <div className="flex-1 flex justify-end gap-5">
                  <button className="flex items-center justify-center rounded-full" style={{ width: '47px', height: '47px', background: '#f2f2f7' }}>
                    <ChevronLeft style={{ width: '20px', height: '20px', color: '#404040' }} />
                  </button>
                  <button className="flex items-center justify-center rounded-full" style={{ width: '47px', height: '47px', background: '#e8e8e8' }}>
                    <ChevronRight style={{ width: '20px', height: '20px', color: '#404040' }} />
                  </button>
                </div>
              </div>
              
              <div className="w-full flex gap-6">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-white border border-solid rounded-[32px] overflow-hidden"
                    style={{ borderColor: 'rgba(64, 64, 64, 0.15)' }}
                  >
                    <div className="relative" style={{ height: '120px' }}>
                      <Image
                        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=120&fit=crop"
                        alt="Evento"
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                      <div 
                        className="absolute flex items-center gap-2 rounded-full"
                        style={{ top: '14px', right: '14px', background: '#c4d6ff', padding: '4px 8px' }}
                      >
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '700', color: '#155dfc' }}>10</span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: 'rgba(21, 93, 252, 0.3)' }}>/ 60</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4" style={{ padding: '16px' }}>
                      <h4 style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '18px',
                        fontWeight: '700',
                        lineHeight: '1.4',
                        color: '#404040',
                        height: '50px'
                      }}>
                        Doações de Cestas Básicas
                      </h4>
                      <div className="flex flex-wrap gap-2 text-sm" style={{ color: 'rgba(89, 89, 89, 0.7)' }}>
                        <span>📍 Porto, Portugal</span>
                        <span>🕐 17:00</span>
                        <span>📅 20 Out 2025</span>
                      </div>
                      <p style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: '500',
                        lineHeight: '1.4',
                        color: '#595959'
                      }}>
                        Evento desportivo e de convívio que junta participantes...
                      </p>
                      <button 
                        className="w-full flex items-center justify-center gap-4 rounded-full"
                        style={{ background: '#155dfc', padding: '8px 16px' }}
                      >
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '500', color: 'white' }}>
                          Participar
                        </span>
                        <ArrowRight style={{ width: '16px', height: '16px', color: 'white' }} />
                      </button>
                      <p style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#404040',
                        textAlign: 'center'
                      }}>
                        Faltam 50 vagas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div className="w-full" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
              <div className="relative w-full rounded overflow-hidden" style={{ height: '472.5px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&h=500&fit=crop"
                  alt="Video"
                  fill
                  sizes="918px"
                  className="object-cover"
                  style={{ opacity: '0.8' }}
                />
                <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.4)' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center justify-center" style={{ width: '75px', height: '60px' }}>
                    <Play style={{ width: '60px', height: '60px', color: 'white' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="w-full flex flex-col gap-1">
              {/* Project 1 */}
              <div className="w-full flex gap-6 items-center">
                <div className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: '290px', height: '238px' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=290&h=238&fit=crop"
                    alt="Projeto"
                    fill
                    sizes="290px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <h4 style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    lineHeight: '1.4',
                    color: '#404040'
                  }}>
                    Trabalhamos todos os dias
                  </h4>
                  <p style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '1.4',
                    color: '#595959'
                  }}>
                    A Associação CAIS mantém como um dos seus principais objetivos a promoção da (re)integração no mercado de trabalho das pessoas em situação de vulnerabilidade.
                  </p>
                </div>
              </div>

              {/* Project 2 */}
              <div className="w-full flex gap-6 items-center">
                <div className="flex-1 flex flex-col gap-2">
                  <h4 style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    lineHeight: '1.4',
                    color: '#404040'
                  }}>
                    Projecto Futebol de Rua
                  </h4>
                  <p style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '1.4',
                    color: '#595959'
                  }}>
                    Iniciado em 2004, pela Associação CAIS, em parceria com inúmeras entidades públicas e privadas, promove a prática desportiva.
                  </p>
                </div>
                <div className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: '290px', height: '277px' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=290&h=277&fit=crop"
                    alt="Projeto"
                    fill
                    sizes="290px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Project 3 */}
              <div className="w-full flex gap-6 items-center">
                <div className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: '290px', height: '322px' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=290&h=322&fit=crop"
                    alt="Projeto"
                    fill
                    sizes="290px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <h4 style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: '700',
                    lineHeight: '1.4',
                    color: '#404040'
                  }}>
                    Projecto Abrigo
                  </h4>
                  <p style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '1.4',
                    color: '#595959'
                  }}>
                    Desde 2003, o conceito de Responsabilidade Social Empresarial tem vindo a ser cada vez mais integrado na atividade das empresas.
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div 
              className="w-full flex flex-col gap-8 items-center rounded-[32px] border border-solid"
              style={{ 
                background: 'rgba(242, 242, 247, 0.05)',
                borderColor: 'rgba(64, 64, 64, 0.15)',
                padding: '24px 32px 32px',
                backdropFilter: 'blur(100px)'
              }}
            >
              {/* Site */}
              <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '1.2', color: '#1e1e1e' }}>
                  Site:
                </span>
                <a href="https://cais.pt" target="_blank" rel="noopener noreferrer" className="underline" style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                  cais.pt
                </a>
              </div>

              {/* Tipos de Colaboração */}
              <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '1.2', color: '#1e1e1e' }}>
                  Tipos de Colaboração
                </span>
                <div className="flex gap-4 items-center">
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                    Voluntariado 🤝
                  </span>
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                    Recursos 🧩
                  </span>
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                    Mentoria 💡
                  </span>
                </div>
              </div>

              {/* ODS */}
              <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '1.2', color: '#1e1e1e' }}>
                  ODS
                </span>
                <span className="underline" style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                  -
                </span>
              </div>

              {/* Redes Sociais */}
              <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '1.2', color: '#1e1e1e' }}>
                  Redes Sociais:
                </span>
                <div className="flex gap-4 items-center">
                  {['Facebook', 'Tiktok', 'Linkedin', 'Instagram'].map((social, i, arr) => (
                    <>
                      <a key={social} href="#" className="underline" style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                        {social}
                      </a>
                      {i < arr.length - 1 && <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />}
                    </>
                  ))}
                </div>
              </div>

              {/* Contacto */}
              <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '1.2', color: '#1e1e1e' }}>
                  Contacto
                </span>
                <div className="flex gap-4 items-center">
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                    cais@cais.pt
                  </span>
                  <div style={{ background: 'rgba(64, 64, 64, 0.15)', width: '1px', height: '100%' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                    222 071 320
                  </span>
                </div>
              </div>

              {/* Morada */}
              <div className="w-full flex items-center justify-between" style={{ padding: '8px 0' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '1.2', color: '#1e1e1e' }}>
                  Morada
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: '400', lineHeight: '1.2', color: '#404040' }}>
                  Rua da Ribeira Negra 55, 4050-321 Porto
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full" style={{ paddingTop: '120px' }}>
        <div 
          className="border-t border-solid flex flex-col justify-between"
          style={{ 
            background: '#f2f2f7',
            borderColor: 'rgba(10, 10, 10, 0.05)',
            height: '306px',
            padding: '40px 64px 24px'
          }}
        >
          <div className="flex gap-32">
            <div className="flex flex-col gap-4" style={{ width: '420px' }}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#1c1b1f' }}>
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28.75px', fontWeight: '900', color: '#1c1b1f', textTransform: 'uppercase', letterSpacing: '2.3px' }}>
                  UNIVA
                </span>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: 'rgba(10, 10, 10, 0.7)' }}>
                Conectando empresas com oportunidades de impacto social. Vamos contruir um futuro melhor juntos.
              </p>
            </div>
            
            <div className="flex gap-6">
              <div className="flex flex-col gap-4" style={{ width: '200px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '700', color: '#0a0a0a' }}>
                  Plataforma
                </p>
                <div className="flex flex-col gap-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: 'rgba(10, 10, 10, 0.7)' }}>
                  <p>Tracker de impacto</p>
                  <p>ODS</p>
                  <p>Métricas</p>
                  <p>Boas práticas para ONGs</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4" style={{ width: '199px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '700', color: '#0a0a0a' }}>
                  Planos
                </p>
                <div className="flex flex-col gap-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: 'rgba(10, 10, 10, 0.7)' }}>
                  <p>Subscrição</p>
                  <p>Vantagens</p>
                  <p>Políticas de Privacidade</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4" style={{ width: '200px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '700', color: '#0a0a0a' }}>
                  Sobre
                </p>
                <div className="flex flex-col gap-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: 'rgba(10, 10, 10, 0.7)' }}>
                  <p>Quem Somos</p>
                  <p>Contato</p>
                  <p>Blog</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '500', color: 'rgba(10, 10, 10, 0.7)', textTransform: 'uppercase' }}>
            <p>INSTAGRAM</p>
            <p>LINKEDIN</p>
            <p>TIKTOK</p>
          </div>
        </div>
      </div>
    </div>
  );
}

