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
  console.log('🏢 Listando ONGs...\n');
  
  const ngos = await prisma.nGO.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  
  ngos.forEach(ong => {
    console.log(`ID: ${ong.id}`);
    console.log(`Nome: ${ong.nome}`);
    console.log(`Localização: ${ong.localizacao}`);
    console.log(`Imagem: ${ong.imagem || 'N/A'}`);
    console.log(`Logo: ${ong.logo || 'N/A'}`);
    console.log('---\n');
  });
  
  console.log(`Total: ${ngos.length} ONGs`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

