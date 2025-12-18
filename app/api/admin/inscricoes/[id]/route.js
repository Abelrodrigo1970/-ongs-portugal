import { withAdminAuth } from '@/lib/auth/adminAuth';
import { deleteInscricao } from '@/lib/repositories/inscricoes';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;

      if (!id) {
        return NextResponse.json(
          { error: 'ID da inscrição é obrigatório' },
          { status: 400 }
        );
      }

      await deleteInscricao(id);

      return NextResponse.json({
        success: true,
        message: 'Inscrição removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar inscrição', details: error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}
