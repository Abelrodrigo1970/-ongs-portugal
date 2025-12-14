import { withAdminAuth } from '@/lib/auth/adminAuth';
import { createEmpresa, getEmpresas } from '@/lib/repositories/empresas';

// GET - Listar todas as empresas (para admin)
export async function GET(request) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      
      const filters = {
        query: searchParams.get('query') || '',
        visivel: searchParams.get('visivel') === null ? undefined : searchParams.get('visivel') === 'true',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '200')
      };

      const result = await getEmpresas(filters);

      return Response.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      return Response.json(
        { error: 'Erro ao listar empresas' },
        { status: 500 }
      );
    }
  })(request);
}

// POST - Criar nova empresa
export async function POST(request) {
  return withAdminAuth(async () => {
    try {
      const data = await request.json();

      // Validações básicas
      if (!data.nome || !data.missao || !data.email) {
        return Response.json(
          { error: 'Nome, missão e email são obrigatórios' },
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

      // Definir valores padrão
      if (data.visivel === undefined) {
        data.visivel = true;
      }

      const empresa = await createEmpresa(data);

      return Response.json({
        success: true,
        data: empresa
      }, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      return Response.json(
        { error: 'Erro ao criar empresa: ' + error.message },
        { status: 500 }
      );
    }
  })(request);
}
