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
  console.log('🔍 VERIFICAÇÃO COMPLETA DA CAIS\n');
  console.log('═══════════════════════════════════════\n');

  // 1. Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' }
  });

  if (!cais) {
    console.log('❌ ERRO: CAIS não encontrada na base de dados!');
    return;
  }

  console.log('✅ CAIS ENCONTRADA');
  console.log(`   ID: ${cais.id}\n`);

  // 2. Verificar Eventos
  console.log('📅 VERIFICANDO EVENTOS...');
  const eventos = await prisma.event.findMany({
    where: { 
      ngoId: cais.id,
      visivel: true,
      dataInicio: { gte: new Date() }
    },
    orderBy: { dataInicio: 'asc' }
  });

  if (eventos.length === 0) {
    console.log('   ❌ Nenhum evento futuro encontrado!');
  } else {
    console.log(`   ✅ ${eventos.length} eventos futuros`);
    eventos.forEach((e, i) => {
      console.log(`   ${i+1}. ${e.nome}`);
      console.log(`      📅 ${e.dataInicio.toLocaleDateString('pt-PT')}`);
    });
  }
  console.log('');

  // 3. Verificar ODS
  console.log('🌍 VERIFICANDO ODS...');
  const ods = await prisma.nGOODS.findMany({
    where: { ngoId: cais.id },
    include: { ods: true }
  });
  console.log(`   ${ods.length > 0 ? '✅' : '❌'} ${ods.length} ODS relacionados\n`);

  // 4. Verificar Áreas
  console.log('🎯 VERIFICANDO ÁREAS DE ATUAÇÃO...');
  const areas = await prisma.areaAtuacao.findMany({
    where: { ngoId: cais.id },
    include: { tipo: true }
  });
  console.log(`   ${areas.length > 0 ? '✅' : '❌'} ${areas.length} áreas\n`);

  // 5. Verificar Colaborações
  console.log('🤝 VERIFICANDO TIPOS DE COLABORAÇÃO...');
  const colaboracoes = await prisma.colaboracao.findMany({
    where: { ngoId: cais.id },
    include: { tipo: true }
  });
  console.log(`   ${colaboracoes.length > 0 ? '✅' : '❌'} ${colaboracoes.length} tipos\n`);

  // 6. Resumo
  console.log('═══════════════════════════════════════');
  console.log('📊 RESUMO FINAL:\n');
  
  const problemas = [];
  if (!cais.logo) problemas.push('Logo ausente');
  if (!cais.imagem) problemas.push('Imagem ausente');
  if (eventos.length === 0) problemas.push('Sem eventos futuros');
  if (ods.length === 0) problemas.push('Sem ODS');
  if (areas.length === 0) problemas.push('Sem áreas');
  if (colaboracoes.length === 0) problemas.push('Sem colaborações');

  if (problemas.length === 0) {
    console.log('✅ TUDO PERFEITO!');
    console.log('   A CAIS está 100% completa.\n');
    console.log('🌐 Teste em:');
    console.log(`   http://localhost:3000/ongs/${cais.id}\n`);
  } else {
    console.log('⚠️ PROBLEMAS ENCONTRADOS:');
    problemas.forEach(p => console.log(`   - ${p}`));
    console.log('');
  }

  console.log('═══════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ ERRO NO SCRIPT:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

