import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllCausas } from '@/lib/repositories/causas';

export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const causas = await getAllCausas();
      return Response.json({
        success: true,
        causas
      });
    } catch (error) {
      console.error('Erro ao listar causas:', error);
      return Response.json(
        { success: false, error: 'Erro ao listar causas' },
        { status: 500 }
      );
    }
  })(request);
}

