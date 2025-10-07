import Link from 'next/link';
import OdsCard from '@/components/OdsCard';
import Button from '@/components/ui/Button';

const ODSSection = ({ ods = [] }) => {
  return (
    <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 p-2">
      <div className="container-custom">

        {ods.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {ods.slice(0, 12).map((odsItem) => (
                <OdsCard
                  key={odsItem.id}
                  ods={odsItem}
                  className="w-full"
                />
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/ods">
                <Button size="lg" variant="outline">
                  Ver Todos os ODS
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum ODS encontrado.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ODSSection;






