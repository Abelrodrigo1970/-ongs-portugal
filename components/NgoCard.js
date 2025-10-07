import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import { MapPin } from 'lucide-react';

const NgoCard = ({ ngo, className = '' }) => {
  const odsList = ngo.ods?.map(ngoods => ngoods.ods) || [];
  const areasList = ngo.areaAtuacao?.map(area => area.tipo.nome) || [];

  // Função para obter o caminho da imagem do ODS
  const getOdsImage = (numero) => {
    return `/ods/ods-${numero.toString().padStart(2, '0')}.png`;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      <Link href={`/ongs/${ngo.id}`} className="block">
        <div className="flex flex-col h-full">
          {/* NGO Image */}
          <div className="relative h-32 bg-gray-200 rounded-t-lg overflow-hidden">
            {ngo.imagem ? (
              <Image
                src={ngo.imagem}
                alt={ngo.nome}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                {ngo.logo ? (
                  <Image
                    src={ngo.logo}
                    alt={`Logo ${ngo.nome}`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-semibold">
                      {ngo.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {ngo.nome}
            </h3>

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

            {/* Areas */}
            {areasList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {areasList.slice(0, 2).map((area, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                  {areasList.length > 2 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      +{areasList.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{ngo.localizacao}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NgoCard;

