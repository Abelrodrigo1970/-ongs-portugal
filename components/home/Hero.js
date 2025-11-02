'use client';

import FilterBar from '@/components/FilterBar';

const Hero = ({ 
  odsOptions = [], 
  areasOptions = [], 
  colaboracaoOptions = [],
  tipoOptions = [],
  onSearch = null 
}) => {
  // Função para remover acentos
  const removeAccents = (str) => {
    if (!str) return '';
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleSearch = (filters) => {
    console.log('🎯 Hero received from FilterBar:', filters);
    if (onSearch) {
      // Aplicar remoção de acentos na query
      const processedFilters = {
        ...filters,
        query: removeAccents(filters.query),
        ods: Array.isArray(filters.ods) ? filters.ods : (filters.ods ? [filters.ods] : []),
        areas: Array.isArray(filters.areas) ? filters.areas : (filters.areas ? [filters.areas] : []),
        colaboracao: Array.isArray(filters.colaboracao) ? filters.colaboracao : (filters.colaboracao ? [filters.colaboracao] : []),
        tipo: Array.isArray(filters.tipo) ? filters.tipo : (filters.tipo ? [filters.tipo] : []),
        localizacao: filters.localizacao || ''
      };
      console.log('🎯 Hero sending to SearchableHomePage:', processedFilters);
      onSearch(processedFilters);
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#F2F2F7' }}>
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8" style={{ color: '#404040' }}>
            Hoje é dia de fazer a diferença
          </h1>

          {/* Barra de Pesquisa Unificada com TODOS os filtros */}
          <FilterBar
            odsOptions={odsOptions}
            areasOptions={areasOptions}
            colaboracaoOptions={colaboracaoOptions}
            tipoOptions={tipoOptions}
            onSearch={handleSearch}
            className="max-w-6xl mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;