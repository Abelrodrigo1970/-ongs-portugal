import { NextResponse } from 'next/server';
import { createInscricao, getInscricoes, checkInscricao } from '@/lib/repositories/inscricoes';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.nomeColaborador || !body.emailColaborador) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    if (!body.eventoId && !body.iniciativaId) {
      return NextResponse.json(
        { error: 'Evento ou Iniciativa é obrigatório' },
        { status: 400 }
      );
    }

    // Check if already inscribed
    const existingInscricao = await checkInscricao(
      body.eventoId || null,
      body.iniciativaId || null,
      body.emailColaborador
    );

    if (existingInscricao) {
      console.log('Inscrição duplicada detectada:', {
        email: body.emailColaborador,
        eventoId: body.eventoId,
        iniciativaId: body.iniciativaId,
        existingId: existingInscricao.id
      });
      return NextResponse.json(
        { error: 'Já está inscrito nesta oportunidade' },
        { status: 409 }
      );
    }

    // Create inscription
    const inscricao = await createInscricao(body);

    return NextResponse.json({
      success: true,
      data: inscricao
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating inscription:', error);
    return NextResponse.json(
      { error: 'Erro ao criar inscrição' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      eventoId: searchParams.get('eventoId'),
      iniciativaId: searchParams.get('iniciativaId'),
      emailColaborador: searchParams.get('emailColaborador'),
      status: searchParams.get('status')
    };

    // Remove null/undefined filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const inscricoes = await getInscricoes(filters);

    return NextResponse.json({
      success: true,
      data: inscricoes,
      total: inscricoes.length
    });

  } catch (error) {
    console.error('Error fetching inscricoes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar inscrições' },
      { status: 500 }
    );
  }
}
