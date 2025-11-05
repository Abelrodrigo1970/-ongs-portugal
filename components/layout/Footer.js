import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer 
      className="border-t border-solid flex flex-col items-start justify-between"
      style={{ 
        backgroundColor: '#F2F2F7',
        borderColor: 'rgba(10, 10, 10, 0.05)',
        height: '306px',
        padding: '40px 64px 24px 64px'
      }}
    >
      {/* Main Content */}
      <div 
        className="flex items-start"
        style={{ gap: '136px', width: '1316px' }}
      >
        {/* Logo and Description */}
        <div 
          className="flex flex-col items-start"
          style={{ gap: '16px', width: '420px' }}
        >
          {/* Logo */}
          <div className="relative" style={{ width: '146.667px', height: '40px' }}>
            <div className="absolute left-0 top-0" style={{ width: '40px', height: '40px' }}>
              <div 
                className="absolute inset-0 rounded-full"
                style={{ background: '#1C1B1F' }}
              />
              <div 
                className="absolute flex items-center justify-center"
                style={{ 
                  left: '6.67px',
                  top: '7.5px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#F2F2F7'
                }}
              >
                <div 
                  style={{ 
                    width: '19.2px',
                    height: '19.2px',
                    borderRadius: '50%',
                    background: '#9FE870'
                  }}
                />
              </div>
            </div>
            <p 
              className="absolute font-black leading-normal uppercase"
              style={{ 
                fontFamily: 'Nunito, sans-serif',
                left: '43.33px',
                top: '10px',
                fontSize: '28.75px',
                letterSpacing: '2.3px',
                color: '#1C1B1F'
              }}
            >
              UNIVA
            </p>
          </div>

          {/* Description */}
          <div 
            className="font-medium leading-normal whitespace-nowrap"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgba(10, 10, 10, 0.7)'
            }}
          >
            <p className="mb-0">Conectando empresas com oportunidades de impacto social.</p>
            <p>Vamos contruir um futuro melhor juntos.</p>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="flex items-start" style={{ gap: '24px' }}>
          {/* Plataforma */}
          <div className="flex flex-col items-start" style={{ gap: '16px', width: '200px' }}>
            <p 
              className="font-bold leading-normal"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#0A0A0A'
              }}
            >
              Plataforma
            </p>
            <div className="flex flex-col items-start" style={{ gap: '8px' }}>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Tracker de impacto
              </p>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                ODS
              </p>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Métricas
              </p>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Boas práticas para ONGs
              </p>
            </div>
          </div>

          {/* Planos */}
          <div className="flex flex-col items-start" style={{ gap: '16px', width: '199px' }}>
            <p 
              className="font-bold leading-normal"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#0A0A0A'
              }}
            >
              Planos
            </p>
            <div className="flex flex-col items-start" style={{ gap: '8px' }}>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Subscrição
              </p>
            </div>
            <div className="flex flex-col items-start" style={{ gap: '8px' }}>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Vantagens
              </p>
            </div>
            <div className="flex flex-col items-start" style={{ gap: '8px' }}>
              <Link 
                href="/privacidade"
                className="font-medium leading-normal hover:opacity-80 transition-opacity"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Políticas de Privacidade
              </Link>
            </div>
          </div>

          {/* Sobre */}
          <div className="flex flex-col items-start" style={{ gap: '16px', width: '200px' }}>
            <p 
              className="font-bold leading-normal"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#0A0A0A'
              }}
            >
              Sobre
            </p>
            <div className="flex flex-col items-start" style={{ gap: '8px' }}>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Quem Somos
              </p>
              <p 
                className="font-medium leading-normal"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Contato
              </p>
              <Link 
                href="/blog"
                className="font-medium leading-normal hover:opacity-80 transition-opacity"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(10, 10, 10, 0.7)'
                }}
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-col items-start w-full" style={{ gap: '8px' }}>
        <div className="flex items-start" style={{ gap: '24px' }}>
          <Link 
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium leading-normal uppercase hover:opacity-80 transition-opacity"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(10, 10, 10, 0.7)'
            }}
          >
            INSTAGRAM
          </Link>
          <Link 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium leading-normal uppercase hover:opacity-80 transition-opacity"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(10, 10, 10, 0.7)'
            }}
          >
            LINKEDIN
          </Link>
          <Link 
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium leading-normal uppercase hover:opacity-80 transition-opacity"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: 'rgba(10, 10, 10, 0.7)'
            }}
          >
            TIKTOK
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
