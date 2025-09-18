import Link from 'next/link';
import Button from '@/components/ui/Button';

const CTASection = () => {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Junte-se a milhares de pessoas que já estão a colaborar com ONGs em Portugal. 
            Encontre a organização certa para si e comece a sua jornada de impacto positivo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ongs">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Encontrar ONGs
              </Button>
            </Link>
            <Link href="/ods">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Explorar ODS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;





