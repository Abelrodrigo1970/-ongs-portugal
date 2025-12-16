import { NextResponse } from 'next/server';
import { createInscricao, getInscricoes, checkInscricao } from '@/lib/repositories/inscricoes';

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Recebida requisição de inscrição:', {
      nomeColaborador: body.nomeColaborador,
      emailColaborador: body.emailColaborador,
      eventoId: body.eventoId,
      iniciativaId: body.iniciativaId
    });

    // Validate required fields
    if (!body.nomeColaborador || !body.emailColaborador) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar que temos pelo menos um evento ou iniciativa (não vazio)
    // Garantir que são strings antes de chamar trim()
    const eventoId = body.eventoId && typeof body.eventoId === 'string' && body.eventoId.trim() !== '' ? body.eventoId.trim() : null;
    const iniciativaId = body.iniciativaId && typeof body.iniciativaId === 'string' && body.iniciativaId.trim() !== '' ? body.iniciativaId.trim() : null;

    if (!eventoId && !iniciativaId) {
      return NextResponse.json(
        { error: 'Evento ou Iniciativa é obrigatório' },
        { status: 400 }
      );
    }

    // Check if already inscribed
    const existingInscricao = await checkInscricao(
      eventoId,
      iniciativaId,
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
    const inscricao = await createInscricao({
      ...body,
      eventoId: eventoId,
      iniciativaId: iniciativaId
    });

    return NextResponse.json({
      success: true,
      data: inscricao
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating inscription:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      meta: error.meta
    });
    
    // Retornar mensagem mais específica baseada no tipo de erro
    let errorMessage = 'Erro ao criar inscrição';
    let statusCode = 500;
    
    if (error.message) {
      if (error.message.includes('tabela') && error.message.includes('inscricoes')) {
        statusCode = 500;
        errorMessage = 'A tabela de inscrições não existe no banco de dados. Execute o script SQL no Supabase: scripts/add-unique-inscricao-constraint.sql';
      } else if (error.message.includes('inscricao') && error.message.includes('undefined')) {
        statusCode = 500;
        errorMessage = 'A tabela "inscricoes" não existe no banco de dados. Por favor, execute o script SQL no Supabase SQL Editor: scripts/add-unique-inscricao-constraint.sql';
      } else if (error.message.includes('obrigatório')) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message.includes('já está inscrito') || error.message.includes('Já existe')) {
        statusCode = 409;
        errorMessage = error.message;
      } else if (error.message.includes('não encontrado')) {
        statusCode = 404;
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: statusCode }
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
