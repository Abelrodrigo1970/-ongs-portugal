'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from './ui/Input';
import MultiSelect from './ui/MultiSelect';
import Select from './ui/Select';
import Toggle from './ui/Toggle';
import Button from './ui/Button';
import { Search, X } from 'lucide-react';

const FilterBar = ({ 
  odsOptions = [], 
  areasOptions = [], 
  colaboracaoOptions = [],
  tipoOptions = [],
  showEventFilters = false,
  onSearch = null,
  className = '' 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    ods: searchParams.get('ods')?.split(',').filter(Boolean) || [],
    areas: searchParams.get('areas')?.split(',').filter(Boolean) || [],
    colaboracao: searchParams.get('colaboracao')?.split(',').filter(Boolean) || [],
    tipo: searchParams.get('tipo')?.split(',').filter(Boolean) || [],
    localizacao: searchParams.get('localizacao') || '',
    inscricoesAbertas: searchParams.get('inscricoesAbertas') === 'true',
    visivel: searchParams.get('visivel') === 'true',
    sort: searchParams.get('sort') || (showEventFilters ? 'dataInicio-asc' : 'nome-asc')
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Se tem callback onSearch, usar pesquisa dinâmica (para página principal)
    if (onSearch) {
      onSearch(updatedFilters);
    } else {
      // Senão, update URL (para páginas de ONGs e Eventos)
      const params = new URLSearchParams();
      
      if (updatedFilters.query) params.set('query', updatedFilters.query);
      if (updatedFilters.ods.length > 0) params.set('ods', updatedFilters.ods.join(','));
      if (updatedFilters.areas.length > 0) params.set('areas', updatedFilters.areas.join(','));
      if (updatedFilters.colaboracao.length > 0) params.set('colaboracao', updatedFilters.colaboracao.join(','));
      if (updatedFilters.tipo.length > 0) params.set('tipo', updatedFilters.tipo.join(','));
      if (updatedFilters.localizacao) params.set('localizacao', updatedFilters.localizacao);
      if (updatedFilters.inscricoesAbertas) params.set('inscricoesAbertas', 'true');
      if (updatedFilters.visivel) params.set('visivel', 'true');
      if (updatedFilters.sort !== (showEventFilters ? 'dataInicio-asc' : 'nome-asc')) params.set('sort', updatedFilters.sort);
      
      const basePath = showEventFilters ? '/eventos' : '/ongs';
      router.push(`${basePath}?${params.toString()}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      ods: [],
      areas: [],
      colaboracao: [],
      tipo: [],
      localizacao: '',
      inscricoesAbertas: false,
      visivel: false,
      sort: showEventFilters ? 'dataInicio-asc' : 'nome-asc'
    });
    const basePath = showEventFilters ? '/eventos' : '/ongs';
    router.push(basePath);
  };

  const hasActiveFilters = 
    filters.query || 
    filters.ods.length > 0 || 
    filters.areas.length > 0 || 
    filters.colaboracao.length > 0 || 
    filters.tipo.length > 0 ||
    filters.localizacao ||
    filters.inscricoesAbertas ||
    filters.visivel ||
    filters.sort !== (showEventFilters ? 'dataInicio-asc' : 'nome-asc');

  const sortOptions = showEventFilters ? [
    { value: 'dataInicio-asc', label: 'Data mais próxima' },
    { value: 'dataInicio-desc', label: 'Data mais distante' },
    { value: 'nome-asc', label: 'Nome A-Z' },
    { value: 'nome-desc', label: 'Nome Z-A' },
    { value: 'recent', label: 'Mais recentes' }
  ] : [
    { value: 'nome-asc', label: 'Nome A-Z' },
    { value: 'nome-desc', label: 'Nome Z-A' },
    { value: 'recent', label: 'Mais recentes' },
    { value: 'most-ods', label: 'Mais ODS' }
  ];

  const localizacaoOptions = [
    { value: '', label: 'Todas as localizações' },
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'porto', label: 'Porto' },
    { value: 'coimbra', label: 'Coimbra' },
    { value: 'braga', label: 'Braga' },
    { value: 'aveiro', label: 'Aveiro' },
    { value: 'faro', label: 'Faro' },
    { value: 'leiria', label: 'Leiria' },
    { value: 'santarem', label: 'Santarém' },
    { value: 'viseu', label: 'Viseu' },
    { value: 'vila-nova-de-gaia', label: 'Vila Nova de Gaia' },
    { value: 'amadora', label: 'Amadora' },
    { value: 'setubal', label: 'Setúbal' },
    { value: 'guimaraes', label: 'Guimarães' },
    { value: 'funchal', label: 'Funchal' }
  ];

  return (
    <div className={`${className}`}>
      {/* Barra de Pesquisa Principal - Estilo UNIVA */}
      <div className="bg-white rounded-full shadow-lg p-2 flex flex-col lg:flex-row items-center gap-2">
        {/* Campo de pesquisa */}
        <div className="flex-1 flex items-center px-4 py-3 w-full lg:w-auto">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder={showEventFilters ? "Pesquisa por eventos, ONGs ou localização..." : "Pesquisa por ONGs, causas ou localização..."}
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Filtros Inline */}
        <div className="flex items-center gap-2 px-2 flex-wrap">
          {/* Botão de Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Search className="h-4 w-4 mr-2 inline" />
            Filtros
          </button>

          {/* Botão Limpar */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* ODS */}
            <MultiSelect
              label="ODS"
              placeholder="Selecionar ODS..."
              options={odsOptions}
              value={filters.ods}
              onChange={(value) => updateFilters({ ods: value })}
            />

            {/* Areas */}
            <MultiSelect
              label="Áreas de Atuação"
              placeholder="Selecionar áreas..."
              options={areasOptions}
              value={filters.areas}
              onChange={(value) => updateFilters({ areas: value })}
            />

            {/* Localização */}
            <Select
              label="Localização"
              placeholder="Selecionar localização..."
              options={localizacaoOptions}
              value={filters.localizacao}
              onChange={(e) => updateFilters({ localizacao: e.target.value })}
            />

            {/* Colaboração (para ONGs ou página principal) */}
            {(!showEventFilters || onSearch) && colaboracaoOptions.length > 0 && (
              <MultiSelect
                label="Tipos de Colaboração"
                placeholder="Selecionar tipos..."
                options={colaboracaoOptions}
                value={filters.colaboracao}
                onChange={(value) => updateFilters({ colaboracao: value })}
              />
            )}

            {/* Tipo de Evento (para Eventos ou página principal) */}
            {(showEventFilters || onSearch) && tipoOptions.length > 0 && (
              <MultiSelect
                label="Tipo de Evento"
                placeholder="Selecionar tipos..."
                options={tipoOptions}
                value={filters.tipo}
                onChange={(value) => updateFilters({ tipo: value })}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Select
              label="Ordenar por"
              options={sortOptions}
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            />
            
            <div className="flex items-center">
              <Toggle
                label={showEventFilters ? "Apenas eventos visíveis" : "Apenas ONGs visíveis"}
                checked={filters.visivel}
                onChange={(e) => updateFilters({ visivel: e.target.checked })}
              />
            </div>

            {showEventFilters && (
              <div className="flex items-center">
                <Toggle
                  label="Apenas com inscrições abertas"
                  checked={filters.inscricoesAbertas}
                  onChange={(e) => updateFilters({ inscricoesAbertas: e.target.checked })}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.query && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {filters.query}
              <button
                onClick={() => updateFilters({ query: '' })}
                className="hover:bg-green-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.ods.length > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {filters.ods.length} ODS
              <button
                onClick={() => updateFilters({ ods: [] })}
                className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.areas.length > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {filters.areas.length} Área{filters.areas.length > 1 ? 's' : ''}
              <button
                onClick={() => updateFilters({ areas: [] })}
                className="hover:bg-purple-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.localizacao && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {localizacaoOptions.find(opt => opt.value === filters.localizacao)?.label || filters.localizacao}
              <button
                onClick={() => updateFilters({ localizacao: '' })}
                className="hover:bg-green-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.colaboracao.length > 0 && !showEventFilters && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              {filters.colaboracao.length} Colaboração
              <button
                onClick={() => updateFilters({ colaboracao: [] })}
                className="hover:bg-orange-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.tipo.length > 0 && showEventFilters && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
              {filters.tipo.length} Tipo{filters.tipo.length > 1 ? 's' : ''}
              <button
                onClick={() => updateFilters({ tipo: [] })}
                className="hover:bg-indigo-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.inscricoesAbertas && showEventFilters && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              Inscrições Abertas
              <button
                onClick={() => updateFilters({ inscricoesAbertas: false })}
                className="hover:bg-yellow-200 rounded-full p-0.5 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
