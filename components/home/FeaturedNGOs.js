'use client';

import NgoCard from '@/components/NgoCard';

const FeaturedNGOs = ({ ngos = [] }) => {

  if (ngos.length === 0) {
    return null;
  }

  return (
    <div 
      className="w-full flex flex-col items-center"
      style={{ 
        gap: '24px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}
    >
      {/* Container para título e cards alinhados */}
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
            ONGs Para Si
          </h2>
        </div>

        {/* NGOs Grid */}
        <div 
          className="w-full flex flex-wrap justify-start"
          style={{ gap: '24px' }}
        >
          {ngos.map((ngo) => (
            <NgoCard key={ngo.id} ngo={ngo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedNGOs;






