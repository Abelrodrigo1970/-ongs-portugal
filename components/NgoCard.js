'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

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
      className={`self-stretch rounded-2xl shadow-[0px_0px_50px_0px_rgba(225,225,225,1.00)] inline-flex flex-col justify-start items-start overflow-hidden ${className}`}
      style={{ 
        width: '310px',
        backgroundColor: 'transparent'
      }}
    >
      <Link href={`/ongs/${ngo.id}`} className="block w-full">
        <div className="flex flex-col w-full">
          {/* Image Container - Based on Figma design (h-44 = 176px) */}
          <div 
            className="self-stretch h-44 relative inline-flex justify-start items-center gap-2"
          >
            {ngo.imagem ? (
              <Image
                src={ngo.imagem}
                alt={ngo.nome}
                fill
                sizes="310px"
                className="flex-1 self-stretch object-cover"
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
            
            {/* Favorite Heart Icon - Based on Figma design */}
            <button
              onClick={handleFavoriteClick}
              className="w-7 h-7 left-[277px] top-[8px] absolute z-10 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
              style={{ 
                boxShadow: '0px 0px 8.88888931274414px 0px rgba(0,0,0,0.75)'
              }}
            >
              <div className="w-7 h-7 left-0 top-0 absolute bg-zinc-300 rounded-full" />
              <Heart 
                className={`w-5 h-5 relative ${favorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
                style={{ 
                  strokeWidth: 2,
                  fill: favorite ? 'currentColor' : 'none'
                }} 
              />
            </button>
          </div>

          {/* Content Section - Based on Figma design (white background) */}
          <div 
            className="self-stretch px-4 pt-2 pb-4 bg-white flex flex-col justify-start items-start"
          >
            {/* Name and Location */}
            <div className="self-stretch h-20 flex flex-col justify-start items-start">
              <h3 
                className="self-stretch justify-start text-base font-bold leading-6 line-clamp-2"
                style={{ 
                  color: 'rgba(2, 6, 23, 1)',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '4px'
                }}
              >
                {ngo.nome}
              </h3>
              <p 
                className="self-stretch justify-start text-sm font-semibold leading-5"
                style={{ 
                  color: 'rgba(100, 116, 139, 1)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {ngo.localizacao || 'Location'}
              </p>
            </div>

            {/* Labels (Areas) - Based on Figma badge design */}
            {areasList.length > 0 && (
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                {areasList.slice(0, 2).map((area, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center overflow-hidden"
                    style={{ 
                      borderColor: 'rgba(229, 231, 235, 1)'
                    }}
                  >
                    <div 
                      className="justify-start text-sm font-semibold leading-5"
                      style={{ 
                        color: 'rgba(107, 114, 128, 1)',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {area}
                    </div>
                  </div>
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

