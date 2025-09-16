import Link from 'next/link';
import OdsBadge from '@/components/OdsBadge';
import Button from '@/components/ui/Button';

const ODSSection = ({ ods = [] }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Objetivos de Desenvolvimento Sustentável
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Os 17 ODS são um apelo universal à ação para acabar com a pobreza, proteger o planeta 
            e garantir que todas as pessoas desfrutem de paz e prosperidade até 2030.
          </p>
        </div>

        {ods.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {ods.slice(0, 12).map((odsItem) => (
                <Link
                  key={odsItem.id}
                  href={`/ongs?ods=${odsItem.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-200">
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




