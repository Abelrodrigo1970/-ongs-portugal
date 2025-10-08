import { getEmpresas } from '@/lib/repositories/empresas';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      query: searchParams.get('query') || '',
      ods: searchParams.get('ods') ? searchParams.get('ods').split(',').filter(id => id.trim() !== '') : [],
      causas: searchParams.get('causas') ? searchParams.get('causas').split(',').filter(id => id.trim() !== '') : [],
      tiposApoio: searchParams.get('tiposApoio') ? searchParams.get('tiposApoio').split(',').filter(id => id.trim() !== '') : [],
      localizacao: searchParams.get('local') || '',
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12
    };

    const result = await getEmpresas(filters);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/empresas:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
