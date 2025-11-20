import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';

export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const tipos = await getAllColaboracaoTipos();
      return Response.json({
        success: true,
        tipos
      });
    } catch (error) {
      console.error('Erro ao listar tipos de colaboração:', error);
      return Response.json(
        { success: false, error: 'Erro ao listar tipos de colaboração' },
        { status: 500 }
      );
    }
  })(request);
}


