import Badge from './ui/Badge';

const OdsBadge = ({ numero, nome, className = '' }) => {
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





