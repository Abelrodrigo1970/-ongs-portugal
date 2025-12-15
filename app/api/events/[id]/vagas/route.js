import { NextResponse } from 'next/server';
import { getVagasEvento } from '@/lib/repositories/inscricoes';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento é obrigatório' },
        { status: 400 }
      );
    }

    const vagas = await getVagasEvento(id);

    return NextResponse.json({
      success: true,
      data: vagas
    });

  } catch (error) {
    console.error('Error fetching vagas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vagas do evento' },
      { status: 500 }
    );
  }
}

