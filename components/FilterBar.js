'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from './ui/Input';
import MultiSelect from './ui/MultiSelect';
import Select from './ui/Select';
import Toggle from './ui/Toggle';
import Button from './ui/Button';
import { Search, X, ChevronDown } from 'lucide-react';

const FilterBar = ({ 
  odsOptions = [], 
  areasOptions = [], 
  colaboracaoOptions = [],
  tipoOptions = [],
  showEventFilters = false,
  onSearch = null,
  className = '',
  figmaStyle = false,
  basePath = null // Permite especificar o caminho base (ex: '/empresas')
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    ods: searchParams.get('ods')?.split(',').filter(Boolean) || [],
    areas: searchParams.get('areas')?.split(',').filter(Boolean) || [],
    colaboracao: searchParams.get('colaboracao')?.split(',').filter(Boolean) || [],
    tipo: searchParams.get('tipo')?.split(',').filter(Boolean) || [],
    localizacao: searchParams.get('localizacao')?.split(',').filter(Boolean) || [],
    vagas: searchParams.get('vagas') || '',
    duracao: searchParams.get('duracao') || '',
    inscricoesAbertas: searchParams.get('inscricoesAbertas') === 'true',
    visivel: searchParams.get('visivel') === 'true',
    sort: searchParams.get('sort') || (showEventFilters ? 'dataInicio-asc' : 'nome-asc')
  });

  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'areas', 'localizacao', 'colaboracao', 'tipo', 'vagas', 'duracao', null
  const filterBarRef = useRef(null);

  // Fechar dropdown ao clicar fora (apenas quando figmaStyle está ativo)
  useEffect(() => {
    if (!figmaStyle) return;
    
    const handleClickOutside = (event) => {
      // Não fechar se clicar dentro do dropdown ou do MultiSelect
      if (openDropdown && 
          !event.target.closest('.filter-dropdown-container') &&
          !event.target.closest('.absolute') && // Não fechar se clicar dentro do dropdown
          !event.target.closest('[role="listbox"]') && // Não fechar se clicar dentro do MultiSelect
          !event.target.closest('input[type="checkbox"]')) { // Não fechar se clicar em checkbox
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown, figmaStyle]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (filters) => {
      const timeoutId = setTimeout(() => {
        if (onSearch) {
          onSearch(filters);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [onSearch]
  );

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Se tem callback onSearch, usar pesquisa dinâmica (para página principal)
    if (onSearch) {
      console.log('🔧 FilterBar sending to onSearch:', updatedFilters);
      // Use debounced search for query changes, immediate for others
      if (newFilters.query !== undefined) {
        debouncedSearch(updatedFilters);
      } else {
        onSearch(updatedFilters);
      }
    } else {
      // Senão, update URL (para páginas de ONGs e Eventos)
      const params = new URLSearchParams();
      
      // Construir parâmetros apenas com os filtros ativos
      if (updatedFilters.query) params.set('query', updatedFilters.query);
      if (updatedFilters.ods.length > 0) params.set('ods', updatedFilters.ods.join(','));
      if (updatedFilters.areas.length > 0) params.set('areas', updatedFilters.areas.join(','));
      if (updatedFilters.colaboracao.length > 0) params.set('colaboracao', updatedFilters.colaboracao.join(','));
      if (updatedFilters.tipo.length > 0) params.set('tipo', updatedFilters.tipo.join(','));
      if (updatedFilters.localizacao.length > 0) params.set('localizacao', updatedFilters.localizacao.join(','));
      if (updatedFilters.vagas) params.set('vagas', updatedFilters.vagas);
      if (updatedFilters.duracao) params.set('duracao', updatedFilters.duracao);
      if (updatedFilters.inscricoesAbertas) params.set('inscricoesAbertas', 'true');
      if (updatedFilters.visivel) params.set('visivel', 'true');
      if (updatedFilters.sort !== (showEventFilters ? 'dataInicio-asc' : 'nome-asc')) params.set('sort', updatedFilters.sort);
      
      const path = basePath || (showEventFilters ? '/eventos' : '/ongs');
      const queryString = params.toString();
      const newUrl = queryString ? `${path}?${queryString}` : path;
      
      console.log('🔧 FilterBar updating URL:', newUrl, 'with filters:', updatedFilters);
      
      // Usar push para garantir que a navegação acontece
      router.push(newUrl);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      ods: [],
      areas: [],
      colaboracao: [],
      tipo: [],
      localizacao: [],
      vagas: '',
      duracao: '',
      inscricoesAbertas: false,
      visivel: false,
      sort: showEventFilters ? 'dataInicio-asc' : 'nome-asc'
    });
    const path = basePath || (showEventFilters ? '/eventos' : '/ongs');
    router.push(path);
  };

  const hasActiveFilters = 
    filters.query || 
    filters.ods.length > 0 || 
    filters.areas.length > 0 || 
    filters.colaboracao.length > 0 || 
    filters.tipo.length > 0 ||
    filters.localizacao.length > 0 ||
    filters.vagas ||
    filters.duracao ||
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

  // Se figmaStyle, mostrar botões de filtro com dropdowns individuais
  // Para eventos: 5 botões, para ONGs: 3 botões
  if (figmaStyle) {
    return (
      <div 
        className="flex flex-col items-center w-full"
        style={{ 
          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: openDropdown ? 10002 : 1
        }}
        ref={filterBarRef}
      >
        {/* Botões de Filtro */}
        <div 
          className="flex items-center justify-center gap-4 relative w-full"
          style={{ zIndex: openDropdown ? 10002 : 'auto' }}
        >
        {/* Filter Button 1 - Áreas de Interesse */}
        <div className="filter-dropdown-container relative" style={{ zIndex: openDropdown === 'areas' ? 10000 : 'auto' }}>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'areas' ? null : 'areas')}
            className="flex items-center justify-center rounded-[200px] transition-colors"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(213, 225, 255)',
              borderRadius: '200px',
              height: '46px',
              padding: '8px 16px',
              gap: '8px'
            }}
          >
            <span 
              style={{ 
                color: 'rgb(100, 116, 139)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '16.8px'
              }}
            >
              Áreas de Interesse
            </span>
            <ChevronDown 
              className="lucide lucide-chevron-down"
              style={{ 
                width: '24px', 
                height: '24px',
                color: 'rgb(100, 116, 139)',
                transform: openDropdown === 'areas' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </button>
          
          {/* Dropdown para Áreas de Interesse */}
          {openDropdown === 'areas' && (
            <div 
              className="absolute top-full left-0 mt-2"
              style={{
                zIndex: 9999
              }}
            >
              <MultiSelect
                placeholder="Selecionar áreas..."
                options={areasOptions}
                value={filters.areas || []}
                onChange={(value) => {
                  console.log('🔧 Áreas changed:', value);
                  updateFilters({ areas: Array.isArray(value) ? value : [] });
                }}
                hideTriggerButton={true}
              />
            </div>
          )}
        </div>

        {/* Filter Button 2 - Localização */}
        <div className="filter-dropdown-container relative" style={{ zIndex: openDropdown === 'localizacao' ? 10000 : 'auto' }}>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'localizacao' ? null : 'localizacao')}
            className="flex items-center justify-center rounded-[200px] transition-colors"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(213, 225, 255)',
              borderRadius: '200px',
              height: '46px',
              padding: '8px 16px',
              gap: '8px'
            }}
          >
            <span 
              style={{ 
                color: 'rgb(100, 116, 139)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '16.8px'
              }}
            >
              Localização
            </span>
            <ChevronDown 
              className="lucide lucide-chevron-down"
              style={{ 
                width: '24px', 
                height: '24px',
                color: 'rgb(100, 116, 139)',
                transform: openDropdown === 'localizacao' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </button>
          
          {/* Dropdown para Localização */}
          {openDropdown === 'localizacao' && (
            <div 
              className="absolute top-full left-0 mt-2"
              style={{
                zIndex: 9999
              }}
            >
              <MultiSelect
                placeholder="Selecionar localizações..."
                options={localizacaoOptions.filter(opt => opt.value !== '')}
                value={filters.localizacao || []}
                onChange={(value) => {
                  console.log('🔧 Localização changed:', value);
                  updateFilters({ localizacao: Array.isArray(value) ? value : [] });
                }}
                hideTriggerButton={true}
              />
            </div>
          )}
        </div>

        {/* Filter Button 3 - Tipo de evento (para eventos) ou Tipo de Colaboração (para ONGs) */}
        {showEventFilters ? (
          <div className="filter-dropdown-container relative" style={{ zIndex: openDropdown === 'tipo' ? 10000 : 'auto' }}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'tipo' ? null : 'tipo')}
              className="flex items-center justify-center rounded-[200px] transition-colors"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '1px solid rgb(213, 225, 255)',
                borderRadius: '200px',
                height: '46px',
                padding: '8px 16px',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  color: 'rgb(100, 116, 139)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '16.8px'
                }}
              >
                Tipo de evento
              </span>
              <ChevronDown 
                className="lucide lucide-chevron-down"
                style={{ 
                  width: '24px', 
                  height: '24px',
                  color: 'rgb(100, 116, 139)',
                  transform: openDropdown === 'tipo' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </button>
            
            {/* Dropdown para Tipo de evento */}
            {openDropdown === 'tipo' && (
              <div 
                className="absolute top-full left-0 mt-2"
                style={{
                  zIndex: 9999
                }}
              >
                <MultiSelect
                  placeholder="Selecionar tipos..."
                  options={tipoOptions}
                  value={filters.tipo || []}
                  onChange={(value) => {
                    console.log('🔧 Tipo changed:', value);
                    updateFilters({ tipo: Array.isArray(value) ? value : [] });
                  }}
                  hideTriggerButton={true}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="filter-dropdown-container relative" style={{ zIndex: openDropdown === 'colaboracao' ? 10000 : 'auto' }}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'colaboracao' ? null : 'colaboracao')}
              className="flex items-center justify-center rounded-[200px] transition-colors"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '1px solid rgb(213, 225, 255)',
                borderRadius: '200px',
                height: '46px',
                padding: '8px 16px',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  color: 'rgb(100, 116, 139)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '16.8px'
                }}
              >
                Tipo de Colaboração
              </span>
              <ChevronDown 
                className="lucide lucide-chevron-down"
                style={{ 
                  width: '24px', 
                  height: '24px',
                  color: 'rgb(100, 116, 139)',
                  transform: openDropdown === 'colaboracao' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </button>
            
            {/* Dropdown para Tipo de Colaboração */}
            {openDropdown === 'colaboracao' && (
              <div 
                className="absolute top-full left-0 mt-2"
                style={{
                  zIndex: 9999
                }}
              >
                <MultiSelect
                  placeholder="Selecionar tipos..."
                  options={colaboracaoOptions}
                  value={filters.colaboracao || []}
                  onChange={(value) => {
                    console.log('🔧 Colaboração changed:', value);
                    updateFilters({ colaboracao: Array.isArray(value) ? value : [] });
                  }}
                  hideTriggerButton={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Filter Button 4 - Vagas (apenas para eventos) */}
        {showEventFilters && (
          <div className="filter-dropdown-container relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'vagas' ? null : 'vagas')}
              className="flex items-center justify-center rounded-[200px] transition-colors"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d5e1ff',
                borderRadius: '200px',
                height: '46px',
                padding: '8px 16px',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  color: 'rgba(100, 116, 139, 1)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '16.8px'
                }}
              >
                Vagas
              </span>
              <ChevronDown 
                style={{ 
                  width: '24px', 
                  height: '24px',
                  color: 'rgba(100, 116, 139, 1)',
                  transform: openDropdown === 'vagas' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </button>
            
            {/* Dropdown para Vagas */}
            {openDropdown === 'vagas' && (
              <div 
                className="absolute top-full left-0 mt-2 rounded-lg shadow-lg border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(64, 64, 64, 0.15)',
                  padding: '16px',
                  minWidth: '280px',
                  maxWidth: '320px',
                  zIndex: 9999
                }}
              >
                <Select
                  label="Vagas Disponíveis"
                  placeholder="Selecionar..."
                  options={[
                    { value: '', label: 'Todas' },
                    { value: 'available', label: 'Com vagas disponíveis' },
                    { value: 'full', label: 'Sem vagas' }
                  ]}
                  value={filters.vagas || ''}
                  onChange={(e) => {
                    updateFilters({ vagas: e.target.value });
                    setOpenDropdown(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Filter Button 5 - Duração (apenas para eventos) */}
        {showEventFilters && (
          <div className="filter-dropdown-container relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'duracao' ? null : 'duracao')}
              className="flex items-center justify-center rounded-[200px] transition-colors"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d5e1ff',
                borderRadius: '200px',
                height: '46px',
                padding: '8px 16px',
                gap: '8px'
              }}
            >
              <span 
                style={{ 
                  color: 'rgba(100, 116, 139, 1)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '16.8px'
                }}
              >
                Duração
              </span>
              <ChevronDown 
                style={{ 
                  width: '24px', 
                  height: '24px',
                  color: 'rgba(100, 116, 139, 1)',
                  transform: openDropdown === 'duracao' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </button>
            
            {/* Dropdown para Duração */}
            {openDropdown === 'duracao' && (
              <div 
                className="absolute top-full left-0 mt-2 rounded-lg shadow-lg border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(64, 64, 64, 0.15)',
                  padding: '16px',
                  minWidth: '280px',
                  maxWidth: '320px',
                  zIndex: 9999
                }}
              >
                <Select
                  label="Duração"
                  placeholder="Selecionar..."
                  options={[
                    { value: '', label: 'Todas' },
                    { value: 'short', label: 'Curta (até 4 horas)' },
                    { value: 'medium', label: 'Média (4-8 horas)' },
                    { value: 'long', label: 'Longa (mais de 8 horas)' }
                  ]}
                  value={filters.duracao || ''}
                  onChange={(e) => {
                    updateFilters({ duracao: e.target.value });
                    setOpenDropdown(null);
                  }}
                />
              </div>
            )}
          </div>
        )}
        </div>

        {/* Linha Divisória e Filtros Ativos */}
        {hasActiveFilters && (
          <>
            {/* Linha Divisória */}
            <div 
              className="self-stretch"
              style={{ 
                height: '1px', 
                background: '#D9D9D9',
                marginTop: '16px',
                width: '100%'
              }} 
            />

            {/* Seção de Filtros Ativos */}
            <div 
              className="self-stretch"
              style={{ 
                padding: '8px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                display: 'flex',
                flexWrap: 'wrap'
              }}
            >
              {/* Badge de Query */}
              {filters.query && (
                <div 
                  style={{
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '12px',
                    paddingRight: '8px',
                    background: 'var(--base-neutral-50, #F1F5F9)',
                    overflow: 'hidden',
                    borderRadius: '200px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    display: 'flex'
                  }}
                >
                  <div style={{
                    color: 'var(--content-text-primary, #020617)',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600',
                    lineHeight: '19.60px',
                    wordWrap: 'break-word'
                  }}>
                    {filters.query}
                  </div>
                  <button
                    onClick={() => updateFilters({ query: '' })}
                    style={{
                      width: '12px',
                      height: '12px',
                      position: 'relative',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      left: 0,
                      top: 0,
                      position: 'absolute',
                      background: '#D9D9D9',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      width: '7px',
                      height: '7px',
                      left: '2.5px',
                      top: '2.5px',
                      position: 'absolute',
                      background: '#1C1B1F',
                      borderRadius: '50%'
                    }} />
                  </button>
                </div>
              )}

              {/* Badges de ODS */}
              {filters.ods.length > 0 && filters.ods.map((odsId) => {
                const odsOption = odsOptions.find(opt => opt.value === odsId);
                if (!odsOption) return null;
                return (
                  <div 
                    key={odsId}
                    style={{
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '12px',
                      paddingRight: '8px',
                      background: 'var(--base-neutral-50, #F1F5F9)',
                      overflow: 'hidden',
                      borderRadius: '200px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '16px',
                      display: 'flex'
                    }}
                  >
                    <div style={{
                      color: 'var(--content-text-primary, #020617)',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      lineHeight: '19.60px',
                      wordWrap: 'break-word'
                    }}>
                      {odsOption.label}
                    </div>
                    <button
                      onClick={() => updateFilters({ ods: filters.ods.filter(id => id !== odsId) })}
                      style={{
                        width: '12px',
                        height: '12px',
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X 
                        size={12} 
                        style={{ 
                          color: '#1C1B1F',
                          strokeWidth: 3
                        }} 
                      />
                    </button>
                  </div>
                );
              })}

              {/* Badges de Áreas */}
              {filters.areas.length > 0 && filters.areas.map((areaId) => {
                const areaOption = areasOptions.find(opt => opt.value === areaId);
                if (!areaOption) return null;
                return (
                  <div 
                    key={areaId}
                    style={{
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '12px',
                      paddingRight: '8px',
                      background: 'var(--base-neutral-50, #F1F5F9)',
                      overflow: 'hidden',
                      borderRadius: '200px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '16px',
                      display: 'flex'
                    }}
                  >
                    <div style={{
                      color: 'var(--content-text-primary, #020617)',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      lineHeight: '19.60px',
                      wordWrap: 'break-word'
                    }}>
                      {areaOption.label}
                    </div>
                    <button
                      onClick={() => updateFilters({ areas: filters.areas.filter(id => id !== areaId) })}
                      style={{
                        width: '12px',
                        height: '12px',
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X 
                        size={12} 
                        style={{ 
                          color: '#1C1B1F',
                          strokeWidth: 3
                        }} 
                      />
                    </button>
                  </div>
                );
              })}

              {/* Badges de Localização */}
              {filters.localizacao.length > 0 && filters.localizacao.map((localizacaoId) => {
                const localizacaoOption = localizacaoOptions.find(opt => opt.value === localizacaoId);
                if (!localizacaoOption) return null;
                return (
                  <div 
                    key={localizacaoId}
                    style={{
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '12px',
                      paddingRight: '8px',
                      background: 'var(--base-neutral-50, #F1F5F9)',
                      overflow: 'hidden',
                      borderRadius: '200px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '16px',
                      display: 'flex'
                    }}
                  >
                    <div style={{
                      color: 'var(--content-text-primary, #020617)',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      lineHeight: '19.60px',
                      wordWrap: 'break-word'
                    }}>
                      {localizacaoOption.label}
                    </div>
                    <button
                      onClick={() => updateFilters({ localizacao: filters.localizacao.filter(id => id !== localizacaoId) })}
                      style={{
                        width: '12px',
                        height: '12px',
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X 
                        size={12} 
                        style={{ 
                          color: '#1C1B1F',
                          strokeWidth: 3
                        }} 
                      />
                    </button>
                  </div>
                );
              })}

              {/* Badges de Colaboração */}
              {filters.colaboracao.length > 0 && filters.colaboracao.map((colaboracaoId) => {
                const colaboracaoOption = colaboracaoOptions.find(opt => opt.value === colaboracaoId);
                if (!colaboracaoOption) return null;
                return (
                  <div 
                    key={colaboracaoId}
                    style={{
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '12px',
                      paddingRight: '8px',
                      background: 'var(--base-neutral-50, #F1F5F9)',
                      overflow: 'hidden',
                      borderRadius: '200px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '16px',
                      display: 'flex'
                    }}
                  >
                    <div style={{
                      color: 'var(--content-text-primary, #020617)',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      lineHeight: '19.60px',
                      wordWrap: 'break-word'
                    }}>
                      {colaboracaoOption.label}
                    </div>
                    <button
                      onClick={() => updateFilters({ colaboracao: filters.colaboracao.filter(id => id !== colaboracaoId) })}
                      style={{
                        width: '12px',
                        height: '12px',
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X 
                        size={12} 
                        style={{ 
                          color: '#1C1B1F',
                          strokeWidth: 3
                        }} 
                      />
                    </button>
                  </div>
                );
              })}

              {/* Botão Clear All */}
              <button
                onClick={clearFilters}
                style={{
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  background: 'var(--base-neutral-50, #F1F5F9)',
                  overflow: 'hidden',
                  borderRadius: '200px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  display: 'flex',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  color: 'var(--content-text-primary, #020617)',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  lineHeight: '19.60px',
                  wordWrap: 'break-word'
                }}>
                  Clear all
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Barra de Pesquisa Principal */}
      <div 
        className="rounded-full shadow-lg flex flex-col lg:flex-row items-center" 
        style={{ 
          backgroundColor: '#FFFFFF',
          padding: '8px',
          gap: '8px'
        }}
      >
        {/* Campo de pesquisa */}
        <div className="flex-1 flex items-center w-full lg:w-auto" style={{ padding: '12px 16px' }}>
          <Search className="h-5 w-5 mr-3" style={{ color: '#8C8C8C' }} />
          <input
            type="text"
            placeholder={showEventFilters ? "Pesquisa por eventos, ONGs ou localização..." : "Pesquisa por ONGs, causas ou localização..."}
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full outline-none"
            style={{ 
              color: '#404040',
              fontSize: '16px',
              lineHeight: '1.2'
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Filtros Inline */}
        <div className="flex items-center flex-wrap" style={{ gap: '8px', padding: '0 8px' }}>
          {/* Botão de Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full transition-colors"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: showFilters || hasActiveFilters ? 'var(--color-button-primary)' : 'rgba(0, 0, 0, 0.05)',
              color: showFilters || hasActiveFilters ? '#FFFFFF' : '#404040'
            }}
          >
            <Search className="h-4 w-4 mr-2 inline" />
            Filtros
          </button>

          {/* Botão Limpar */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-full transition-colors hover:bg-red-50"
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#EF4037'
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <div 
          className="rounded-lg shadow-sm border" 
          style={{ 
            marginTop: '16px',
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(64, 64, 64, 0.15)',
            padding: '24px'
          }}
        >
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
            <MultiSelect
              label="Localização"
              placeholder="Selecionar localizações..."
              options={localizacaoOptions.filter(opt => opt.value !== '')}
              value={filters.localizacao || []}
              onChange={(value) => updateFilters({ localizacao: Array.isArray(value) ? value : [] })}
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
        <div className="flex flex-wrap" style={{ marginTop: '16px', gap: '8px' }}>
          {filters.query && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {filters.query}
              <button
                onClick={() => updateFilters({ query: '' })}
                className="rounded-full ml-1 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.ods.length > 0 && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {filters.ods.length} ODS
              <button
                onClick={() => updateFilters({ ods: [] })}
                className="rounded-full ml-1 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.areas.length > 0 && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {filters.areas.length} Área{filters.areas.length > 1 ? 's' : ''}
              <button
                onClick={() => updateFilters({ areas: [] })}
                className="rounded-full ml-1 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.localizacao.length > 0 && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {filters.localizacao.length} Localização{filters.localizacao.length > 1 ? 'ões' : ''}
              <button
                onClick={() => updateFilters({ localizacao: [] })}
                className="rounded-full ml-1 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.colaboracao.length > 0 && !showEventFilters && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {filters.colaboracao.length} Colaboração
              <button
                onClick={() => updateFilters({ colaboracao: [] })}
                className="rounded-full ml-1 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.tipo.length > 0 && showEventFilters && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {filters.tipo.length} Tipo{filters.tipo.length > 1 ? 's' : ''}
              <button
                onClick={() => updateFilters({ tipo: [] })}
                className="rounded-full ml-1 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.inscricoesAbertas && showEventFilters && (
            <span 
              className="inline-flex items-center rounded-full" 
              style={{ 
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(21, 93, 252, 0.1)',
                color: 'var(--color-button-primary)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Inscrições Abertas
              <button
                onClick={() => updateFilters({ inscricoesAbertas: false })}
                className="rounded-full ml-1 p-0.5"
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
