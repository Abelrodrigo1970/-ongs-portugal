'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

const Hero = ({ odsOptions = [], areasOptions = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocal, setSelectedLocal] = useState('');
  const [selectedInteresses, setSelectedInteresses] = useState('');
  const [selectedODS, setSelectedODS] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('query', searchQuery);
    if (selectedODS) params.set('ods', selectedODS);
    if (selectedInteresses) params.set('areas', selectedInteresses);
    
    router.push(`/ongs?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Começa a Tua Jornada de Impacto
          </h1>
          <p className="text-lg md:text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
            Descobre oportunidades de voluntariado com propósito e liga-te a ONGs que estão a fazer a diferença.
          </p>

          {/* Barra de Pesquisa Central */}
          <div className="bg-white rounded-full shadow-lg p-2 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto">
            {/* Campo de pesquisa */}
            <div className="flex-1 flex items-center px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Pesquisa por voluntariados, ONGs ou Eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 px-2">
              {/* Local */}
              <div className="relative">
                <select
                  value={selectedLocal}
                  onChange={(e) => setSelectedLocal(e.target.value)}
                  className="appearance-none bg-gray-50 text-gray-700 px-4 py-3 rounded-full border-0 outline-none cursor-pointer pr-8 min-w-[120px]"
                >
                  <option value="">Local</option>
                  <option value="lisboa">Lisboa</option>
                  <option value="porto">Porto</option>
                  <option value="coimbra">Coimbra</option>
                  <option value="braga">Braga</option>
                  <option value="aveiro">Aveiro</option>
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Interesses */}
              <div className="relative">
                <select
                  value={selectedInteresses}
                  onChange={(e) => setSelectedInteresses(e.target.value)}
                  className="appearance-none bg-gray-50 text-gray-700 px-4 py-3 rounded-full border-0 outline-none cursor-pointer pr-8 min-w-[140px]"
                >
                  <option value="">Interesses</option>
                  {areasOptions.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* ODS */}
              <div className="relative">
                <select
                  value={selectedODS}
                  onChange={(e) => setSelectedODS(e.target.value)}
                  className="appearance-none bg-gray-50 text-gray-700 px-4 py-3 rounded-full border-0 outline-none cursor-pointer pr-8 min-w-[100px]"
                >
                  <option value="">ODS</option>
                  {odsOptions.map((ods) => (
                    <option key={ods.value} value={ods.value}>
                      ODS {ods.numero}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

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
    </section>
  );
};

export default Hero;


