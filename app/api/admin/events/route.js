import { withAdminAuth } from '@/lib/auth/adminAuth';
import { createEvent, getEvents } from '@/lib/repositories/events';

// GET - Listar todos os eventos
export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = {
        query: searchParams.get('query') || '',
        visivel: searchParams.get('visivel') === null ? undefined : searchParams.get('visivel') === 'true',
        ngoId: searchParams.get('ngoId') || null,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '50')
      };

      const result = await getEvents(filters);

      return Response.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      return Response.json(
        { error: 'Erro ao listar eventos' },
        { status: 500 }
      );
    }
  })(request);
}

// POST - Criar novo evento
export async function POST(request) {
  return withAdminAuth(async () => {
    try {
      const data = await request.json();

      // Validações básicas
      if (!data.nome || !data.descricao || !data.ngoId || !data.dataInicio) {
        return Response.json(
          { error: 'Nome, descrição, ONG e data de início são obrigatórios' },
          { status: 400 }
        );
      }

      if (!data.morada) {
        return Response.json(
          { error: 'Morada é obrigatória' },
          { status: 400 }
        );
      }

      // Converter datas para Date objects
      if (typeof data.dataInicio === 'string') {
        data.dataInicio = new Date(data.dataInicio);
      }
      if (data.dataFim && typeof data.dataFim === 'string') {
        data.dataFim = new Date(data.dataFim);
      }

      // Definir valores padrão
      if (!data.tipo) {
        data.tipo = 'PRESENCIAL';
      }
      if (data.inscricoesAbertas === undefined) {
        data.inscricoesAbertas = true;
      }
      if (data.visivel === undefined) {
        data.visivel = true;
      }

      const event = await createEvent(data);

      return Response.json({
        success: true,
        data: event
      }, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return Response.json(
        { error: 'Erro ao criar evento: ' + error.message },
        { status: 500 }
      );
    }
  })(request);
}

