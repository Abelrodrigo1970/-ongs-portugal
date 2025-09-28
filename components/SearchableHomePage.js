'use client';

import { useState, useMemo } from 'react';
import Hero from '@/components/home/Hero';
import FeaturedNGOs from '@/components/home/FeaturedNGOs';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import ODSSection from '@/components/home/ODSSection';
import CTASection from '@/components/home/CTASection';
import CompactEventCard from '@/components/CompactEventCard';
import NgoCard from '@/components/NgoCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const SearchableHomePage = ({ 
  featuredNGOs, 
  featuredEvents, 
  allODS, 
  odsOptions, 
  areasOptions, 
  colaboracaoOptions 
}) => {
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    ods: '',
    areas: '',
    colaboracao: '',
    local: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setIsSearching(filters.query !== '' || filters.ods !== '' || filters.areas !== '' || filters.colaboracao !== '' || filters.local !== '');
  };

  // Filtrar ONGs
  const filteredNGOs = useMemo(() => {
    if (!isSearching) return [];
    
    return featuredNGOs.filter(ngo => {
      let matches = true;

      // Filtro por texto
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        matches = matches && (
          ngo.nome.toLowerCase().includes(query) ||
          ngo.descricao?.toLowerCase().includes(query) ||
          ngo.missao?.toLowerCase().includes(query) ||
          ngo.localizacao?.toLowerCase().includes(query) ||
          // Busca em áreas de atuação
          ngo.areaAtuacao?.some(areaRel => 
            areaRel.tipo?.nome.toLowerCase().includes(query)
          ) ||
          // Busca em ODS
          ngo.ods?.some(odsRel => 
            odsRel.ods?.nome.toLowerCase().includes(query)
          )
        );
      }

      // Filtro por ODS
      if (searchFilters.ods) {
        matches = matches && ngo.ods?.some(odsRel => odsRel.odsId === searchFilters.ods);
      }

      // Filtro por áreas
      if (searchFilters.areas) {
        matches = matches && ngo.areaAtuacao?.some(areaRel => areaRel.areaAtuacaoTipoId === searchFilters.areas);
      }

      // Filtro por colaboração
      if (searchFilters.colaboracao) {
        matches = matches && ngo.colaboracao?.some(colaboracaoRel => colaboracaoRel.colaboracaoTipoId === searchFilters.colaboracao);
      }

      return matches;
    });
  }, [featuredNGOs, searchFilters, isSearching]);

  // Filtrar Eventos
  const filteredEvents = useMemo(() => {
    if (!isSearching) return [];
    
    return featuredEvents.filter(event => {
      let matches = true;

      // Filtro por texto
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        matches = matches && (
          event.nome.toLowerCase().includes(query) ||
          event.descricao?.toLowerCase().includes(query) ||
          event.localizacao?.toLowerCase().includes(query) ||
          event.ngo?.nome.toLowerCase().includes(query) ||
          // Busca em áreas de atuação do evento
          event.areas?.some(areaRel => 
            areaRel.tipo?.nome.toLowerCase().includes(query)
          ) ||
          // Busca em ODS do evento
          event.ods?.some(odsRel => 
            odsRel.ods?.nome.toLowerCase().includes(query)
          )
        );
      }

      // Filtro por localização
      if (searchFilters.local) {
        matches = matches && event.localizacao?.toLowerCase().includes(searchFilters.local.toLowerCase());
      }

      // Filtro por ODS (através do evento ou NGO)
      if (searchFilters.ods) {
        matches = matches && (
          event.ods?.some(odsRel => odsRel.odsId === searchFilters.ods) ||
          event.ngo?.ods?.some(odsRel => odsRel.odsId === searchFilters.ods)
        );
      }

      // Filtro por áreas (através do evento ou NGO)
      if (searchFilters.areas) {
        matches = matches && (
          event.areas?.some(areaRel => areaRel.areaAtuacaoTipoId === searchFilters.areas) ||
          event.ngo?.areaAtuacao?.some(areaRel => areaRel.areaAtuacaoTipoId === searchFilters.areas)
        );
      }

      return matches;
    });
  }, [featuredEvents, searchFilters, isSearching]);

  return (
    <div className="min-h-screen">
      <Hero 
        odsOptions={odsOptions} 
        areasOptions={areasOptions}
        colaboracaoOptions={colaboracaoOptions}
        onSearch={handleSearch}
      />
      
      {isSearching ? (
        // Resultados da pesquisa
        <div className="py-16 bg-gray-50">
          <div className="container-custom">

            {/* Resultados de ONGs */}
            {filteredNGOs.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  ONGs ({filteredNGOs.length})
                </h3>
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {filteredNGOs.slice(0, 4).map((ngo) => (
                    <NgoCard key={ngo.id} ngo={ngo} />
                  ))}
                </div>
                {filteredNGOs.length > 6 && (
                  <div className="text-center">
                    <Link href={`/ongs?query=${encodeURIComponent(searchFilters.query)}`}>
                      <Button>Ver Todas as ONGs</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Resultados de Eventos */}
            {filteredEvents.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Eventos ({filteredEvents.length})
                </h3>
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {filteredEvents.slice(0, 4).map((event) => (
                    <CompactEventCard key={event.id} event={event} />
                  ))}
                </div>
                {filteredEvents.length > 8 && (
                  <div className="text-center">
                    <Link href={`/eventos?query=${encodeURIComponent(searchFilters.query)}`}>
                      <Button>Ver Todos os Eventos</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Sem resultados */}
            {filteredNGOs.length === 0 && filteredEvents.length === 0 && (
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
          </div>
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
