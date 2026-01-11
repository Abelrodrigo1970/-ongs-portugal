import { getPropostas } from '@/lib/repositories/propostas';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      empresaId: searchParams.get('empresaId') || null,
      ongId: searchParams.get('ongId') || null,
      status: searchParams.get('status') || null,
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 12
    };

    const result = await getPropostas(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/propostas:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
