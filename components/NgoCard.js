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
          <div className="relative rounded-t-[32px] overflow-hidden" style={{ height: '200px', backgroundColor: '#F2F2F7' }}>
            {ngo.imagem ? (
              <Image
                src={ngo.imagem}
                alt={ngo.nome}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    style={{ width: 'auto', height: 'auto' }}
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
          <div className="flex-grow" style={{ padding: '24px' }}>
            <h3 
              className="line-clamp-2" 
              style={{ 
                color: '#404040',
                fontSize: '18px',
                fontWeight: '700',
                lineHeight: '1.4',
                marginBottom: '16px'
              }}
            >
              {ngo.nome}
            </h3>

            {/* ODS Images */}
            {odsList.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {odsList.slice(0, 4).map(ods => (
                    <div key={ods.id} className="relative rounded-lg overflow-hidden" style={{ width: '40px', height: '40px' }}>
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
                    <div 
                      className="flex items-center justify-center rounded-lg" 
                      style={{ 
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(21, 93, 252, 0.1)', 
                        color: 'var(--color-button-primary)',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      +{odsList.length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Areas */}
            {areasList.length > 0 && (
              <div>
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {areasList.slice(0, 2).map((area, index) => (
                    <span
                      key={index}
                      className="rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(21, 93, 252, 0.1)', 
                        color: 'var(--color-button-primary)',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '6px 12px',
                        lineHeight: '1.4'
                      }}
                    >
                      {area}
                    </span>
                  ))}
                  {areasList.length > 2 && (
                    <span 
                      className="rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(64, 64, 64, 0.1)', 
                        color: '#595959',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '6px 12px',
                        lineHeight: '1.4'
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
          <div style={{ padding: '0 24px 24px 24px' }}>
            <div className="flex items-center" style={{ color: '#595959', fontSize: '14px', fontWeight: '500', lineHeight: '1.2' }}>
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

