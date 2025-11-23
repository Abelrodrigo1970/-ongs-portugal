'use client';

import CompactEventCard from '@/components/CompactEventCard';

const FeaturedEvents = ({ events = [] }) => {

  if (events.length === 0) {
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
            Voluntariados Para Si
          </h2>
        </div>

        {/* Events Grid */}
        <div 
          className="w-full flex flex-wrap justify-start"
          style={{ gap: '24px' }}
        >
          {events.map((event) => (
            <CompactEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;

