'use client';

import { MapPin } from 'lucide-react';

const LeafletMap = ({ 
  center = [38.7223, -9.1393], // Default to Lisbon
  zoom = 10,
  markers = [],
  className = 'h-64 w-full rounded-lg'
}) => {
  // Placeholder map component - will be replaced with working Leaflet later
  return (
    <div className={`${className} bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center`}>
      <MapPin className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-gray-500 text-sm text-center">
        Mapa será carregado aqui
        {markers.length > 0 && (
          <span className="block text-xs mt-1">
            {markers.length} localização{markers.length > 1 ? 'ões' : ''}
          </span>
        )}
      </p>
    </div>
  );
};

export default LeafletMap;


