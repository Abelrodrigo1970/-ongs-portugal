const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Load .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  let envFile;
  try {
    envFile = fs.readFileSync(envPath, 'utf16le');
  } catch (e) {
    envFile = fs.readFileSync(envPath, 'utf8');
  }
  
  envFile = envFile.replace(/\u0000/g, '');
  envFile = envFile.replace(/^\ufeff/, '');
  
  envFile.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=:#\s]+)\s*=\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Atualizando áreas da CAIS...');

  // Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' },
    include: { areaAtuacao: true }
  });

  if (!cais) {
    console.log('❌ CAIS não encontrada!');
    return;
  }

  console.log(`✅ CAIS encontrada: ${cais.id}`);
  console.log(`📋 Áreas atuais: ${cais.areaAtuacao.length}`);

  // Remover áreas atuais
  await prisma.areaAtuacao.deleteMany({
    where: { ngoId: cais.id }
  });

  console.log('🗑️  Áreas antigas removidas');

  // Criar as 8 áreas conforme o Figma
  const areasDoFigma = [
    'Inclusão social',
    'Empregabilidade',
    'Formação',
    'Desporto',
    'Cultura',
    'Comunidade',
    'Reinserção',
    'Educação'
  ];

  // Criar ou buscar cada área
  for (const areaNome of areasDoFigma) {
    const areaTipo = await prisma.areaAtuacaoTipo.upsert({
      where: { nome: areaNome },
      update: {},
      create: { nome: areaNome }
    });

    await prisma.areaAtuacao.create({
      data: {
        ngoId: cais.id,
        areaAtuacaoTipoId: areaTipo.id
      }
    });

    console.log(`  ✅ ${areaNome}`);
  }

  console.log('\n✨ Áreas da CAIS atualizadas com sucesso!');
  console.log(`📊 Total: ${areasDoFigma.length} áreas`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

