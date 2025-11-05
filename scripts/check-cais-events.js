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
  console.log('🔍 Verificando eventos da CAIS...\n');

  // Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' }
  });

  if (!cais) {
    console.log('❌ CAIS não encontrada');
    return;
  }

  console.log(`✅ CAIS ID: ${cais.id}\n`);

  // Buscar TODOS os eventos da CAIS
  const todosEventos = await prisma.event.findMany({
    where: { ngoId: cais.id },
    orderBy: { dataInicio: 'asc' }
  });

  console.log(`📊 Total de eventos encontrados: ${todosEventos.length}\n`);

  if (todosEventos.length === 0) {
    console.log('⚠️ Nenhum evento encontrado para a CAIS!');
    console.log('🔧 Vou criar os eventos agora...\n');
    
    // Criar eventos
    const eventos = [
      {
        nome: 'Doações de Cestas Básicas',
        descricao: 'Evento de distribuição de cestas básicas para famílias carenciadas, ajudando a garantir segurança alimentar durante períodos difíceis.',
        dataInicio: new Date('2024-12-20T10:00:00Z'),
        dataFim: new Date('2024-12-20T14:00:00Z'),
        localizacao: 'Rua da Ribeira Negra 55, 4050-321 Porto',
        latitude: 41.1579,
        longitude: -8.6291,
        tipo: 'PRESENCIAL',
        maxParticipantes: 60,
        inscricoesAbertas: true,
        imagem: '/images/events/event-cestas.png',
        ngoId: cais.id
      },
      {
        nome: 'Futebol de Rua - Evento de Convívio',
        descricao: 'Evento desportivo e de convívio que junta participantes do projecto "Futebol de Rua", comunidade e voluntários para promover inclusão e bem-estar.',
        dataInicio: new Date('2025-01-15T14:00:00Z'),
        dataFim: new Date('2025-01-15T18:00:00Z'),
        localizacao: 'Porto, Portugal',
        latitude: 41.1579,
        longitude: -8.6291,
        tipo: 'PRESENCIAL',
        maxParticipantes: 60,
        inscricoesAbertas: true,
        imagem: '/images/events/event-futebol.png',
        ngoId: cais.id
      },
      {
        nome: 'Convívio de Natal',
        descricao: 'Evento de convívio social que junta toda a comunidade CAIS, voluntários e participantes para celebrar o Natal em conjunto.',
        dataInicio: new Date('2024-12-21T16:00:00Z'),
        dataFim: new Date('2024-12-21T20:00:00Z'),
        localizacao: 'Porto, Portugal',
        latitude: 41.1579,
        longitude: -8.6291,
        tipo: 'PRESENCIAL',
        maxParticipantes: 100,
        inscricoesAbertas: true,
        imagem: '/images/events/event-convivio.png',
        ngoId: cais.id
      }
    ];

    for (const evento of eventos) {
      const created = await prisma.event.create({
        data: evento
      });
      console.log(`✅ Criado: ${created.nome}`);
    }
    
    console.log('\n✨ Eventos criados com sucesso!');
  } else {
    console.log('📅 Eventos encontrados:\n');
    todosEventos.forEach((evento, index) => {
      console.log(`${index + 1}. ${evento.nome}`);
      console.log(`   Data: ${evento.dataInicio.toLocaleDateString('pt-PT')}`);
      console.log(`   Localização: ${evento.localizacao}`);
      console.log(`   Visível: ${evento.visivel ? '✅' : '❌'}`);
      console.log(`   Inscrições: ${evento.inscricoesAbertas ? '✅ Abertas' : '❌ Fechadas'}`);
      console.log('');
    });
  }

  // Testar a query que a página usa
  console.log('🧪 Testando query da página (getEventsByNGO)...\n');
  
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

  console.log(`📊 Eventos futuros encontrados: ${eventosFuturos.length}\n`);
  
  if (eventosFuturos.length === 0) {
    console.log('⚠️ Nenhum evento futuro! As datas podem ter expirado.');
    console.log('💡 Dica: Atualize as datas dos eventos para o futuro.');
  } else {
    console.log('✅ Eventos que aparecerão na página:\n');
    eventosFuturos.forEach((evento, index) => {
      console.log(`${index + 1}. ${evento.nome}`);
      console.log(`   Data: ${evento.dataInicio.toLocaleDateString('pt-PT')} às ${evento.dataInicio.toLocaleTimeString('pt-PT')}`);
    });
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

