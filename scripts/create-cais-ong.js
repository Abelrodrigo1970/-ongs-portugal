const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Load .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  let envFile;
  // Try UTF-16LE first (Windows)
  try {
    envFile = fs.readFileSync(envPath, 'utf16le');
  } catch (e) {
    // If UTF-16LE fails, try UTF-8
    envFile = fs.readFileSync(envPath, 'utf8');
  }
  
  // Remove null bytes and BOM from UTF-16
  envFile = envFile.replace(/\u0000/g, '');
  envFile = envFile.replace(/^\ufeff/, ''); // Remove BOM
  
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
  console.log('🏢 Criando ONG CAIS...');

  // Buscar referências necessárias
  const ods1 = await prisma.oDS.findUnique({ where: { numero: 1 } }); // Pobreza
  const ods8 = await prisma.oDS.findUnique({ where: { numero: 8 } }); // Trabalho
  const ods10 = await prisma.oDS.findUnique({ where: { numero: 10 } }); // Desigualdades
  
  // Buscar colaborações
  const voluntariadoPresencial = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Voluntariado presencial' } });
  const recursos = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Donativos em espécie' } });
  const mentoria = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Mentoria' } });

  // Buscar áreas de atuação
  const semAbrigo = await prisma.areaAtuacaoTipo.upsert({
    where: { nome: 'Sem Abrigo' },
    update: {},
    create: { nome: 'Sem Abrigo' }
  });
  
  const inclusaoSocial = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Inclusão social' } });
  const empregabilidade = await prisma.areaAtuacaoTipo.upsert({
    where: { nome: 'Empregabilidade' },
    update: {},
    create: { nome: 'Empregabilidade' }
  });
  const comunidade = await prisma.areaAtuacaoTipo.upsert({
    where: { nome: 'Comunidade' },
    update: {},
    create: { nome: 'Comunidade' }
  });
  const mentoria_area = await prisma.areaAtuacaoTipo.upsert({
    where: { nome: 'Mentoria' },
    update: {},
    create: { nome: 'Mentoria' }
  });
  const capacitacao = await prisma.areaAtuacaoTipo.upsert({
    where: { nome: 'Capacitação' },
    update: {},
    create: { nome: 'Capacitação' }
  });

  // Criar ONG CAIS
  const cais = await prisma.nGO.create({
    data: {
      nome: 'Associação CAIS',
      descricao: 'A CAIS trabalha há mais de 30 anos para criar oportunidades e promover a inclusão social e profissional de pessoas em situação de vulnerabilidade. Através dos nossos projetos, ajudamos a reconstruir trajetórias de vida e a devolver dignidade e autonomia a quem mais precisa.',
      missao: 'Transformamos vidas, todos os dias.',
      email: 'cais@cais.pt',
      telefone: '222 071 320',
      localizacao: 'Porto, Portugal',
      latitude: 41.1579,
      longitude: -8.6291,
      impacto: JSON.stringify([
        '85% da população sem-abrigo',
        'Acompanhamento a centenas de pessoas',
        'Promoção da (re)integração no mercado de trabalho'
      ]),
      imagem: '/images/ongs/hero-cais-70a430.png',
      logo: '/images/logo-cais-44eb9c.svg',
      websiteUrl: 'https://cais.pt',
      instagramUrl: 'https://instagram.com/cais',
      facebookUrl: 'https://facebook.com/cais',
      tiktokUrl: 'https://tiktok.com/@cais',
      linkedinUrl: 'https://linkedin.com/company/cais',
      ods: {
        create: [
          { odsId: ods1.id },
          { odsId: ods8.id },
          { odsId: ods10.id }
        ]
      },
      colaboracao: {
        create: [
          { colaboracaoTipoId: voluntariadoPresencial.id },
          { colaboracaoTipoId: recursos.id },
          { colaboracaoTipoId: mentoria.id }
        ]
      },
      areaAtuacao: {
        create: [
          { areaAtuacaoTipoId: semAbrigo.id },
          { areaAtuacaoTipoId: inclusaoSocial.id },
          { areaAtuacaoTipoId: empregabilidade.id },
          { areaAtuacaoTipoId: comunidade.id },
          { areaAtuacaoTipoId: mentoria_area.id },
          { areaAtuacaoTipoId: capacitacao.id }
        ]
      }
    }
  });

  console.log(`✅ ONG CAIS criada com ID: ${cais.id}`);

  // Criar eventos para a CAIS
  const allAreas = await prisma.areaAtuacaoTipo.findMany();
  const formacao = allAreas.find(a => a.nome === 'Formação');
  const desporto = allAreas.find(a => a.nome === 'Desporto');
  const cultura = allAreas.find(a => a.nome === 'Cultura');
  const reinsercao = allAreas.find(a => a.nome === 'Reinserção');
  const segurancaAlimentar = allAreas.find(a => a.nome === 'Segurança alimentar');

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
      ngoId: cais.id,
      areaIds: [segurancaAlimentar?.id].filter(Boolean)
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
      ngoId: cais.id,
      areaIds: [desporto?.id, comunidade?.id, inclusaoSocial?.id].filter(Boolean)
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
      ngoId: cais.id,
      areaIds: [comunidade?.id, inclusaoSocial?.id].filter(Boolean)
    }
  ];

  for (const eventoData of eventos) {
    const evento = await prisma.event.create({
      data: {
        nome: eventoData.nome,
        descricao: eventoData.descricao,
        dataInicio: eventoData.dataInicio,
        dataFim: eventoData.dataFim,
        localizacao: eventoData.localizacao,
        latitude: eventoData.latitude,
        longitude: eventoData.longitude,
        tipo: eventoData.tipo,
        maxParticipantes: eventoData.maxParticipantes,
        inscricoesAbertas: eventoData.inscricoesAbertas,
        imagem: eventoData.imagem,
        ngoId: eventoData.ngoId
      }
    });

    // Associar áreas aos eventos
    for (const areaId of eventoData.areaIds) {
      await prisma.eventArea.create({
        data: {
          eventId: evento.id,
          areaAtuacaoTipoId: areaId
        }
      });
    }

    console.log(`✅ Evento "${evento.nome}" criado com ID: ${evento.id}`);
  }

  console.log('✅ ONG CAIS e eventos criados com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar ONG CAIS:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

