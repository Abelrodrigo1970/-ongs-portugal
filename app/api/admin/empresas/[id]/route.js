import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getEmpresaById, updateEmpresa, deleteEmpresa } from '@/lib/repositories/empresas';
import { prisma } from '@/lib/db';

// GET - Buscar empresa por ID
export async function GET(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const empresa = await getEmpresaById(id);

      if (!empresa) {
        return Response.json(
          { error: 'Empresa não encontrada' },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        data: empresa
      });
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      return Response.json(
        { error: 'Erro ao buscar empresa' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PUT - Atualizar empresa
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

      const empresa = await updateEmpresa(id, data);

      return Response.json({
        success: true,
        data: empresa
      });
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      return Response.json(
        { error: 'Erro ao atualizar empresa: ' + error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}

// DELETE - Deletar empresa
export async function DELETE(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      await deleteEmpresa(id);

      return Response.json({
        success: true,
        message: 'Empresa deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      return Response.json(
        { error: 'Erro ao deletar empresa: ' + error.message },
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
      
      const empresa = await prisma.empresa.findUnique({ where: { id } });
      
      if (!empresa) {
        return Response.json(
          { error: 'Empresa não encontrada' },
          { status: 404 }
        );
      }

      const updated = await prisma.empresa.update({
        where: { id },
        data: { visivel: !empresa.visivel },
        include: {
          ods: {
            include: {
              ods: true
            }
          },
          causas: {
            include: {
              causa: true
            }
          },
          tiposApoio: {
            include: {
              tipoApoio: true
            }
          }
        }
      });

      return Response.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      return Response.json(
        { error: 'Erro ao alterar visibilidade: ' + error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}

