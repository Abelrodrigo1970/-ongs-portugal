import { getIniciativas } from '@/lib/repositories/iniciativas';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      empresaId: searchParams.get('empresaId') || null,
      causaId: searchParams.get('causaId') || null,
      tipoApoio: searchParams.get('tipoApoio') || null,
      status: searchParams.get('status') || null,
      dataInicio: searchParams.get('dataInicio') || null,
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12
    };

    const result = await getIniciativas(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/iniciativas:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
