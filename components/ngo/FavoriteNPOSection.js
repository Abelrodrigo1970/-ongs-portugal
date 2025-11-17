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
      className="w-full flex flex-col items-start"
      style={{ 
        gap: '24px',
        maxWidth: '1440px',
        margin: '0 auto',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      {/* Section Header */}
      <div 
        className="w-full flex items-center justify-center"
        style={{ gap: '24px' }}
      >
        <div 
          className="flex-1 flex items-center"
          style={{ gap: '8px' }}
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
            Favorite NPO
          </h2>
        </div>
      </div>

      {/* Favorite NPOs Grid */}
      <div 
        className="w-full flex flex-wrap justify-center"
        style={{ gap: '24px' }}
      >
        {favoriteNGOsList.map((ngo) => (
          <NgoCard 
            key={ngo.id} 
            ngo={ngo} 
            isFavorite={true}
            onFavoriteToggle={(ngoId, isFavorite) => {
              // Dispatch custom event to update other components
              window.dispatchEvent(new Event('favoriteUpdated'));
            }}
          />
        ))}
      </div>
    </div>
  );
}

