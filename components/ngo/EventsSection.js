'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CompactEventCard from '@/components/CompactEventCard';

export default function EventsSection({ events }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [events]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.event-card')?.offsetWidth || 300;
      const gap = 24; // 24px gap between cards
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 items-start max-w-[920px] px-4 sm:px-6 md:px-0" style={{ gap: '24px' }}>
      <div className="w-full flex flex-col items-start">
        <div className="w-full flex flex-col items-start justify-center">
          <div 
            className="w-full flex items-center justify-between gap-4"
            style={{ padding: '8px 0' }}
          >
            <h3 
              className="font-semibold text-2xl sm:text-3xl md:text-[40px] flex-1"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.2',
                color: '#1e1e1e'
              }}
            >
              Próximos eventos
            </h3>
            
            {/* Navigation Buttons */}
            <div 
              className="flex gap-[18.8px] items-center flex-shrink-0"
              style={{ height: '47px' }}
            >
              {/* Left Arrow Button */}
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="flex items-center justify-center rounded-[200px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: '#f2f2f7',
                  width: '55.225px',
                  height: '55.225px',
                  padding: '2.35px 7.05px',
                  cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                  border: 'none',
                  outline: 'none'
                }}
                aria-label="Scroll left"
              >
                <ChevronLeft 
                  style={{ 
                    width: '23.5px', 
                    height: '23.5px',
                    color: 'rgba(64, 64, 64, 1)'
                  }} 
                />
              </button>
              
              {/* Right Arrow Button */}
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="flex items-center justify-center rounded-[200px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: '#e8e8e8',
                  width: '55.225px',
                  height: '55.225px',
                  padding: '2.35px 7.05px',
                  cursor: canScrollRight ? 'pointer' : 'not-allowed',
                  border: 'none',
                  outline: 'none'
                }}
                aria-label="Scroll right"
              >
                <ChevronRight 
                  style={{ 
                    width: '23.5px', 
                    height: '23.5px',
                    color: 'rgba(64, 64, 64, 1)'
                  }} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Events Container with Horizontal Scroll */}
      <div 
        ref={scrollContainerRef}
        className="w-full flex gap-6 items-start overflow-x-auto scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '8px'
        }}
      >
        {events.map((event) => (
          <div 
            key={event.id} 
            className="event-card flex-shrink-0"
            style={{ 
              minWidth: '280px',
              width: 'calc(100vw - 64px)',
              maxWidth: 'calc((100% - 48px) / 3)'
            }}
          >
            <CompactEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}

