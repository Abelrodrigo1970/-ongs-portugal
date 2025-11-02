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
    <Card 
      className={`hover:shadow-xl transition-all duration-300 overflow-hidden rounded-[32px] border ${className}`}
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(64, 64, 64, 0.15)'
      }}
    >
      <Link href={`/ongs/${ngo.id}`} className="block">
        <div className="flex flex-col h-full">
          {/* NGO Image */}
          <div className="relative h-48 rounded-t-[32px] overflow-hidden" style={{ backgroundColor: '#F2F2F7' }}>
            {ngo.imagem ? (
              <Image
                src={ngo.imagem}
                alt={ngo.nome}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F2F2F7' }}>
                {ngo.logo ? (
                  <Image
                    src={ngo.logo}
                    alt={`Logo ${ngo.nome}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EF4037' }}>
                    <span className="text-white text-3xl font-bold">
                      {ngo.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-grow">
            <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight" style={{ color: '#404040' }}>
              {ngo.nome}
            </h3>

            {/* ODS Images */}
            {odsList.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {odsList.slice(0, 4).map(ods => (
                    <div key={ods.id} className="relative w-10 h-10 rounded-lg overflow-hidden">
                      <Image
                        src={getOdsImage(ods.numero)}
                        alt={`ODS ${ods.numero} - ${ods.nome}`}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ))}
                  {odsList.length > 4 && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'rgba(21, 93, 252, 0.1)', color: '#155DFC' }}>
                      +{odsList.length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Areas */}
            {areasList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {areasList.slice(0, 2).map((area, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(21, 93, 252, 0.1)', 
                        color: '#155DFC' 
                      }}
                    >
                      {area}
                    </span>
                  ))}
                  {areasList.length > 2 && (
                    <span 
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(64, 64, 64, 0.1)', 
                        color: '#595959' 
                      }}
                    >
                      +{areasList.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="flex items-center text-sm font-medium" style={{ color: '#595959' }}>
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{ngo.localizacao}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NgoCard;

