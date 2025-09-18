import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ONGs Portugal - Conectando Organizações e Colaboradores',
  description: 'Descubra ONGs em Portugal, suas áreas de atuação e como pode colaborar para um mundo melhor.',
  keywords: 'ONGs, Portugal, voluntariado, colaboração, sustentabilidade, ODS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}





