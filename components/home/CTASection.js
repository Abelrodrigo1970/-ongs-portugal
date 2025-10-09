import Link from 'next/link';
import Button from '@/components/ui/Button';

const CTASection = () => {
  return (
    <section className="text-white" style={{ backgroundColor: 'rgb(36, 180, 23)' }}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 p-2">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Junte-se a milhares de pessoas que já estão a colaborar com ONGs em Portugal. 
            Encontre a organização certa para si e comece a sua jornada de impacto positivo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;







