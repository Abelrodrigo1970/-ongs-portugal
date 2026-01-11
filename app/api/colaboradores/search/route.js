import { NextResponse } from 'next/server';
import { getColaboradores } from '@/lib/repositories/colaboradores';

export const dynamic = 'force-dynamic';

/**
 * API pública para buscar colaboradores (para adicionar a eventos)
 * Não requer autenticação admin
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      query: searchParams.get('query') || '',
      empresaId: searchParams.get('empresaId') || null,
      ativo: true, // Apenas colaboradores ativos
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50')
    };

    const result = await getColaboradores(filters);

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar colaboradores' },
      { status: 500 }
    );
  }
}

