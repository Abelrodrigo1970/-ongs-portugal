import { getEvents } from '@/lib/repositories/events';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      query: searchParams.get('query') || '',
      ods: searchParams.get('ods') ? searchParams.get('ods').split(',').map(id => parseInt(id)) : [],
      areas: searchParams.get('areas') ? searchParams.get('areas').split(',').map(id => parseInt(id)) : [],
      tipo: searchParams.get('tipo') ? searchParams.get('tipo').split(',') : [],
      localizacao: searchParams.get('local') || '',
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 8
    };

    const result = await getEvents(filters);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/search/events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
