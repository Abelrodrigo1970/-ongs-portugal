import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllAreas, createArea } from '@/lib/repositories/areas';

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

export async function POST(request) {
  return withAdminAuth(async () => {
    try {
      const data = await request.json();

      if (!data.nome || data.nome.trim() === '') {
        return Response.json(
          { success: false, message: 'Nome da área é obrigatório' },
          { status: 400 }
        );
      }

      const area = await createArea({
        nome: data.nome.trim(),
        icone: data.icone?.trim() || null
      });

      return Response.json({
        success: true,
        area
      });
    } catch (error) {
      console.error('Erro ao criar área de atuação:', error);
      
      // Verificar se é erro de duplicação
      if (error.code === 'P2002') {
        return Response.json(
          { success: false, message: 'Já existe uma área com este nome' },
          { status: 400 }
        );
      }

      return Response.json(
        { success: false, message: 'Erro ao criar área de atuação' },
        { status: 500 }
      );
    }
  })(request);
}
