import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getEventById, updateEvent, deleteEvent } from '@/lib/repositories/events';
import { prisma } from '@/lib/db';

// GET - Buscar evento por ID
export async function GET(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const event = await getEventById(id);

      if (!event) {
        return Response.json(
          { error: 'Evento não encontrado' },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      return Response.json(
        { error: 'Erro ao buscar evento' },
        { status: 500 }
      );
    }
  })(request, { params });
}

// PUT - Atualizar evento
export async function PUT(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const data = await request.json();

      // Converter datas para Date objects
      if (typeof data.dataInicio === 'string') {
        data.dataInicio = new Date(data.dataInicio);
      }
      if (data.dataFim && typeof data.dataFim === 'string') {
        data.dataFim = new Date(data.dataFim);
      }

      const event = await updateEvent(id, data);

      return Response.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return Response.json(
        { error: 'Erro ao atualizar evento: ' + error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}

// DELETE - Deletar evento
export async function DELETE(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      await deleteEvent(id);

      return Response.json({
        success: true,
        message: 'Evento deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      return Response.json(
        { error: 'Erro ao deletar evento: ' + error.message },
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
      
      const event = await prisma.event.findUnique({ where: { id } });
      
      if (!event) {
        return Response.json(
          { error: 'Evento não encontrado' },
          { status: 404 }
        );
      }

      const updated = await prisma.event.update({
        where: { id },
        data: { visivel: !event.visivel },
        include: {
          ngo: true,
          ods: {
            include: {
              ods: true
            }
          },
          areas: {
            include: {
              tipo: true
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

