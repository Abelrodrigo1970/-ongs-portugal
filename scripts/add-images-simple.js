const { PrismaClient } = require('@prisma/client');

// Set DATABASE_URL if not present
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

const prisma = new PrismaClient();

async function main() {
  console.log('🎨 Adicionando imagens às ONGs...\n');

  // Imagem padrão para todas as ONGs
  const defaultImage = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop';

  try {
    // Atualizar todas as ONGs sem imagem com imagem padrão
    const result = await prisma.$executeRaw`
      UPDATE "NGO" 
      SET "imagem" = ${defaultImage}
      WHERE ("imagem" IS NULL OR "imagem" = '')
    `;

    console.log(`✅ ${result} ONGs atualizadas com imagem!`);
    console.log(`📸 Imagem: ${defaultImage}\n`);

    // Verificar total
    const total = await prisma.nGO.count({
      where: {
        imagem: {
          not: null
        }
      }
    });

    console.log(`📊 Total de ONGs com imagem: ${total}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

