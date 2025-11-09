import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getNGOById, updateNGO, deleteNGO, toggleNGOVisibility } from '@/lib/repositories/ngos';

// GET - Buscar ONG por ID
export async function GET(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const ngo = await getNGOById(id);

      if (!ngo) {
        return Response.json(
          { error: 'ONG não encontrada' },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        data: ngo
      });
    } catch (error) {
      console.error('Erro ao buscar ONG:', error);
      return Response.json(
        { error: 'Erro ao buscar ONG' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PUT - Atualizar ONG
export async function PUT(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const data = await request.json();

      // Garantir que impacto seja uma string JSON se for array
      if (Array.isArray(data.impacto)) {
        data.impacto = JSON.stringify(data.impacto);
      }

      const result = await updateNGO(id, data);

      if (!result.success) {
        return Response.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      console.error('Erro ao atualizar ONG:', error);
      return Response.json(
        { error: 'Erro ao atualizar ONG' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// DELETE - Deletar ONG
export async function DELETE(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const result = await deleteNGO(id);

      if (!result.success) {
        return Response.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        message: 'ONG deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar ONG:', error);
      return Response.json(
        { error: 'Erro ao deletar ONG' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PATCH - Toggle visibilidade
export async function PATCH(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const result = await toggleNGOVisibility(id);

      if (!result.success) {
        return Response.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      return Response.json(
        { error: 'Erro ao alterar visibilidade' },
        { status: 500 }
      );
    }
  })(request, { params });
}

