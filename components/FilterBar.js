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
  className = '' 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    ods: searchParams.get('ods')?.split(',').filter(Boolean) || [],
    areas: searchParams.get('areas')?.split(',').filter(Boolean) || [],
    colaboracao: searchParams.get('colaboracao')?.split(',').filter(Boolean) || [],
    visivel: searchParams.get('visivel') === 'true',
    sort: searchParams.get('sort') || 'nome-asc'
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL
    const params = new URLSearchParams();
    
    if (updatedFilters.query) params.set('query', updatedFilters.query);
    if (updatedFilters.ods.length > 0) params.set('ods', updatedFilters.ods.join(','));
    if (updatedFilters.areas.length > 0) params.set('areas', updatedFilters.areas.join(','));
    if (updatedFilters.colaboracao.length > 0) params.set('colaboracao', updatedFilters.colaboracao.join(','));
    if (updatedFilters.visivel) params.set('visivel', 'true');
    if (updatedFilters.sort !== 'nome-asc') params.set('sort', updatedFilters.sort);
    
    router.push(`/ongs?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      ods: [],
      areas: [],
      colaboracao: [],
      visivel: false,
      sort: 'nome-asc'
    });
    router.push('/ongs');
  };

  const hasActiveFilters = 
    filters.query || 
    filters.ods.length > 0 || 
    filters.areas.length > 0 || 
    filters.colaboracao.length > 0 || 
    filters.visivel ||
    filters.sort !== 'nome-asc';

  const sortOptions = [
    { value: 'nome-asc', label: 'Nome A-Z' },
    { value: 'nome-desc', label: 'Nome Z-A' },
    { value: 'recent', label: 'Mais recentes' },
    { value: 'most-ods', label: 'Mais ODS' }
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
            placeholder="Pesquisa por ONGs, causas ou localização..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Colaboração */}
            <MultiSelect
              label="Tipos de Colaboração"
              placeholder="Selecionar tipos..."
              options={colaboracaoOptions}
              value={filters.colaboracao}
              onChange={(value) => updateFilters({ colaboracao: value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Select
              label="Ordenar por"
              options={sortOptions}
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            />
            
            <div className="flex items-center">
              <Toggle
                label="Apenas ONGs visíveis"
                checked={filters.visivel}
                onChange={(e) => updateFilters({ visivel: e.target.checked })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.query && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              "{filters.query}"
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
          
          {filters.colaboracao.length > 0 && (
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
        </div>
      )}
    </div>
  );
};

export default FilterBar;