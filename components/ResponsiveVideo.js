'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

const ResponsiveVideo = ({ 
  url, 
  title = 'Vídeo',
  className = 'aspect-video w-full rounded-lg overflow-hidden'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url) {
    return null;
  }

  // Extract video ID from YouTube or Vimeo URLs
  const getVideoId = (url) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return { type: 'youtube', id: youtubeMatch[1] };
    }
    
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }
    
    return null;
  };

  const videoInfo = getVideoId(url);

  if (!videoInfo) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500">URL de vídeo não suportada</p>
      </div>
    );
  }

  const getEmbedUrl = () => {
    if (videoInfo.type === 'youtube') {
      return `https://www.youtube.com/embed/${videoInfo.id}`;
    } else if (videoInfo.type === 'vimeo') {
      return `https://player.vimeo.com/video/${videoInfo.id}`;
    }
    return null;
  };

  const getThumbnailUrl = () => {
    if (videoInfo.type === 'youtube') {
      return `https://img.youtube.com/vi/${videoInfo.id}/hqdefault.jpg`;
    }
    if (videoInfo.type === 'vimeo') {
      return `https://vumbnail.com/${videoInfo.id}.jpg`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl();
  const thumbnailUrl = getThumbnailUrl();

  if (isPlaying && embedUrl) {
    return (
      <div className={className}>
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div 
      className={`${className} cursor-pointer group relative overflow-hidden`}
      onClick={() => setIsPlaying(true)}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 rounded-full p-4 group-hover:bg-opacity-70 transition-all duration-200">
          <Play className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
          {title}
        </p>
      </div>
    </div>
  );
};

export default ResponsiveVideo;

