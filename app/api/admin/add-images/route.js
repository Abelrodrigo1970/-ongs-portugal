import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('🎨 Adicionando imagens às ONGs...\n');

    // Buscar todas as ONGs sem imagem
    const ngosWithoutImage = await prisma.nGO.findMany({
      where: {
        OR: [
          { imagem: null },
          { imagem: '' }
        ]
      },
      select: {
        id: true,
        nome: true,
        imagem: true,
        areaAtuacao: {
          include: {
            tipo: true
          }
        }
      }
    });

    console.log(`📊 Encontradas ${ngosWithoutImage.length} ONGs sem imagem\n`);

    if (ngosWithoutImage.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: '✅ Todas as ONGs já têm imagens!',
        updated: 0
      });
    }

    // Banco de imagens por categoria (Unsplash)
    const imagesByCategory = {
      'Ambiente': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Conservação': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'Saúde': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
      'Educação': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=entropy&auto=format',
      'Formação': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=entropy&auto=format',
      'Inclusão social': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
      'Sem Abrigo': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
      'Direitos Humanos': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&crop=entropy&auto=format',
      'Igualdade de Género': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      'Segurança Alimentar': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      'Cultura': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
      'Desenvolvimento Comunitário': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      'Ação Social': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
      'default': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop'
    };

    const updatedNGOs = [];

    // Atualizar cada ONG
    for (const ngo of ngosWithoutImage) {
      // Determinar categoria pela primeira área de atuação
      let imageUrl = imagesByCategory.default;
      
      if (ngo.areaAtuacao && ngo.areaAtuacao.length > 0) {
        const firstArea = ngo.areaAtuacao[0].tipo.nome;
        imageUrl = imagesByCategory[firstArea] || imagesByCategory.default;
      }

      // Atualizar ONG
      await prisma.nGO.update({
        where: { id: ngo.id },
        data: { imagem: imageUrl }
      });

      updatedNGOs.push({
        nome: ngo.nome,
        imagem: imageUrl
      });

      console.log(`✅ ${ngo.nome}`);
      console.log(`   📸 Imagem: ${imageUrl.substring(0, 60)}...`);
    }

    return NextResponse.json({ 
      success: true,
      message: `🎉 Sucesso! ${ngosWithoutImage.length} ONGs atualizadas com imagens!`,
      updated: ngosWithoutImage.length,
      ngos: updatedNGOs
    });

  } catch (error) {
    console.error('❌ Erro ao adicionar imagens:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

