'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Heart } from 'lucide-react';

const NgoCard = ({ ngo, className = '', isFavorite = false, onFavoriteToggle }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const areasList = ngo.areaAtuacao?.map(area => area.tipo.nome) || [];

  useEffect(() => {
    // Verificar se está nos favoritos do localStorage
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favoriteNGOs') || '[]');
      setFavorite(favorites.includes(ngo.id));
    }
  }, [ngo.id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavorite = !favorite;
    setFavorite(newFavorite);
    
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favoriteNGOs') || '[]');
      if (newFavorite) {
        favorites.push(ngo.id);
      } else {
        const index = favorites.indexOf(ngo.id);
        if (index > -1) favorites.splice(index, 1);
      }
      localStorage.setItem('favoriteNGOs', JSON.stringify(favorites));
      // Dispatch custom event to update other components
      window.dispatchEvent(new Event('favoriteUpdated'));
    }
    
    if (onFavoriteToggle) {
      onFavoriteToggle(ngo.id, newFavorite);
    }
  };

  return (
    <div 
      className={`flex flex-col overflow-hidden rounded-[36px] ${className}`}
      style={{ 
        width: '310px',
        height: '400px',
        backgroundColor: 'transparent'
      }}
    >
      <Link href={`/ongs/${ngo.id}`} className="block h-full">
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
            {ngo.imagem ? (
              <Image
                src={ngo.imagem}
                alt={ngo.nome}
                fill
                sizes="310px"
                className="object-cover"
                style={{ objectPosition: '50% 50%' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F2F2F7' }}>
                {ngo.logo ? (
                  <Image
                    src={ngo.logo}
                    alt={`Logo ${ngo.nome}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EF4037' }}>
                    <span className="text-white text-3xl font-bold">
                      {ngo.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(2,6,23,0) 0%, rgba(2,6,23,0.35786) 61.78%, #020617 100%)'
              }}
            />
            
            {/* Favorite Heart Icon */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-[13px] right-[13px] z-10 p-1 rounded-full hover:bg-black/20 transition-colors"
              style={{ width: '26px', height: '26px' }}
            >
              <Heart 
                className={favorite ? 'fill-red-500' : 'fill-none'}
                style={{ 
                  width: '24px', 
                  height: '24px',
                  color: favorite ? 'rgba(239, 68, 68, 1)' : 'rgba(241, 245, 249, 1)',
                  strokeWidth: favorite ? 0 : 2
                }} 
              />
            </button>
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
                {ngo.nome}
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
                {ngo.localizacao || 'Location'}
              </p>
            </div>

            {/* Labels (Areas) */}
            {areasList.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: '8px' }}>
                {areasList.slice(0, 3).map((area, index) => (
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
                    {area}
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

export default NgoCard;

