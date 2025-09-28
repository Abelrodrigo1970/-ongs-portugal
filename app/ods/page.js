import Link from 'next/link';
import { getAllODS } from '@/lib/repositories/ods';
import OdsBadge from '@/components/OdsBadge';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Objetivos de Desenvolvimento Sustentável - ONGs Portugal',
  description: 'Conheça os 17 Objetivos de Desenvolvimento Sustentável e as ONGs que trabalham para os alcançar em Portugal.',
};

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

export default async function ODSPage() {
  const allODS = await getAllODS();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 p-2">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center p-2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Objetivos de Desenvolvimento Sustentável
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Os 17 ODS são um apelo universal à ação para acabar com a pobreza, proteger o planeta 
              e garantir que todas as pessoas desfrutem de paz e prosperidade até 2030.
            </p>
          </div>
        </div>
      </section>

      {/* ODS Grid */}
      <section>
        <div className="container-custom">

          <div className="grid grid-cols-4 gap-6">
            {allODS.map((ods) => (
              <Link
                key={ods.id}
                href={`/ongs?ods=${ods.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <div className="text-center p-2">
                    <div className="mb-4">
                      <OdsBadge numero={ods.numero} nome={ods.nome} className="text-lg px-4 py-2" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {ods.nome}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {ods.descricao}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 p-2">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Encontre ONGs por ODS
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Cada ODS tem ONGs dedicadas a trabalhar nessa área específica. 
              Explore e encontre organizações alinhadas com os seus interesses.
            </p>
            <Link href="/ongs">
              <button className="btn-primary text-lg px-8 py-3">
                Ver Todas as ONGs
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}







