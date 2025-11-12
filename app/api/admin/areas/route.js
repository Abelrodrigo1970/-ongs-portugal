import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllAreas } from '@/lib/repositories/areas';

export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const areas = await getAllAreas();
      return Response.json({
        success: true,
        areas
      });
    } catch (error) {
      console.error('Erro ao listar áreas de atuação:', error);
      return Response.json(
        { success: false, error: 'Erro ao listar áreas de atuação' },
        { status: 500 }
      );
    }
  })(request);
}
