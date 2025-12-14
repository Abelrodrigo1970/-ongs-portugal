import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllTiposApoio } from '@/lib/repositories/tiposApoio';

export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const tiposApoio = await getAllTiposApoio();
      return Response.json({
        success: true,
        tiposApoio
      });
    } catch (error) {
      console.error('Erro ao listar tipos de apoio:', error);
      return Response.json(
        { success: false, error: 'Erro ao listar tipos de apoio' },
        { status: 500 }
      );
    }
  })(request);
}

