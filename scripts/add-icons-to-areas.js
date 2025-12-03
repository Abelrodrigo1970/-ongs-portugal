require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeamento de nomes de áreas para ícones
const iconMap = {
  'Ambiente': '/images/areas/ambiente.svg',
  'Conservação': '/images/areas/ambiente.svg',
  'Comunidade': '/images/areas/comunidade.svg',
  'Desenvolvimento comunitário': '/images/areas/comunidade.svg',
  'Cultura e património': '/images/areas/cultura.svg',
  'Cultura': '/images/areas/cultura.svg',
  'Desporto': '/images/areas/desporto.svg',
  'Educação': '/images/areas/educacao.svg',
  'Empregabilidade': '/images/areas/empregabilidade.svg',
  'Formação': '/images/areas/formacao.svg',
  'Inclusão social': '/images/areas/inclusao-social.svg',
  'Ação Social': '/images/areas/inclusao-social.svg',
  'Pobreza e exclusão': '/images/areas/inclusao-social.svg',
  'Direitos humanos': '/images/areas/inclusao-social.svg',
  'Igualdade de género': '/images/areas/inclusao-social.svg',
  'Reinserção': '/images/areas/reinsercao.svg',
  'Segurança alimentar': '/images/areas/seguranca-alimentar.svg',
  'Saúde': '/images/areas/educacao.svg', // Fallback
  'Proteção Animal': '/images/areas/ambiente.svg', // Fallback
  'Ornitologia': '/images/areas/ambiente.svg', // Fallback
  'Bem-estar animal': '/images/areas/ambiente.svg', // Fallback
};

// Função para encontrar ícone baseado no nome
function getIconForArea(nome) {
  // Buscar correspondência exata
  if (iconMap[nome]) {
    return iconMap[nome];
  }

  // Buscar correspondência parcial (case-insensitive)
  const nomeLower = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [key, icon] of Object.entries(iconMap)) {
    const keyLower = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (nomeLower.includes(keyLower) || keyLower.includes(nomeLower)) {
      return icon;
    }
  }

  // Fallback padrão
  return '/images/areas/comunidade.svg';
}

async function main() {
  console.log('🎨 Iniciando adição de ícones às áreas de atuação...\n');

  try {
    // Buscar todas as áreas
    const areas = await prisma.areaAtuacaoTipo.findMany({
      orderBy: { nome: 'asc' }
    });

    console.log(`📋 Encontradas ${areas.length} áreas de atuação\n`);

    let updated = 0;
    let skipped = 0;

    for (const area of areas) {
      // Se já tem ícone, pular
      if (area.icone) {
        console.log(`⏭️  "${area.nome}" já tem ícone: ${area.icone}`);
        skipped++;
        continue;
      }

      // Encontrar ícone apropriado
      const icon = getIconForArea(area.nome);

      // Atualizar área com o ícone
      await prisma.areaAtuacaoTipo.update({
        where: { id: area.id },
        data: { icone: icon }
      });

      console.log(`✅ "${area.nome}" → ${icon}`);
      updated++;
    }

    console.log(`\n✨ Concluído!`);
    console.log(`   - ${updated} áreas atualizadas`);
    console.log(`   - ${skipped} áreas já tinham ícone`);
    console.log(`   - Total: ${areas.length} áreas`);

  } catch (error) {
    console.error('❌ Erro ao adicionar ícones:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

