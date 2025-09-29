'use client';

import { useState, useMemo, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import FeaturedNGOs from '@/components/home/FeaturedNGOs';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import ODSSection from '@/components/home/ODSSection';
import CTASection from '@/components/home/CTASection';
import CompactEventCard from '@/components/CompactEventCard';
import NgoCard from '@/components/NgoCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';
// Removed direct Prisma imports - now using API routes

const SearchableHomePage = ({ 
  featuredNGOs, 
  featuredEvents, 
  allODS, 
  odsOptions, 
  areasOptions, 
  colaboracaoOptions,
  tipoOptions = [] 
}) => {
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    ods: [],
    areas: [],
    colaboracao: [],
    tipo: [],
    localizacao: ''
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    ngos: [],
    events: [],
    loading: false
  });

  const handleSearch = async (filters) => {
    setSearchFilters(filters);
    const hasFilters = 
      filters.query !== '' || 
      (filters.ods && filters.ods.length > 0) || 
      (filters.areas && filters.areas.length > 0) || 
      (filters.colaboracao && filters.colaboracao.length > 0) || 
      (filters.tipo && filters.tipo.length > 0) || 
      filters.localizacao !== '';
    
    setIsSearching(hasFilters);
    
    if (hasFilters) {
      setSearchResults(prev => ({ ...prev, loading: true }));
      
      try {
        // Preparar filtros para as funções de pesquisa
        const ngoFilters = {
          query: filters.query || '',
          ods: Array.isArray(filters.ods) ? filters.ods.map(id => parseInt(id)) : [],
          areas: Array.isArray(filters.areas) ? filters.areas.map(id => parseInt(id)) : [],
          colaboracao: Array.isArray(filters.colaboracao) ? filters.colaboracao.map(id => parseInt(id)) : [],
          localizacao: filters.localizacao || '',
          page: 1,
          limit: 8
        };

        const eventFilters = {
          query: filters.query || '',
          ods: Array.isArray(filters.ods) ? filters.ods.map(id => parseInt(id)) : [],
          areas: Array.isArray(filters.areas) ? filters.areas.map(id => parseInt(id)) : [],
          tipo: Array.isArray(filters.tipo) ? filters.tipo : [],
          localizacao: filters.localizacao || '',
          page: 1,
          limit: 8
        };

        // Debug logs
        console.log('🔍 NGO Filters:', ngoFilters);
        console.log('🔍 Event Filters:', eventFilters);

        // Construir URLs para as API routes
        const ngoParams = new URLSearchParams({
          query: ngoFilters.query,
          local: ngoFilters.localizacao,
          page: ngoFilters.page,
          limit: ngoFilters.limit
        });
        
        if (ngoFilters.ods.length > 0) ngoParams.set('ods', ngoFilters.ods.join(','));
        if (ngoFilters.areas.length > 0) ngoParams.set('areas', ngoFilters.areas.join(','));
        if (ngoFilters.colaboracao.length > 0) ngoParams.set('colaboracao', ngoFilters.colaboracao.join(','));

        const eventParams = new URLSearchParams({
          query: eventFilters.query,
          local: eventFilters.localizacao,
          page: eventFilters.page,
          limit: eventFilters.limit
        });
        
        if (eventFilters.ods.length > 0) eventParams.set('ods', eventFilters.ods.join(','));
        if (eventFilters.areas.length > 0) eventParams.set('areas', eventFilters.areas.join(','));
        if (eventFilters.tipo.length > 0) eventParams.set('tipo', eventFilters.tipo.join(','));

        const [ngosResponse, eventsResponse] = await Promise.all([
          fetch(`/api/search/ngos?${ngoParams.toString()}`),
          fetch(`/api/search/events?${eventParams.toString()}`)
        ]);

        const [ngosResult, eventsResult] = await Promise.all([
          ngosResponse.json(),
          eventsResponse.json()
        ]);

        setSearchResults({
          ngos: ngosResult.ngos || [],
          events: eventsResult.events || [],
          loading: false
        });
      } catch (error) {
        console.error('Erro na pesquisa:', error);
        setSearchResults({
          ngos: [],
          events: [],
          loading: false
        });
      }
    }
  };

  // Usar resultados da pesquisa completa
  const filteredNGOs = searchResults.ngos;
  const filteredEvents = searchResults.events;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 p-2">
            <Hero 
              odsOptions={odsOptions} 
              areasOptions={areasOptions}
              colaboracaoOptions={colaboracaoOptions}
              tipoOptions={tipoOptions}
              onSearch={handleSearch}
            />
      
      {isSearching ? (
        // Resultados da pesquisa
        <div className="container mx-auto px-4">
          {searchResults.loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">A pesquisar...</h3>
              <p className="text-gray-600">Aguarda um momento enquanto procuramos resultados.</p>
            </div>
          ) : (
            <>
              {/* Resultados de ONGs */}
              {filteredNGOs.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center p-2">
                    ONGs ({filteredNGOs.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {filteredNGOs.map((ngo) => (
                      <NgoCard key={ngo.id} ngo={ngo} />
                    ))}
                  </div>
                  {filteredNGOs.length >= 8 && (
                    <div className="text-center p-2">
                      <Link href={`/ongs?query=${encodeURIComponent(searchFilters.query)}&ods=${searchFilters.ods}&areas=${searchFilters.areas}&colaboracao=${searchFilters.colaboracao}&local=${searchFilters.local}`}>
                        <Button>Ver Todas as ONGs</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Resultados de Eventos */}
              {filteredEvents.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center p-2">
                    Eventos ({filteredEvents.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {filteredEvents.map((event) => (
                      <CompactEventCard key={event.id} event={event} />
                    ))}
                  </div>
                  {filteredEvents.length >= 8 && (
                    <div className="text-center p-2">
                      <Link href={`/eventos?query=${encodeURIComponent(searchFilters.query)}&ods=${searchFilters.ods}&areas=${searchFilters.areas}&local=${searchFilters.local}`}>
                        <Button>Ver Todos os Eventos</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Sem resultados */}
              {filteredNGOs.length === 0 && filteredEvents.length === 0 && !searchResults.loading && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-gray-600 mb-6">
                      Tenta ajustar os filtros ou usar palavras-chave diferentes.
                    </p>
                    <Button onClick={() => setIsSearching(false)} variant="outline">
                      Ver Conteúdo em Destaque
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Conteúdo original da página
        <>
          
          <FeaturedEvents events={featuredEvents} />
          <FeaturedNGOs ngos={featuredNGOs} />
          <ODSSection ods={allODS} />
          <CTASection />
        </>
      )}
    </div>
  );
};

export default SearchableHomePage;
