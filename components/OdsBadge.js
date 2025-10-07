import Badge from './ui/Badge';
import Image from 'next/image';

const OdsBadge = ({ numero, nome, className = '', showImage = false }) => {
  const getOdsColor = (numero) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-green-500',
      4: 'bg-red-600',
      5: 'bg-orange-600',
      6: 'bg-blue-500',
      7: 'bg-yellow-500',
      8: 'bg-red-700',
      9: 'bg-orange-700',
      10: 'bg-pink-500',
      11: 'bg-yellow-600',
      12: 'bg-yellow-700',
      13: 'bg-green-600',
      14: 'bg-blue-600',
      15: 'bg-green-700',
      16: 'bg-blue-700',
      17: 'bg-blue-800'
    };
    return colors[numero] || 'bg-gray-500';
  };

  // Função para obter o caminho da imagem do ODS
  const getOdsImage = (numero) => {
    return `/ods/ods-${numero.toString().padStart(2, '0')}.png`;
  };

  // Se showImage for true, renderizar como card com imagem
  if (showImage) {
    return (
      <div className={`inline-flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src={getOdsImage(numero)}
            alt={`ODS ${numero}`}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <span className="px-2 py-1 text-xs font-semibold text-gray-700">
          ODS {numero}
        </span>
      </div>
    );
  }

  // Renderização padrão como badge
  return (
    <Badge
      variant="default"
      size="sm"
      className={`${getOdsColor(numero)} text-white font-semibold ${className}`}
    >
      ODS {numero}
    </Badge>
  );
};

export default OdsBadge;





















