'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

const Hero = ({ odsOptions = [], areasOptions = [], colaboracaoOptions = [], onSearch = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocal, setSelectedLocal] = useState('');
  const [selectedInteresses, setSelectedInteresses] = useState('');
  const [selectedODS, setSelectedODS] = useState('');
  const [selectedColaboracao, setSelectedColaboracao] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (onSearch) {
      // Se tem callback, usar pesquisa dinâmica
      const filters = {
        query: searchQuery,
        ods: selectedODS,
        areas: selectedInteresses,
        colaboracao: selectedColaboracao,
        local: selectedLocal
      };
      onSearch(filters);
    } else {
      // Senão, navegar para a página de ONGs
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('query', searchQuery);
      if (selectedODS) params.set('ods', selectedODS);
      if (selectedInteresses) params.set('areas', selectedInteresses);
      if (selectedColaboracao) params.set('colaboracao', selectedColaboracao);
      
      router.push(`/ongs?${params.toString()}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Debounce para pesquisa em tempo real
  useEffect(() => {
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        const filters = {
          query: searchQuery,
          ods: selectedODS,
          areas: selectedInteresses,
          colaboracao: selectedColaboracao,
          local: selectedLocal
        };
        onSearch(filters);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedODS, selectedInteresses, selectedColaboracao, selectedLocal, onSearch]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold mb-4 text-gray-900 p-6">
            Hoje é dia de fazer a diferença
          </h1>

          {/* Barra de Pesquisa Central */}
          <div className="bg-white rounded-full shadow-lg p-4 flex items-center gap-3 max-w-7xl mx-auto">
            {/* Campo de pesquisa principal */}
            <div className="flex-1 flex items-center px-6 py-3">
              <Search className="h-6 w-6 text-gray-400 mr-4" />
              <input
                type="text"
                placeholder="Pesquisa por Eventos e ONGs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full outline-none text-gray-700 placeholder-gray-400 text-lg"
              />
            </div>

            {/* Separador vertical */}
            <div className="h-10 w-px bg-gray-200"></div>

            {/* Filtros */}
            <div className="flex items-center gap-2 px-2">
              {/* Local */}
              <div className="relative w-24">
                <select
                  value={selectedLocal}
                  onChange={(e) => setSelectedLocal(e.target.value)}
                  className="appearance-none bg-transparent text-gray-700 px-3 py-2 border-0 outline-none cursor-pointer pr-6 w-full text-sm"
                >
                  <option value="">Local</option>
                  <option value="lisboa">Lisboa</option>
                  <option value="porto">Porto</option>
                  <option value="coimbra">Coimbra</option>
                  <option value="braga">Braga</option>
                  <option value="aveiro">Aveiro</option>
                </select>
                <ChevronDown className="h-3 w-3 text-gray-400 absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Separador vertical */}
              <div className="h-10 w-px bg-gray-200"></div>

              {/* Interesses */}
              <div className="relative w-24">
                <select
                  value={selectedInteresses}
                  onChange={(e) => setSelectedInteresses(e.target.value)}
                  className="appearance-none bg-transparent text-gray-700 px-3 py-2 border-0 outline-none cursor-pointer pr-6 w-full text-sm"
                >
                  <option value="">Interesses</option>
                  {areasOptions.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-gray-400 absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Separador vertical */}
              <div className="h-10 w-px bg-gray-200"></div>

              {/* ODS */}
              <div className="relative w-24">
                <select
                  value={selectedODS}
                  onChange={(e) => setSelectedODS(e.target.value)}
                  className="appearance-none bg-transparent text-gray-700 px-3 py-2 border-0 outline-none cursor-pointer pr-6 w-full text-sm"
                >
                  <option value="">ODS</option>
                  {odsOptions.map((ods) => (
                    <option key={ods.value} value={ods.value}>
                      ODS {ods.numero}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-gray-400 absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Separador vertical */}
              <div className="h-10 w-px bg-gray-200"></div>

              {/* Colaboração */}
              <div className="relative w-24">
                <select
                  value={selectedColaboracao}
                  onChange={(e) => setSelectedColaboracao(e.target.value)}
                  className="appearance-none bg-transparent text-gray-700 px-3 py-2 border-0 outline-none cursor-pointer pr-6 w-full text-sm"
                >
                  <option value="">Colaboração</option>
                  {colaboracaoOptions.map((colaboracao) => (
                    <option key={colaboracao.value} value={colaboracao.value}>
                      {colaboracao.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-gray-400 absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Separador vertical */}
              <div className="h-10 w-px bg-gray-200"></div>

              {/* Botão de Pesquisa */}
              <Button
                onClick={handleSearch}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full"
              >
                Pesquisar
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Hero;


