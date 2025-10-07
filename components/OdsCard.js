import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';

const OdsCard = ({ ods, className = '' }) => {
  // Função para obter o caminho da imagem do ODS
  const getOdsImage = (numero) => {
    return `/ods/ods-${numero.toString().padStart(2, '0')}.png`;
  };

  return (
    <Link href={`/ods/${ods.id}`} className="block">
      <Card className={`hover:shadow-lg transition-all duration-200 overflow-hidden group border-0 ${className}`}>
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          {/* Imagem do ODS */}
          <Image
            src={getOdsImage(ods.numero)}
            alt={`ODS ${ods.numero} - ${ods.nome}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Overlay com número do ODS */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">
              {ods.numero}
            </span>
          </div>
          
          {/* Overlay de hover com nome */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-end">
            <div className="p-3 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
              <h3 className="text-white font-semibold text-sm leading-tight">
                {ods.nome}
              </h3>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default OdsCard;
