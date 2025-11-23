'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Building2 } from 'lucide-react';

const EmpresaCard = ({ empresa, className = '' }) => {
  const causasList = empresa.causas?.map(empresaCausa => empresaCausa.causa.nome) || [];

  return (
    <div 
      className={`flex flex-col overflow-hidden rounded-[36px] ${className}`}
      style={{ 
        width: '310px',
        height: '400px',
        backgroundColor: 'transparent'
      }}
    >
      <Link href={`/empresas/${empresa.id}`} className="block h-full">
        <div className="flex flex-col h-full relative">
          {/* Image Container - Takes most of the space */}
          <div 
            className="relative"
            style={{ 
              height: 'calc(100% - 169px)',
              minHeight: '231px',
              position: 'relative'
            }}
          >
            {empresa.logo ? (
              <div className="w-full h-full relative">
                <Image
                  src={empresa.logo}
                  alt={empresa.nome}
                  fill
                  sizes="310px"
                  className="object-cover"
                  style={{ objectPosition: '50% 50%' }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F2F2F7' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EF4037' }}>
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0.35786) 61.78%, #020617 100%)'
              }}
            />
          </div>

          {/* Content - Dark Background - Fixed height */}
          <div 
            className="flex flex-col"
            style={{ 
              backgroundColor: '#020617',
              height: '169px',
              padding: '4px 24px 24px 24px',
              flex: '0 0 auto'
            }}
          >
            {/* Name and Location */}
            <div className="flex flex-col" style={{ marginBottom: '8px' }}>
              <h3 
                className="line-clamp-2" 
                style={{ 
                  color: '#f1f5f9',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '4px'
                }}
              >
                {empresa.nome}
              </h3>
              <p 
                style={{ 
                  color: '#cbd5e1',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '1.2'
                }}
              >
                {empresa.localizacao || 'Location'}
              </p>
            </div>

            {/* Labels (Causas) */}
            {causasList.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: '8px' }}>
                {causasList.slice(0, 3).map((causa, index) => (
                  <span
                    key={index}
                    style={{ 
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      padding: '4px 8px'
                    }}
                  >
                    {causa}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EmpresaCard;
