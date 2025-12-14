import { withAdminAuth } from '@/lib/auth/adminAuth';
import { createColaborador, getColaboradores } from '@/lib/repositories/colaboradores';

// GET - Listar todos os colaboradores
export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = {
        query: searchParams.get('query') || '',
        empresaId: searchParams.get('empresaId') || null,
        ativo: searchParams.get('ativo') === null ? null : searchParams.get('ativo') === 'true',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '50')
      };

      const result = await getColaboradores(filters);

      return Response.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Erro ao listar colaboradores:', error);
      return Response.json(
        { error: 'Erro ao listar colaboradores' },
        { status: 500 }
      );
    }
  })(request);
}

// POST - Criar novo colaborador
export async function POST(request) {
  return withAdminAuth(async () => {
    try {
      const data = await request.json();

      // Validações básicas
      if (!data.nome || !data.email || !data.empresaId) {
        return Response.json(
          { error: 'Nome, email e empresa são obrigatórios' },
          { status: 400 }
        );
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return Response.json(
          { error: 'Email inválido' },
          { status: 400 }
        );
      }

      const colaborador = await createColaborador(data);

      return Response.json({
        success: true,
        data: colaborador
      }, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      return Response.json(
        { error: 'Erro ao criar colaborador: ' + error.message },
        { status: 500 }
      );
    }
  })(request);
}

