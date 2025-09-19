const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.eventODS.deleteMany();
  await prisma.eventArea.deleteMany();
  await prisma.event.deleteMany();
  await prisma.nGOODS.deleteMany();
  await prisma.colaboracao.deleteMany();
  await prisma.areaAtuacao.deleteMany();
  await prisma.nGO.deleteMany();
  await prisma.colaboracaoTipo.deleteMany();
  await prisma.areaAtuacaoTipo.deleteMany();
  await prisma.oDS.deleteMany();

  // 1. Seed ODS 1-17
  console.log('📋 Criando ODS...');
  const odsData = [
    { numero: 1, nome: 'Erradicar a pobreza', descricao: 'Acabar com a pobreza em todas as suas formas, em todos os lugares' },
    { numero: 2, nome: 'Erradicar a fome', descricao: 'Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição e promover a agricultura sustentável' },
    { numero: 3, nome: 'Saúde de qualidade', descricao: 'Assegurar uma vida saudável e promover o bem-estar para todos, em todas as idades' },
    { numero: 4, nome: 'Educação de qualidade', descricao: 'Assegurar a educação inclusiva e equitativa e de qualidade, e promover oportunidades de aprendizagem ao longo da vida para todos' },
    { numero: 5, nome: 'Igualdade de Género', descricao: 'Alcançar a igualdade de género e empoderar todas as mulheres e raparigas' },
    { numero: 6, nome: 'Água Potável e Saneamento', descricao: 'Assegurar a disponibilidade e gestão sustentável da água e saneamento para todos' },
    { numero: 7, nome: 'Energias Renováveis e Acessíveis', descricao: 'Assegurar o acesso confiável, sustentável, moderno e a preço acessível à energia para todos' },
    { numero: 8, nome: 'Trabalho Digno e Crescimento Económico', descricao: 'Promover o crescimento económico sustentado, inclusivo e sustentável, emprego pleno e produtivo e trabalho digno para todos' },
    { numero: 9, nome: 'Indústria, Inovação e Infraestruturas', descricao: 'Construir infraestruturas resilientes, promover a industrialização inclusiva e sustentável e fomentar a inovação' },
    { numero: 10, nome: 'Redução das Desigualdades', descricao: 'Reduzir a desigualdade dentro dos países e entre países' },
    { numero: 11, nome: 'Cidades e Comunidades Sustentáveis', descricao: 'Tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis' },
    { numero: 12, nome: 'Consumo e Produção Sustentáveis', descricao: 'Assegurar padrões de consumo e de produção sustentáveis' },
    { numero: 13, nome: 'Ação Climática', descricao: 'Tomar medidas urgentes para combater a mudança climática e os seus impactos' },
    { numero: 14, nome: 'Proteger a Vida Marinha', descricao: 'Conservar e usar sustentavelmente os oceanos, mares e recursos marinhos para o desenvolvimento sustentável' },
    { numero: 15, nome: 'Proteger a Vida Terrestre', descricao: 'Proteger, restaurar e promover o uso sustentável dos ecossistemas terrestres, gerir de forma sustentável as florestas, combater a desertificação, deter e reverter a degradação dos solos e travar a perda de biodiversidade' },
    { numero: 16, nome: 'Paz, Justiça e Instituições Eficazes', descricao: 'Promover sociedades pacíficas e inclusivas para o desenvolvimento sustentável, proporcionar o acesso à justiça para todos e construir instituições eficazes, responsáveis e inclusivas em todos os níveis' },
    { numero: 17, nome: 'Parcerias para a Implementação dos Objetivos', descricao: 'Fortalecer os meios de implementação e revitalizar a parceria global para o desenvolvimento sustentável' }
  ];

  for (const ods of odsData) {
    await prisma.oDS.create({
      data: {
        ...ods,
        icone: `/ods/ods-${ods.numero}.svg`
      }
    });
  }

  // 2. Seed Tipos de Colaboração
  console.log('🤝 Criando tipos de colaboração...');
  const colaboracaoTipos = [
    'Parcerias de longo prazo',
    'Palestras e sensibilização',
    'Pro bono profissional',
    'Donativos em espécie',
    'Doações financeiras',
    'Mentoria',
    'Voluntariado remoto',
    'Voluntariado presencial'
  ];

  for (const tipo of colaboracaoTipos) {
    await prisma.colaboracaoTipo.create({
      data: { nome: tipo }
    });
  }

  // 3. Seed Áreas de Atuação
  console.log('🎯 Criando áreas de atuação...');
  const areasAtuacao = [
    'Ação Social',
    'Proteção Animal',
    'Ornitologia',
    'Conservação',
    'Segurança alimentar',
    'Bem-estar animal',
    'Cultura e património',
    'Desenvolvimento comunitário',
    'Pobreza e exclusão',
    'Direitos humanos',
    'Inclusão social',
    'Igualdade de género',
    'Ambiente',
    'Saúde',
    'Educação'
  ];

  for (const area of areasAtuacao) {
    await prisma.areaAtuacaoTipo.create({
      data: { nome: area }
    });
  }

  // 4. Seed ONGs
  console.log('🏢 Criando ONGs...');
  
  // Buscar referências
  const ods1 = await prisma.oDS.findUnique({ where: { numero: 1 } });
  const ods2 = await prisma.oDS.findUnique({ where: { numero: 2 } });
  const ods3 = await prisma.oDS.findUnique({ where: { numero: 3 } });
  const ods4 = await prisma.oDS.findUnique({ where: { numero: 4 } });
  const ods5 = await prisma.oDS.findUnique({ where: { numero: 5 } });
  const ods6 = await prisma.oDS.findUnique({ where: { numero: 6 } });
  const ods7 = await prisma.oDS.findUnique({ where: { numero: 7 } });
  const ods8 = await prisma.oDS.findUnique({ where: { numero: 8 } });
  const ods10 = await prisma.oDS.findUnique({ where: { numero: 10 } });
  const ods11 = await prisma.oDS.findUnique({ where: { numero: 11 } });
  const ods12 = await prisma.oDS.findUnique({ where: { numero: 12 } });
  const ods13 = await prisma.oDS.findUnique({ where: { numero: 13 } });
  const ods14 = await prisma.oDS.findUnique({ where: { numero: 14 } });
  const ods15 = await prisma.oDS.findUnique({ where: { numero: 15 } });
  const ods16 = await prisma.oDS.findUnique({ where: { numero: 16 } });

  // Buscar tipos
  const parcerias = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Parcerias de longo prazo' } });
  const palestras = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Palestras e sensibilização' } });
  const probono = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Pro bono profissional' } });
  const donativos = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Donativos em espécie' } });
  const doacoes = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Doações financeiras' } });
  const mentoria = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Mentoria' } });
  const voluntariadoRemoto = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Voluntariado remoto' } });
  const voluntariadoPresencial = await prisma.colaboracaoTipo.findUnique({ where: { nome: 'Voluntariado presencial' } });

  // Buscar áreas
  const acaoSocial = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Ação Social' } });
  const protecaoAnimal = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Proteção Animal' } });
  const ornitologia = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Ornitologia' } });
  const conservacao = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Conservação' } });
  const segurancaAlimentar = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Segurança alimentar' } });
  const bemEstarAnimal = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Bem-estar animal' } });
  const culturaPatrimonio = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Cultura e património' } });
  const desenvolvimentoComunitario = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Desenvolvimento comunitário' } });
  const pobrezaExclusao = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Pobreza e exclusão' } });
  const direitosHumanos = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Direitos humanos' } });
  const inclusaoSocial = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Inclusão social' } });
  const igualdadeGenero = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Igualdade de género' } });
  const ambiente = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Ambiente' } });
  const saude = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Saúde' } });
  const educacao = await prisma.areaAtuacaoTipo.findUnique({ where: { nome: 'Educação' } });

  const ongsData = [
    {
      nome: 'EcoMundo',
      descricao: 'Organização dedicada à conservação marinha e proteção dos oceanos através de ações diretas e sensibilização comunitária.',
      missao: 'Proteger os ecossistemas marinhos e promover práticas sustentáveis para garantir um futuro saudável para os nossos oceanos.',
      email: 'contato@ecomundo.pt',
      telefone: '+351 21 123 4567',
      localizacao: 'Lisboa, Portugal',
      latitude: 38.7223,
      longitude: -9.1393,
      impacto: JSON.stringify([
        'Proteção de 500 hectares de área marinha',
        'Sensibilização de 10.000 pessoas sobre conservação oceânica',
        'Criação de 3 santuários marinhos'
      ]),
      ods: [ods14, ods13, ods15],
      colaboracao: [parcerias, palestras, voluntariadoPresencial],
      areaAtuacao: [conservacao, ambiente],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/ecomundo',
      videoUrl: 'https://youtube.com/watch?v=ecomundo',
      websiteUrl: 'https://ecomundo.pt'
    },
    {
      nome: 'Saúde para Todos',
      descricao: 'ONG focada em garantir acesso à saúde básica para comunidades carenciadas, com especial atenção à saúde materno-infantil.',
      missao: 'Democratizar o acesso à saúde de qualidade, especialmente nas áreas mais vulneráveis do país.',
      email: 'info@saudeparatodos.pt',
      telefone: '+351 22 987 6543',
      localizacao: 'Porto, Portugal',
      latitude: 41.1579,
      longitude: -8.6291,
      impacto: JSON.stringify([
        'Atendimento médico a 5.000 pessoas carenciadas',
        'Programa de saúde materno-infantil em 15 comunidades',
        'Distribuição de medicamentos essenciais'
      ]),
      ods: [ods3, ods1, ods10],
      colaboracao: [doacoes, voluntariadoPresencial, probono],
      areaAtuacao: [saude, acaoSocial, pobrezaExclusao],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/saudeparatodos',
      websiteUrl: 'https://saudeparatodos.pt'
    },
    {
      nome: 'Educar Futuro',
      descricao: 'Organização que promove educação inclusiva e de qualidade, com foco em comunidades rurais e crianças em situação de vulnerabilidade.',
      missao: 'Garantir que todas as crianças tenham acesso a uma educação de qualidade, independentemente da sua condição social ou geográfica.',
      email: 'contato@educarfuturo.pt',
      telefone: '+351 23 555 7890',
      localizacao: 'Coimbra, Portugal',
      latitude: 40.2033,
      longitude: -8.4103,
      impacto: JSON.stringify([
        'Construção de 8 escolas rurais',
        'Formação de 200 professores',
        'Apoio educativo a 1.500 crianças'
      ]),
      ods: [ods4, ods1, ods10],
      colaboracao: [doacoes, mentoria, voluntariadoRemoto, voluntariadoPresencial],
      areaAtuacao: [educacao, acaoSocial, desenvolvimentoComunitario],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/educarfuturo',
      videoUrl: 'https://youtube.com/watch?v=educarfuturo',
      websiteUrl: 'https://educarfuturo.pt'
    },
    {
      nome: 'VerdeVivo',
      descricao: 'ONG dedicada à conservação da biodiversidade terrestre e promoção de práticas agrícolas sustentáveis.',
      missao: 'Proteger e restaurar os ecossistemas terrestres, promovendo a biodiversidade e práticas sustentáveis.',
      email: 'info@verdevivo.pt',
      telefone: '+351 24 777 1234',
      localizacao: 'Évora, Portugal',
      latitude: 38.5665,
      longitude: -7.9077,
      impacto: JSON.stringify([
        'Reflorestação de 1.000 hectares',
        'Proteção de 50 espécies ameaçadas',
        'Formação de 500 agricultores em práticas sustentáveis'
      ]),
      ods: [ods15, ods13, ods12],
      colaboracao: [parcerias, voluntariadoPresencial, donativos],
      areaAtuacao: [conservacao, ambiente, segurancaAlimentar],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/verdevivo',
      websiteUrl: 'https://verdevivo.pt'
    },
    {
      nome: 'Direitos Já',
      descricao: 'Organização de defesa dos direitos humanos, com foco na igualdade de género e inclusão social.',
      missao: 'Promover e defender os direitos humanos, combatendo todas as formas de discriminação e desigualdade.',
      email: 'contato@direitosja.pt',
      telefone: '+351 21 333 8888',
      localizacao: 'Lisboa, Portugal',
      latitude: 38.7223,
      longitude: -9.1393,
      impacto: JSON.stringify([
        'Apoio jurídico a 300 vítimas de discriminação',
        'Campanhas de sensibilização com 50.000 participantes',
        'Formação de 100 ativistas em direitos humanos'
      ]),
      ods: [ods5, ods10, ods16],
      colaboracao: [probono, palestras, mentoria],
      areaAtuacao: [direitosHumanos, igualdadeGenero, inclusaoSocial],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/direitosja',
      websiteUrl: 'https://direitosja.pt'
    },
    {
      nome: 'Alimenta Esperança',
      descricao: 'ONG focada no combate à fome e promoção da segurança alimentar através de programas de distribuição e educação nutricional.',
      missao: 'Eliminar a fome e garantir segurança alimentar para todas as pessoas, promovendo uma alimentação saudável e sustentável.',
      email: 'info@alimentaesperanca.pt',
      telefone: '+351 22 444 9999',
      localizacao: 'Braga, Portugal',
      latitude: 41.5518,
      longitude: -8.4229,
      impacto: JSON.stringify([
        'Distribuição de 100.000 refeições',
        'Programas de educação nutricional para 2.000 famílias',
        'Criação de 20 hortas comunitárias'
      ]),
      ods: [ods2, ods1, ods12],
      colaboracao: [doacoes, donativos, voluntariadoPresencial],
      areaAtuacao: [segurancaAlimentar, acaoSocial, desenvolvimentoComunitario],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/alimentaesperanca',
      websiteUrl: 'https://alimentaesperanca.pt'
    },
    {
      nome: 'Cultura Acessível',
      descricao: 'Organização que promove o acesso à cultura e património para pessoas com deficiência e comunidades marginalizadas.',
      missao: 'Democratizar o acesso à cultura e património, garantindo que todos possam participar ativamente da vida cultural.',
      email: 'contato@culturaacessivel.pt',
      telefone: '+351 23 666 7777',
      localizacao: 'Guimarães, Portugal',
      latitude: 41.4419,
      longitude: -8.2957,
      impacto: JSON.stringify([
        'Adaptação de 15 espaços culturais para acessibilidade',
        'Programas culturais para 1.000 pessoas com deficiência',
        'Formação de 200 profissionais em acessibilidade cultural'
      ]),
      ods: [ods10, ods11, ods16],
      colaboracao: [parcerias, palestras, voluntariadoPresencial],
      areaAtuacao: [culturaPatrimonio, inclusaoSocial, desenvolvimentoComunitario],
      imagem: '/images/placeholder.svg',
      logo: '/images/placeholder.svg',
      instagramUrl: 'https://instagram.com/culturaacessivel',
      videoUrl: 'https://youtube.com/watch?v=culturaacessivel',
      websiteUrl: 'https://culturaacessivel.pt'
    }
  ];

  for (const ongData of ongsData) {
    const ong = await prisma.nGO.create({
      data: {
        nome: ongData.nome,
        descricao: ongData.descricao,
        missao: ongData.missao,
        email: ongData.email,
        telefone: ongData.telefone,
        localizacao: ongData.localizacao,
        latitude: ongData.latitude,
        longitude: ongData.longitude,
        impacto: ongData.impacto,
        imagem: ongData.imagem,
        logo: ongData.logo,
        instagramUrl: ongData.instagramUrl,
        videoUrl: ongData.videoUrl,
        websiteUrl: ongData.websiteUrl
      }
    });

    // Criar relações com ODS
    for (const ods of ongData.ods) {
      await prisma.nGOODS.create({
        data: {
          ngoId: ong.id,
          odsId: ods.id
        }
      });
    }

    // Criar relações com tipos de colaboração
    for (const colaboracao of ongData.colaboracao) {
      await prisma.colaboracao.create({
        data: {
          ngoId: ong.id,
          colaboracaoTipoId: colaboracao.id
        }
      });
    }

    // Criar relações com áreas de atuação
    for (const area of ongData.areaAtuacao) {
      await prisma.areaAtuacao.create({
        data: {
          ngoId: ong.id,
          areaAtuacaoTipoId: area.id
        }
      });
    }
  }

  // 5. Seed Eventos
  console.log('🎪 Criando eventos...');
  
  // Buscar NGOs para associar aos eventos
  const ngos = await prisma.nGO.findMany();
  const allOds = await prisma.oDS.findMany();
  const allAreas = await prisma.areaAtuacaoTipo.findMany();

  const eventosData = [
    {
      nome: 'Limpeza da Praia de Carcavelos',
      descricao: 'Junta-te a nós numa ação de limpeza da praia de Carcavelos. Vamos recolher lixo e sensibilizar para a proteção dos oceanos.',
      dataInicio: new Date('2024-10-15T09:00:00Z'),
      dataFim: new Date('2024-10-15T12:00:00Z'),
      localizacao: 'Praia de Carcavelos, Cascais',
      latitude: 38.6833,
      longitude: -9.3333,
      tipo: 'PRESENCIAL',
      maxParticipantes: 50,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/inscricao-limpeza-praia',
      ngoId: ngos[0]?.id,
      odsIds: [allOds.find(o => o.numero === 14)?.id, allOds.find(o => o.numero === 15)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id].filter(Boolean)
    },
    {
      nome: 'Workshop de Educação Financeira',
      descricao: 'Workshop online sobre educação financeira para jovens em situação de vulnerabilidade social.',
      dataInicio: new Date('2024-10-20T14:00:00Z'),
      dataFim: new Date('2024-10-20T17:00:00Z'),
      localizacao: 'Online via Zoom',
      tipo: 'REMOTO',
      maxParticipantes: 30,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/workshop-financeiro',
      linkEvento: 'https://zoom.us/j/123456789',
      ngoId: ngos[1]?.id,
      odsIds: [allOds.find(o => o.numero === 1)?.id, allOds.find(o => o.numero === 4)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Educação')?.id, allAreas.find(a => a.nome === 'Pobreza e exclusão')?.id].filter(Boolean)
    },
    {
      nome: 'Feira de Adoção de Animais',
      descricao: 'Evento especial para adoção de cães e gatos resgatados. Venha conhecer os nossos animais à procura de um lar.',
      dataInicio: new Date('2024-10-25T10:00:00Z'),
      dataFim: new Date('2024-10-25T16:00:00Z'),
      localizacao: 'Jardim da Gulbenkian, Lisboa',
      latitude: 38.7372,
      longitude: -9.1538,
      tipo: 'PRESENCIAL',
      inscricoesAbertas: true,
      ngoId: ngos[2]?.id,
      odsIds: [allOds.find(o => o.numero === 15)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Proteção Animal')?.id, allAreas.find(a => a.nome === 'Bem-estar animal')?.id].filter(Boolean)
    },
    {
      nome: 'Caminhada Solidária pelo Porto',
      descricao: 'Caminhada solidária para angariação de fundos para famílias carenciadas. Percurso de 5km pelo centro histórico do Porto.',
      dataInicio: new Date('2024-11-02T09:30:00Z'),
      dataFim: new Date('2024-11-02T12:00:00Z'),
      localizacao: 'Ribeira do Porto, Porto',
      latitude: 41.1405,
      longitude: -8.6130,
      tipo: 'PRESENCIAL',
      maxParticipantes: 200,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/caminhada-solidaria',
      ngoId: ngos[3]?.id,
      odsIds: [allOds.find(o => o.numero === 1)?.id, allOds.find(o => o.numero === 3)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ação Social')?.id, allAreas.find(a => a.nome === 'Saúde')?.id].filter(Boolean)
    },
    {
      nome: 'Sessão de Mentoria para Empreendedores',
      descricao: 'Sessão de mentoria híbrida para jovens empreendedores. Partilha de experiências e networking.',
      dataInicio: new Date('2024-11-10T15:00:00Z'),
      dataFim: new Date('2024-11-10T18:00:00Z'),
      localizacao: 'Startup Lisboa + Online',
      latitude: 38.7223,
      longitude: -9.1393,
      tipo: 'HIBRIDO',
      maxParticipantes: 25,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/mentoria-empreendedores',
      linkEvento: 'https://teams.microsoft.com/meet/123',
      ngoId: ngos[4]?.id,
      odsIds: [allOds.find(o => o.numero === 8)?.id, allOds.find(o => o.numero === 9)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Desenvolvimento comunitário')?.id].filter(Boolean)
    },
    {
      nome: 'Concerto Beneficente de Natal',
      descricao: 'Concerto de Natal para angariação de fundos para crianças carenciadas. Apresentação do Coro da Universidade de Coimbra.',
      dataInicio: new Date('2024-12-15T19:00:00Z'),
      dataFim: new Date('2024-12-15T21:30:00Z'),
      localizacao: 'Auditório da Universidade de Coimbra, Coimbra',
      latitude: 40.2033,
      longitude: -8.4103,
      tipo: 'PRESENCIAL',
      maxParticipantes: 300,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/concerto-natal',
      ngoId: ngos[5]?.id,
      odsIds: [allOds.find(o => o.numero === 1)?.id, allOds.find(o => o.numero === 4)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Cultura e património')?.id, allAreas.find(a => a.nome === 'Ação Social')?.id].filter(Boolean)
    },
    {
      nome: 'Formação em Primeiros Socorros',
      descricao: 'Formação gratuita em primeiros socorros aberta à comunidade. Certificação incluída.',
      dataInicio: new Date('2024-11-30T09:00:00Z'),
      dataFim: new Date('2024-11-30T17:00:00Z'),
      localizacao: 'Centro de Saúde de Aveiro, Aveiro',
      latitude: 40.6443,
      longitude: -8.6455,
      tipo: 'PRESENCIAL',
      maxParticipantes: 20,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/primeiros-socorros',
      ngoId: ngos[6]?.id,
      odsIds: [allOds.find(o => o.numero === 3)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Saúde')?.id].filter(Boolean)
    },
    {
      nome: 'Workshop de Sustentabilidade Urbana',
      descricao: 'Workshop sobre práticas sustentáveis nas cidades. Discussão sobre mobilidade, energia e gestão de resíduos.',
      dataInicio: new Date('2024-01-15T10:00:00Z'),
      dataFim: new Date('2024-01-15T16:00:00Z'),
      localizacao: 'Câmara Municipal de Braga, Braga',
      latitude: 41.5454,
      longitude: -8.4265,
      tipo: 'PRESENCIAL',
      maxParticipantes: 40,
      inscricoesAbertas: false,
      ngoId: ngos[0]?.id,
      odsIds: [allOds.find(o => o.numero === 11)?.id, allOds.find(o => o.numero === 13)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id].filter(Boolean)
    }
  ];

  for (const evento of eventosData) {
    const { odsIds, areaIds, ...eventoData } = evento;
    
    const createdEvent = await prisma.event.create({
      data: eventoData
    });

    // Associar ODS
    for (const odsId of odsIds) {
      if (odsId) {
        await prisma.eventODS.create({
          data: {
            eventId: createdEvent.id,
            odsId: odsId
          }
        });
      }
    }

    // Associar Areas
    for (const areaId of areaIds) {
      if (areaId) {
        await prisma.eventArea.create({
          data: {
            eventId: createdEvent.id,
            areaAtuacaoTipoId: areaId
          }
        });
      }
    }
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Criados:`);
  console.log(`   - ${odsData.length} ODS`);
  console.log(`   - ${colaboracaoTipos.length} tipos de colaboração`);
  console.log(`   - ${areasAtuacao.length} áreas de atuação`);
  console.log(`   - ${ongsData.length} ONGs`);
  console.log(`   - ${eventosData.length} eventos`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

