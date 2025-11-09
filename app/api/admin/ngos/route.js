import { withAdminAuth } from '@/lib/auth/adminAuth';
import { createNGO, getNGOs } from '@/lib/repositories/ngos';

// GET - Listar todas as ONGs (com filtros opcionais)
export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = {
        query: searchParams.get('query') || '',
        visivel: searchParams.get('visivel') === null ? undefined : searchParams.get('visivel') === 'true',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '50')
      };

      const result = await getNGOs(filters);

      return Response.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Erro ao listar ONGs:', error);
      return Response.json(
        { error: 'Erro ao listar ONGs' },
        { status: 500 }
      );
    }
  })(request);
}

// POST - Criar nova ONG
export async function POST(request) {
  return withAdminAuth(async () => {
    try {
      const data = await request.json();

      // Validações básicas
      if (!data.nome || !data.descricao || !data.missao) {
        return Response.json(
          { error: 'Nome, descrição e missão são obrigatórios' },
          { status: 400 }
        );
      }

      if (!data.email || !data.telefone || !data.localizacao) {
        return Response.json(
          { error: 'Email, telefone e localização são obrigatórios' },
          { status: 400 }
        );
      }

      // Garantir que impacto seja uma string JSON se for array
      if (Array.isArray(data.impacto)) {
        data.impacto = JSON.stringify(data.impacto);
      } else if (!data.impacto) {
        data.impacto = JSON.stringify([]);
      }

      const result = await createNGO(data);

      if (!result.success) {
        return Response.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        data: result.data
      }, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar ONG:', error);
      return Response.json(
        { error: 'Erro ao criar ONG' },
        { status: 500 }
      );
    }
  })(request);
}

