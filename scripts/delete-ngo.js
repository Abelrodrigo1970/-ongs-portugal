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
  const ngoId = process.argv[2];

  if (!ngoId) {
    console.log('❌ Uso: node scripts/delete-ngo.js <ID_DA_ONG>');
    process.exit(1);
  }

  console.log('🔍 Procurando ONG...\n');

  // Buscar ONG
  const ngo = await prisma.nGO.findUnique({
    where: { id: ngoId },
    include: {
      eventos: true,
      ods: true,
      areaAtuacao: true,
      colaboracao: true
    }
  });

  if (!ngo) {
    console.log('❌ ONG não encontrada!');
    process.exit(1);
  }

  console.log('📋 Dados da ONG a ser deletada:');
  console.log(`   Nome: ${ngo.nome}`);
  console.log(`   ID: ${ngo.id}`);
  console.log(`   Email: ${ngo.email}`);
  console.log(`   Eventos: ${ngo.eventos.length}`);
  console.log(`   ODS: ${ngo.ods.length}`);
  console.log(`   Áreas: ${ngo.areaAtuacao.length}`);
  console.log(`   Colaborações: ${ngo.colaboracao.length}`);
  console.log('');

  console.log('🗑️ Deletando...\n');

  // Prisma cascade delete vai remover automaticamente:
  // - NGOODS
  // - AreaAtuacao
  // - Colaboracao
  // - Event (e EventODS, EventArea)

  await prisma.nGO.delete({
    where: { id: ngoId }
  });

  console.log('✅ ONG deletada com sucesso!');
  console.log('');
  console.log('📊 Foram removidos:');
  console.log(`   - 1 ONG`);
  console.log(`   - ${ngo.eventos.length} Eventos`);
  console.log(`   - ${ngo.ods.length} relações ODS`);
  console.log(`   - ${ngo.areaAtuacao.length} relações Áreas`);
  console.log(`   - ${ngo.colaboracao.length} relações Colaboração`);
  console.log('');
  console.log('✨ Banco de dados limpo!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao deletar:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

