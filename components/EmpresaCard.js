import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import { MapPin, Building2 } from 'lucide-react';

const EmpresaCard = ({ empresa, className = '' }) => {
  const odsList = empresa.ods?.map(empresaOds => empresaOds.ods) || [];
  const causasList = empresa.causas?.map(empresaCausa => empresaCausa.causa.nome) || [];

  // Função para obter o caminho da imagem do ODS
  const getOdsImage = (numero) => {
    return `/ods/ods-${numero.toString().padStart(2, '0')}.png`;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      <Link href={`/empresas/${empresa.id}`} className="block">
        <div className="flex flex-col h-full">
          {/* Company Logo/Image */}
          <div className="relative h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-t-lg overflow-hidden flex items-center justify-center">
            {empresa.logo ? (
              <div className="relative w-24 h-24">
                <Image
                  src={empresa.logo}
                  alt={`Logo ${empresa.nome}`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {empresa.nome}
            </h3>

            {/* Sector */}
            {empresa.setor && (
              <p className="text-sm text-gray-600 mb-2 truncate">
                {empresa.setor}
              </p>
            )}

            {/* ODS Images */}
            {odsList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {odsList.slice(0, 3).map(ods => (
                    <div key={ods.id} className="relative w-8 h-8">
                      <Image
                        src={getOdsImage(ods.numero)}
                        alt={`ODS ${ods.numero} - ${ods.nome}`}
                        fill
                        className="object-cover rounded"
                        sizes="32px"
                      />
                    </div>
                  ))}
                  {odsList.length > 3 && (
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded text-xs text-gray-500">
                      +{odsList.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Causas */}
            {causasList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {causasList.slice(0, 2).map((causa, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                    >
                      {causa}
                    </span>
                  ))}
                  {causasList.length > 2 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      +{causasList.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            {empresa.localizacao && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{empresa.localizacao}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default EmpresaCard;
