import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllODS } from '@/lib/repositories/ods';

export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const ods = await getAllODS();

      return Response.json({
        success: true,
        ods
      });
    } catch (error) {
      console.error('Erro ao listar ODS:', error);
      return Response.json(
        { error: 'Erro ao listar ODS' },
        { status: 500 }
      );
    }
  })(request);
}

