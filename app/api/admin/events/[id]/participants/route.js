import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getInscricoes } from '@/lib/repositories/inscricoes';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;

      if (!id) {
        return NextResponse.json(
          { error: 'ID do evento é obrigatório' },
          { status: 400 }
        );
      }

      const inscricoes = await getInscricoes({ eventoId: id });

      return NextResponse.json({
        success: true,
        participants: inscricoes || []
      });
    } catch (error) {
      console.error('Erro ao buscar participantes do evento:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar participantes', details: error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}
