import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold">ONGs Portugal</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Conectamos organizações não-governamentais com pessoas que querem fazer a diferença. 
              Descubra ONGs em Portugal e encontre formas de colaborar para um mundo melhor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/ongs" className="text-gray-400 hover:text-white transition-colors">
                  ONGs
                </Link>
              </li>
              <li>
                <Link href="/ods" className="text-gray-400 hover:text-white transition-colors">
                  ODS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-gray-400">
              <p>info@ongsportugal.pt</p>
              <p>+351 123 456 789</p>
              <p>Lisboa, Portugal</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ONGs Portugal. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





