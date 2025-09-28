import Link from 'next/link';
import OdsBadge from '@/components/OdsBadge';
import Button from '@/components/ui/Button';

const ODSSection = ({ ods = [] }) => {
  return (
    <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      <div className="container-custom">

        {ods.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {ods.slice(0, 12).map((odsItem) => (
                <Link
                  key={odsItem.id}
                  href={`/ongs?ods=${odsItem.id}`}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-200">
                    <div className="mb-3">
                      <OdsBadge numero={odsItem.numero} nome={odsItem.nome} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {odsItem.nome}
                    </h3>
                  </div>
                </Link>
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






