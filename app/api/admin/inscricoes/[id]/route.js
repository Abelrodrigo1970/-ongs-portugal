import { withAdminAuth } from '@/lib/auth/adminAuth';
import { deleteInscricao, updateInscricaoStatus } from '@/lib/repositories/inscricoes';
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

export async function PATCH(request, { params }) {
  return withAdminAuth(async () => {
    try {
      const { id } = params;
      const body = await request.json();
      const { status } = body;

      if (!id) {
        return NextResponse.json(
          { error: 'ID da inscrição é obrigatório' },
          { status: 400 }
        );
      }

      if (!status) {
        return NextResponse.json(
          { error: 'Status é obrigatório' },
          { status: 400 }
        );
      }

      // Validar se o status é válido
      const validStatuses = ['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Status inválido. Deve ser um de: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }

      const inscricao = await updateInscricaoStatus(id, status);

      return NextResponse.json({
        success: true,
        data: inscricao,
        message: 'Status da inscrição atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar status da inscrição:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar status da inscrição', details: error.message },
        { status: 500 }
      );
    }
  })(request, { params });
}
