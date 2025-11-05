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
  console.log('🔧 Corrigindo eventos da CAIS...\n');

  // Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' },
    include: {
      eventos: true
    }
  });

  if (!cais) {
    console.log('❌ CAIS não encontrada');
    return;
  }

  console.log(`✅ CAIS encontrada: ${cais.id}`);
  console.log(`📊 Eventos atuais: ${cais.eventos.length}\n`);

  // Deletar eventos antigos se existirem
  if (cais.eventos.length > 0) {
    console.log('🗑️ Removendo eventos antigos...');
    await prisma.event.deleteMany({
      where: { ngoId: cais.id }
    });
    console.log('✅ Eventos antigos removidos\n');
  }

  console.log('📅 Criando novos eventos com datas futuras...\n');

  // Criar eventos com datas futuras
  const eventos = [
    {
      nome: 'Doações de Cestas Básicas',
      descricao: 'Evento de distribuição de cestas básicas para famílias carenciadas, ajudando a garantir segurança alimentar durante períodos difíceis.',
      dataInicio: new Date('2025-12-15T10:00:00Z'),
      dataFim: new Date('2025-12-15T14:00:00Z'),
      localizacao: 'Rua da Ribeira Negra 55, 4050-321 Porto',
      latitude: 41.1579,
      longitude: -8.6291,
      tipo: 'PRESENCIAL',
      maxParticipantes: 60,
      inscricoesAbertas: true,
      imagem: '/images/events/event-cestas.png',
      visivel: true,
      ngoId: cais.id
    },
    {
      nome: 'Convívio de Natal',
      descricao: 'Evento de convívio social que junta toda a comunidade CAIS, voluntários e participantes para celebrar o Natal em conjunto.',
      dataInicio: new Date('2025-12-20T16:00:00Z'),
      dataFim: new Date('2025-12-20T20:00:00Z'),
      localizacao: 'Porto, Portugal',
      latitude: 41.1579,
      longitude: -8.6291,
      tipo: 'PRESENCIAL',
      maxParticipantes: 100,
      inscricoesAbertas: true,
      imagem: '/images/events/event-convivio.png',
      visivel: true,
      ngoId: cais.id
    },
    {
      nome: 'Futebol de Rua - Evento de Convívio',
      descricao: 'Evento desportivo e de convívio que junta participantes do projecto "Futebol de Rua", comunidade e voluntários para promover inclusão e bem-estar.',
      dataInicio: new Date('2026-01-20T14:00:00Z'),
      dataFim: new Date('2026-01-20T18:00:00Z'),
      localizacao: 'Porto, Portugal',
      latitude: 41.1579,
      longitude: -8.6291,
      tipo: 'PRESENCIAL',
      maxParticipantes: 60,
      inscricoesAbertas: true,
      imagem: '/images/events/event-futebol.png',
      visivel: true,
      ngoId: cais.id
    }
  ];

  for (const evento of eventos) {
    const created = await prisma.event.create({
      data: evento
    });
    console.log(`✅ ${created.nome}`);
    console.log(`   📅 ${created.dataInicio.toLocaleDateString('pt-PT')} às ${created.dataInicio.toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'})}`);
    console.log('');
  }

  console.log('✨ Eventos criados com sucesso!\n');

  // Verificar
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
    }
  });

  console.log(`🎉 Total de eventos futuros: ${eventosFuturos.length}\n`);
  console.log('✅ URL da CAIS:');
  console.log(`   http://localhost:3000/ongs/${cais.id}`);
  console.log('\n🚀 Recarregue a página e verá os 3 eventos!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

