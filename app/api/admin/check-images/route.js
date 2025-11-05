import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Buscar todas as ONGs com seus campos de imagem
    const ngos = await prisma.nGO.findMany({
      select: {
        id: true,
        nome: true,
        imagem: true,
        logo: true
      },
      orderBy: {
        nome: 'asc'
      }
    });

    const summary = ngos.map(ngo => ({
      id: ngo.id,
      nome: ngo.nome,
      temImagem: !!ngo.imagem,
      imagem: ngo.imagem || 'SEM IMAGEM',
      tipoImagem: ngo.imagem 
        ? (ngo.imagem.startsWith('http') ? '🌐 URL Externa' : '📁 Arquivo Local')
        : '❌ Vazio'
    }));

    const stats = {
      total: ngos.length,
      comImagem: ngos.filter(n => n.imagem).length,
      semImagem: ngos.filter(n => !n.imagem).length,
      imagensExternas: ngos.filter(n => n.imagem?.startsWith('http')).length,
      imagensLocais: ngos.filter(n => n.imagem && !n.imagem.startsWith('http')).length
    };

    return NextResponse.json({
      success: true,
      stats,
      ngos: summary
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar imagens:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

