import Link from 'next/link';
import NgoCard from '@/components/NgoCard';
import Button from '@/components/ui/Button';

const FeaturedNGOs = ({ ngos = [] }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ONGs em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça algumas das organizações que estão a fazer a diferença em Portugal, 
            trabalhando pelos Objetivos de Desenvolvimento Sustentável.
          </p>
        </div>

        {ngos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {ngos.map((ngo) => (
                <NgoCard key={ngo.id} ngo={ngo} />
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/ongs">
                <Button size="lg">
                  Ver Todas as ONGs
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma ONG encontrada.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedNGOs;





