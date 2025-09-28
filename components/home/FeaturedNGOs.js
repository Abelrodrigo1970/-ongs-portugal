import Link from 'next/link';
import NgoCard from '@/components/NgoCard';
import Button from '@/components/ui/Button';

const FeaturedNGOs = ({ ngos = [] }) => {
  return (
    <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 p-2">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 p-2">
            ONGs para si
          </h2>
        </div>

        {ngos.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              {ngos.slice(0, 4).map((ngo) => (
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






