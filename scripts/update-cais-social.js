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
  console.log('🔄 Atualizando redes sociais da CAIS...');

  // Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' }
  });

  if (!cais) {
    console.log('❌ CAIS não encontrada');
    return;
  }

  // Atualizar com redes sociais
  await prisma.nGO.update({
    where: { id: cais.id },
    data: {
      facebookUrl: 'https://facebook.com/cais',
      tiktokUrl: 'https://tiktok.com/@cais',
      linkedinUrl: 'https://linkedin.com/company/cais',
      instagramUrl: 'https://instagram.com/cais'
    }
  });

  console.log('✅ Redes sociais atualizadas com sucesso!');
  console.log('   - Facebook: https://facebook.com/cais');
  console.log('   - TikTok: https://tiktok.com/@cais');
  console.log('   - LinkedIn: https://linkedin.com/company/cais');
  console.log('   - Instagram: https://instagram.com/cais');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

