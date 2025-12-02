import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAreaById, updateArea, deleteArea } from '@/lib/repositories/areas';

// GET - Buscar área por ID
export async function GET(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const area = await getAreaById(id);

      if (!area) {
        return Response.json(
          { error: 'Área não encontrada' },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        area
      });
    } catch (error) {
      console.error('Erro ao buscar área:', error);
      return Response.json(
        { error: 'Erro ao buscar área' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PUT - Atualizar área
export async function PUT(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const data = await request.json();

      if (!data.nome || data.nome.trim() === '') {
        return Response.json(
          { success: false, message: 'Nome da área é obrigatório' },
          { status: 400 }
        );
      }

      const area = await updateArea(id, {
        nome: data.nome.trim()
      });

      return Response.json({
        success: true,
        area
      });
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      
      if (error.code === 'P2025') {
        return Response.json(
          { success: false, message: 'Área não encontrada' },
          { status: 404 }
        );
      }

      if (error.code === 'P2002') {
        return Response.json(
          { success: false, message: 'Já existe uma área com este nome' },
          { status: 400 }
        );
      }

      return Response.json(
        { success: false, message: 'Erro ao atualizar área' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// DELETE - Deletar área
export async function DELETE(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      await deleteArea(id);

      return Response.json({
        success: true,
        message: 'Área deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar área:', error);
      
      if (error.code === 'P2025') {
        return Response.json(
          { success: false, message: 'Área não encontrada' },
          { status: 404 }
        );
      }

      // Erro de foreign key constraint (área está sendo usada)
      if (error.code === 'P2003') {
        return Response.json(
          { success: false, message: 'Não é possível deletar esta área pois está sendo utilizada por uma ou mais ONGs' },
          { status: 400 }
        );
      }

      return Response.json(
        { success: false, message: 'Erro ao deletar área' },
        { status: 500 }
      );
    }
  })(request, { params });
}

