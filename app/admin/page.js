import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Administração - ONGs Portugal',
  description: 'Painel de administração para gestão de ONGs e dados.',
};

export default function AdminPage() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de Administração
          </h1>
          <p className="text-gray-600">
            Gerir ONGs, ODS, áreas de atuação e tipos de colaboração
          </p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  );
}











