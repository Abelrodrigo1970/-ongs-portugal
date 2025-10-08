import Link from 'next/link';
import EmpresaCard from '@/components/EmpresaCard';
import Button from '@/components/ui/Button';
import { Building2 } from 'lucide-react';

const FeaturedEmpresas = ({ empresas = [] }) => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-blue-25 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Empresas Parceiras
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça empresas que estão a fazer a diferença através de parcerias com ONGs e iniciativas de impacto social.
          </p>
        </div>

        {empresas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {empresas.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/empresas">
                <Button size="lg" variant="primary">
                  Ver Todas as Empresas
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma empresa disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEmpresas;
