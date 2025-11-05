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
  console.log('📅 Atualizando datas dos eventos para o futuro...\n');

  // Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' }
  });

  if (!cais) {
    console.log('❌ CAIS não encontrada');
    return;
  }

  // Buscar eventos da CAIS
  const eventos = await prisma.event.findMany({
    where: { ngoId: cais.id }
  });

  console.log(`📊 Encontrados ${eventos.length} eventos\n`);

  // Atualizar datas para 2025
  for (const evento of eventos) {
    let novaData;
    let novaDataFim;

    if (evento.nome.includes('Cestas')) {
      // 15 de Dezembro de 2025
      novaData = new Date('2025-12-15T10:00:00Z');
      novaDataFim = new Date('2025-12-15T14:00:00Z');
    } else if (evento.nome.includes('Futebol')) {
      // 20 de Janeiro de 2026
      novaData = new Date('2026-01-20T14:00:00Z');
      novaDataFim = new Date('2026-01-20T18:00:00Z');
    } else if (evento.nome.includes('Natal')) {
      // 20 de Dezembro de 2025
      novaData = new Date('2025-12-20T16:00:00Z');
      novaDataFim = new Date('2025-12-20T20:00:00Z');
    }

    if (novaData) {
      await prisma.event.update({
        where: { id: evento.id },
        data: {
          dataInicio: novaData,
          dataFim: novaDataFim
        }
      });

      console.log(`✅ ${evento.nome}`);
      console.log(`   Nova data: ${novaData.toLocaleDateString('pt-PT')} às ${novaData.toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'})}`);
      console.log('');
    }
  }

  console.log('✨ Datas atualizadas com sucesso!\n');

  // Verificar se agora aparecem
  const eventosFuturos = await prisma.event.findMany({
    where: {
      ngoId: cais.id,
      visivel: true,
      dataInicio: {
        gte: new Date()
      }
    },
    orderBy: {
      dataInicio: 'asc'
    },
    take: 3
  });

  console.log(`🎉 Eventos futuros agora: ${eventosFuturos.length}`);
  console.log('\n📋 Estes eventos aparecerão na página:\n');
  
  eventosFuturos.forEach((evento, index) => {
    console.log(`${index + 1}. ${evento.nome}`);
    console.log(`   📅 ${evento.dataInicio.toLocaleDateString('pt-PT')} às ${evento.dataInicio.toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'})}`);
    console.log(`   📍 ${evento.localizacao}`);
    console.log('');
  });

  console.log('✅ Tudo pronto! Recarregue a página no navegador.');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

