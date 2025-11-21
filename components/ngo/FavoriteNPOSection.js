'use client';

import { useState, useEffect } from 'react';
import NgoCard from '@/components/NgoCard';

export default function FavoriteNPOSection({ ngos }) {
  const [favoriteNGOs, setFavoriteNGOs] = useState([]);
  const [favoriteNGOsList, setFavoriteNGOsList] = useState([]);

  useEffect(() => {
    // Get favorite NGOs from localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteNGOs') || '[]');
    setFavoriteNGOs(favorites);
    
    // Filter NGOs that are favorites
    const favoritesList = ngos.filter(ngo => favorites.includes(ngo.id)).slice(0, 4);
    setFavoriteNGOsList(favoritesList);
  }, [ngos]);

  // Listen for storage changes (when user toggles favorite)
  useEffect(() => {
    const handleStorageChange = () => {
      const favorites = JSON.parse(localStorage.getItem('favoriteNGOs') || '[]');
      setFavoriteNGOs(favorites);
      const favoritesList = ngos.filter(ngo => favorites.includes(ngo.id)).slice(0, 4);
      setFavoriteNGOsList(favoritesList);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('favoriteUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoriteUpdated', handleStorageChange);
    };
  }, [ngos]);

  if (favoriteNGOsList.length === 0) {
    return null;
  }

  return (
    <div 
      className="w-full flex flex-col items-center"
      style={{ 
        gap: '24px'
      }}
    >
      {/* Container para título e cards alinhados (como no Figma) */}
      <div
        className="flex flex-col"
        style={{
          gap: '24px',
          width: '100%',
          maxWidth: 'calc(4 * 310px + 3 * 24px)'
        }}
      >
        {/* Frame 6 - Section Header */}
        <div 
          className="w-full flex items-center justify-start"
          style={{ gap: '24px', width: '100%' }}
        >
          <h2 
            style={{ 
              color: 'rgba(2, 6, 23, 1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '32px',
              fontWeight: '600',
              lineHeight: '120%',
              marginTop: '-1px'
            }}
          >
            ONG’s Favoritas
          </h2>
        </div>

        {/* Frame 8 - Favorite NPOs Grid */}
        <div 
          className="w-full flex flex-wrap justify-start"
          style={{ gap: '24px' }}
        >
          {favoriteNGOsList.map((ngo) => (
            <NgoCard 
              key={ngo.id} 
              ngo={ngo} 
              isFavorite={true}
              onFavoriteToggle={(ngoId, isFavorite) => {
                // Dispatch custom event para actualizar outros componentes
                window.dispatchEvent(new Event('favoriteUpdated'));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

