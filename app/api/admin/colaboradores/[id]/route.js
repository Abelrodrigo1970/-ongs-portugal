import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getColaboradorById, updateColaborador, deleteColaborador } from '@/lib/repositories/colaboradores';
import { prisma } from '@/lib/db';

// GET - Buscar colaborador por ID
export async function GET(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const colaborador = await getColaboradorById(id);

      if (!colaborador) {
        return Response.json(
          { error: 'Colaborador não encontrado' },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        data: colaborador
      });
    } catch (error) {
      console.error('Erro ao buscar colaborador:', error);
      return Response.json(
        { error: 'Erro ao buscar colaborador' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PUT - Atualizar colaborador
export async function PUT(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const data = await request.json();

      // Validar formato de email se fornecido
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return Response.json(
            { error: 'Email inválido' },
            { status: 400 }
          );
        }
      }

      const colaborador = await updateColaborador(id, data);

      return Response.json({
        success: true,
        data: colaborador
      });
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      return Response.json(
        { error: 'Erro ao atualizar colaborador: ' + error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}

// DELETE - Deletar colaborador
export async function DELETE(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      await deleteColaborador(id);

      return Response.json({
        success: true,
        message: 'Colaborador deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar colaborador:', error);
      return Response.json(
        { error: 'Erro ao deletar colaborador: ' + error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PATCH - Toggle status ativo
export async function PATCH(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      
      const colaborador = await prisma.colaboradorEmpresa.findUnique({ where: { id } });
      
      if (!colaborador) {
        return Response.json(
          { error: 'Colaborador não encontrado' },
          { status: 404 }
        );
      }

      const updated = await prisma.colaboradorEmpresa.update({
        where: { id },
        data: { ativo: !colaborador.ativo },
        include: {
          empresa: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      });

      return Response.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      return Response.json(
        { error: 'Erro ao alterar status: ' + error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}

