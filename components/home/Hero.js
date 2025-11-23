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
    <div className="w-full flex flex-col items-center">
      <div 
        className="w-full flex flex-col items-center"
        style={{ 
          padding: '100px 0px 0px',
          gap: '40px',
          width: '100%'
        }}
      >
        {/* Frame 2 - Search and Filters */}
        <div 
          className="w-full flex flex-col items-center"
          style={{ 
            padding: '64px 0px 0px 0px',
            gap: '16px'
          }}
        >
          <h1 
            style={{ 
              color: '#404040',
              fontFamily: 'Inter, sans-serif',
              fontSize: '48px',
              fontWeight: '800',
              lineHeight: '120%',
              textAlign: 'center',
              marginBottom: '0px'
            }}
          >
            Hoje é dia de fazer a diferença
          </h1>

          {/* Barra de Pesquisa Unificada com TODOS os filtros */}
          <FilterBar
            odsOptions={odsOptions}
            areasOptions={areasOptions}
            colaboracaoOptions={colaboracaoOptions}
            tipoOptions={tipoOptions}
            onSearch={handleSearch}
            className="w-full"
            figmaStyle={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;