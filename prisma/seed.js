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
      imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=200&h=200&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/culturaacessivel',
      videoUrl: 'https://youtube.com/watch?v=culturaacessivel',
      websiteUrl: 'https://culturaacessivel.pt'
    },
    {
      nome: 'Patas Solidárias',
      descricao: 'Organização dedicada ao resgate, tratamento e adoção responsável de animais abandonados, promovendo o bem-estar animal.',
      missao: 'Combater o abandono animal e promover a adoção responsável, garantindo que todos os animais tenham uma vida digna e amorosa.',
      email: 'contato@patassolidarias.pt',
      telefone: '+351 21 555 2233',
      localizacao: 'Setúbal, Portugal',
      latitude: 38.5244,
      longitude: -8.8882,
      impacto: JSON.stringify([
        'Resgate de 800 animais abandonados',
        '650 adoções realizadas com sucesso',
        'Campanhas de esterilização para 1.200 animais'
      ]),
      ods: [ods15, ods3, ods11],
      colaboracao: [doacoes, donativos, voluntariadoPresencial],
      areaAtuacao: [protecaoAnimal, bemEstarAnimal],
      imagem: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/patassolidarias',
      websiteUrl: 'https://patassolidarias.pt'
    },
    {
      nome: 'TechSocial',
      descricao: 'ONG que promove a inclusão digital e alfabetização tecnológica para idosos e comunidades carenciadas.',
      missao: 'Democratizar o acesso à tecnologia e reduzir a exclusão digital, capacitando pessoas de todas as idades.',
      email: 'info@techsocial.pt',
      telefone: '+351 22 888 4455',
      localizacao: 'Vila Nova de Gaia, Portugal',
      latitude: 41.1239,
      longitude: -8.6118,
      impacto: JSON.stringify([
        'Formação digital para 3.000 idosos',
        'Doação de 500 computadores recondicionados',
        'Criação de 25 centros digitais comunitários'
      ]),
      ods: [ods4, ods8, ods10],
      colaboracao: [voluntariadoRemoto, mentoria, probono],
      areaAtuacao: [educacao, inclusaoSocial, desenvolvimentoComunitario],
      imagem: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/techsocial',
      websiteUrl: 'https://techsocial.pt'
    },
    {
      nome: 'Energia Limpa Portugal',
      descricao: 'Organização focada na promoção de energias renováveis e eficiência energética em comunidades rurais.',
      missao: 'Acelerar a transição energética sustentável, tornando as energias renováveis acessíveis a todas as comunidades.',
      email: 'contato@energialimpa.pt',
      telefone: '+351 24 999 1122',
      localizacao: 'Beja, Portugal',
      latitude: 38.0150,
      longitude: -7.8632,
      impacto: JSON.stringify([
        'Instalação de painéis solares em 150 casas rurais',
        'Poupança de 2.000 MWh de energia',
        'Formação de 300 técnicos em energias renováveis'
      ]),
      ods: [ods7, ods13, ods11],
      colaboracao: [parcerias, probono, palestras],
      areaAtuacao: [ambiente, desenvolvimentoComunitario],
      imagem: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/energialimpa',
      websiteUrl: 'https://energialimpa.pt'
    },
    {
      nome: 'Mulheres Empreendedoras',
      descricao: 'ONG que apoia o empreendedorismo feminino através de mentoria, microcrédito e formação empresarial.',
      missao: 'Empoderar mulheres através do empreendedorismo, promovendo a igualdade de género no mundo dos negócios.',
      email: 'info@mulheresempreendedoras.pt',
      telefone: '+351 25 777 3344',
      localizacao: 'Aveiro, Portugal',
      latitude: 40.6405,
      longitude: -8.6538,
      impacto: JSON.stringify([
        'Apoio a 400 mulheres empreendedoras',
        '200 negócios criados ou expandidos',
        'Concessão de €500.000 em microcrédito'
      ]),
      ods: [ods5, ods8, ods10],
      colaboracao: [mentoria, doacoes, palestras],
      areaAtuacao: [igualdadeGenero, desenvolvimentoComunitario],
      imagem: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/mulheresempreendedoras',
      websiteUrl: 'https://mulheresempreendedoras.pt'
    },
    {
      nome: 'Lar Sem Fronteiras',
      descricao: 'Organização de apoio a refugiados e imigrantes, oferecendo acolhimento, integração e apoio jurídico.',
      missao: 'Acolher e integrar refugiados e imigrantes, promovendo uma sociedade mais inclusiva e multicultural.',
      email: 'contato@larsemfronteiras.pt',
      telefone: '+351 21 444 5566',
      localizacao: 'Amadora, Portugal',
      latitude: 38.7536,
      longitude: -9.2302,
      impacto: JSON.stringify([
        'Acolhimento de 250 famílias refugiadas',
        'Apoio jurídico a 800 imigrantes',
        'Cursos de português para 1.500 pessoas'
      ]),
      ods: [ods10, ods16, ods1],
      colaboracao: [voluntariadoPresencial, probono, doacoes],
      areaAtuacao: [direitosHumanos, inclusaoSocial, acaoSocial],
      imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/larsemfronteiras',
      websiteUrl: 'https://larsemfronteiras.pt'
    },
    {
      nome: 'Jovens Cientistas',
      descricao: 'ONG que promove a educação científica e tecnológica para jovens, especialmente em áreas STEM.',
      missao: 'Inspirar e capacitar jovens para carreiras em ciência e tecnologia, promovendo a inovação e o desenvolvimento sustentável.',
      email: 'info@jovenscientistas.pt',
      telefone: '+351 23 666 7788',
      localizacao: 'Leiria, Portugal',
      latitude: 39.7437,
      longitude: -8.8071,
      impacto: JSON.stringify([
        'Programas STEM para 2.000 jovens',
        'Criação de 30 laboratórios escolares',
        'Formação de 150 professores em ciências'
      ]),
      ods: [ods4, ods8, ods5],
      colaboracao: [mentoria, voluntariadoRemoto, parcerias],
      areaAtuacao: [educacao, inclusaoSocial],
      imagem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/jovenscientistas',
      websiteUrl: 'https://jovenscientistas.pt'
    },
    {
      nome: 'Águas Cristalinas',
      descricao: 'Organização dedicada à proteção e conservação dos recursos hídricos, promovendo o acesso à água potável.',
      missao: 'Garantir o acesso universal à água potável e saneamento, protegendo os recursos hídricos para as futuras gerações.',
      email: 'contato@aguascristalinas.pt',
      telefone: '+351 26 333 9900',
      localizacao: 'Castelo Branco, Portugal',
      latitude: 39.8222,
      longitude: -7.4931,
      impacto: JSON.stringify([
        'Construção de 50 poços de água potável',
        'Tratamento de águas residuais para 5.000 pessoas',
        'Proteção de 10 nascentes naturais'
      ]),
      ods: [ods6, ods14, ods15],
      colaboracao: [parcerias, doacoes, voluntariadoPresencial],
      areaAtuacao: [ambiente, conservacao, acaoSocial],
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/aguascristalinas',
      websiteUrl: 'https://aguascristalinas.pt'
    },
    {
      nome: 'Cidade Sustentável',
      descricao: 'ONG que promove o desenvolvimento urbano sustentável através de projetos de mobilidade, habitação e espaços verdes.',
      missao: 'Criar cidades mais sustentáveis, inclusivas e resilientes, melhorando a qualidade de vida urbana.',
      email: 'info@cidadesustentavel.pt',
      telefone: '+351 27 888 1122',
      localizacao: 'Viseu, Portugal',
      latitude: 40.6566,
      longitude: -7.9122,
      impacto: JSON.stringify([
        'Criação de 25 parques urbanos',
        'Implementação de 15 ciclovias',
        'Revitalização de 8 bairros degradados'
      ]),
      ods: [ods11, ods13, ods15],
      colaboracao: [parcerias, palestras, voluntariadoPresencial],
      areaAtuacao: [ambiente, desenvolvimentoComunitario],
      imagem: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/cidadesustentavel',
      websiteUrl: 'https://cidadesustentavel.pt'
    },
    {
      nome: 'Apoio Sénior',
      descricao: 'Organização dedicada ao apoio e cuidado de pessoas idosas, promovendo o envelhecimento ativo e saudável.',
      missao: 'Garantir dignidade e qualidade de vida para pessoas idosas, combatendo o isolamento e promovendo a participação social.',
      email: 'contato@apoiosenior.pt',
      telefone: '+351 28 555 4433',
      localizacao: 'Faro, Portugal',
      latitude: 37.0194,
      longitude: -7.9322,
      impacto: JSON.stringify([
        'Apoio domiciliário a 600 idosos',
        'Programas de convívio para 1.000 seniores',
        'Formação de 200 cuidadores'
      ]),
      ods: [ods3, ods10, ods11],
      colaboracao: [voluntariadoPresencial, doacoes, mentoria],
      areaAtuacao: [saude, acaoSocial, inclusaoSocial],
      imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/apoiosenior',
      websiteUrl: 'https://apoiosenior.pt'
    },
    {
      nome: 'Arte Inclusiva',
      descricao: 'ONG que promove a inclusão social através das artes, oferecendo oficinas e espetáculos para pessoas com deficiência.',
      missao: 'Democratizar o acesso às artes e usar a criatividade como ferramenta de inclusão e transformação social.',
      email: 'info@arteinclusiva.pt',
      telefone: '+351 29 777 8899',
      localizacao: 'Viana do Castelo, Portugal',
      latitude: 41.6947,
      longitude: -8.8314,
      impacto: JSON.stringify([
        'Oficinas artísticas para 500 pessoas com deficiência',
        '50 espetáculos inclusivos realizados',
        'Formação de 100 artistas em técnicas inclusivas'
      ]),
      ods: [ods10, ods4, ods11],
      colaboracao: [voluntariadoPresencial, palestras, donativos],
      areaAtuacao: [culturaPatrimonio, inclusaoSocial],
      imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/arteinclusiva',
      websiteUrl: 'https://arteinclusiva.pt'
    },
    {
      nome: 'Oceano Azul',
      descricao: 'Organização de conservação marinha focada na proteção de espécies marinhas ameaçadas e limpeza dos oceanos.',
      missao: 'Proteger a vida marinha e manter os oceanos limpos, garantindo ecossistemas saudáveis para as futuras gerações.',
      email: 'contato@oceanoazul.pt',
      telefone: '+351 30 444 5566',
      localizacao: 'Peniche, Portugal',
      latitude: 39.3558,
      longitude: -9.3811,
      impacto: JSON.stringify([
        'Limpeza de 100 praias e 50 km de costa',
        'Proteção de 5 espécies marinhas ameaçadas',
        'Sensibilização de 8.000 pessoas sobre poluição marinha'
      ]),
      ods: [ods14, ods15, ods13],
      colaboracao: [voluntariadoPresencial, palestras, parcerias],
      areaAtuacao: [conservacao, ambiente],
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      instagramUrl: 'https://instagram.com/oceanoazul',
      websiteUrl: 'https://oceanoazul.pt'
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
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
      imagem: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos[0]?.id,
      odsIds: [allOds.find(o => o.numero === 11)?.id, allOds.find(o => o.numero === 13)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id].filter(Boolean)
    },
    {
      nome: 'Plantação de Árvores no Parque da Cidade',
      descricao: 'Ação de reflorestação no Parque da Cidade do Porto. Vamos plantar árvores nativas e criar um espaço verde mais sustentável.',
      dataInicio: new Date('2025-10-12T09:00:00Z'),
      dataFim: new Date('2025-10-12T13:00:00Z'),
      localizacao: 'Parque da Cidade, Porto',
      latitude: 41.1617,
      longitude: -8.6764,
      tipo: 'PRESENCIAL',
      maxParticipantes: 80,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/plantacao-arvores',
      imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'VerdeVivo')?.id || ngos[3]?.id,
      odsIds: [allOds.find(o => o.numero === 15)?.id, allOds.find(o => o.numero === 13)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id, allAreas.find(a => a.nome === 'Conservação')?.id].filter(Boolean)
    },
    {
      nome: 'Curso de Alfabetização Digital para Seniores',
      descricao: 'Curso gratuito de 4 semanas para ensinar idosos a usar computadores, internet e aplicações básicas.',
      dataInicio: new Date('2025-10-18T14:00:00Z'),
      dataFim: new Date('2025-10-18T17:00:00Z'),
      localizacao: 'Biblioteca Municipal de Aveiro, Aveiro',
      latitude: 40.6405,
      longitude: -8.6538,
      tipo: 'PRESENCIAL',
      maxParticipantes: 15,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/alfabetizacao-digital',
      imagem: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'TechSocial')?.id || ngos[4]?.id,
      odsIds: [allOds.find(o => o.numero === 4)?.id, allOds.find(o => o.numero === 10)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Educação')?.id, allAreas.find(a => a.nome === 'Inclusão social')?.id].filter(Boolean)
    },
    {
      nome: 'Workshop de Empreendedorismo Feminino',
      descricao: 'Workshop intensivo sobre como iniciar um negócio, com foco no empoderamento de mulheres empreendedoras.',
      dataInicio: new Date('2025-10-25T09:30:00Z'),
      dataFim: new Date('2025-10-25T17:30:00Z'),
      localizacao: 'Centro de Inovação de Leiria, Leiria',
      latitude: 39.7437,
      longitude: -8.8071,
      tipo: 'PRESENCIAL',
      maxParticipantes: 35,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/empreendedorismo-feminino',
      imagem: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Mulheres Empreendedoras')?.id || ngos[5]?.id,
      odsIds: [allOds.find(o => o.numero === 5)?.id, allOds.find(o => o.numero === 8)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Igualdade de género')?.id, allAreas.find(a => a.nome === 'Desenvolvimento comunitário')?.id].filter(Boolean)
    },
    {
      nome: 'Campanha de Vacinação Animal Gratuita',
      descricao: 'Campanha de vacinação e microchipagem gratuita para animais de famílias carenciadas.',
      dataInicio: new Date('2025-11-05T08:00:00Z'),
      dataFim: new Date('2025-11-05T16:00:00Z'),
      localizacao: 'Centro Veterinário de Setúbal, Setúbal',
      latitude: 38.5244,
      longitude: -8.8882,
      tipo: 'PRESENCIAL',
      maxParticipantes: 100,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/vacinacao-animal',
      imagem: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Patas Solidárias')?.id || ngos[6]?.id,
      odsIds: [allOds.find(o => o.numero === 3)?.id, allOds.find(o => o.numero === 15)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Proteção Animal')?.id, allAreas.find(a => a.nome === 'Bem-estar animal')?.id].filter(Boolean)
    },
    {
      nome: 'Feira de Energias Renováveis',
      descricao: 'Exposição e demonstrações sobre energia solar, eólica e outras tecnologias sustentáveis.',
      dataInicio: new Date('2025-11-12T10:00:00Z'),
      dataFim: new Date('2025-11-12T18:00:00Z'),
      localizacao: 'Centro de Congressos de Beja, Beja',
      latitude: 38.0150,
      longitude: -7.8632,
      tipo: 'PRESENCIAL',
      maxParticipantes: 200,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/feira-energias',
      imagem: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Energia Limpa Portugal')?.id || ngos[7]?.id,
      odsIds: [allOds.find(o => o.numero === 7)?.id, allOds.find(o => o.numero === 13)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id].filter(Boolean)
    },
    {
      nome: 'Aulas de Português para Refugiados',
      descricao: 'Aulas gratuitas de português para refugiados e imigrantes, com foco na integração social.',
      dataInicio: new Date('2025-11-20T18:00:00Z'),
      dataFim: new Date('2025-11-20T20:00:00Z'),
      localizacao: 'Centro Comunitário da Amadora, Amadora',
      latitude: 38.7536,
      longitude: -9.2302,
      tipo: 'PRESENCIAL',
      maxParticipantes: 25,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/portugues-refugiados',
      imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Lar Sem Fronteiras')?.id || ngos[8]?.id,
      odsIds: [allOds.find(o => o.numero === 4)?.id, allOds.find(o => o.numero === 10)?.id, allOds.find(o => o.numero === 16)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Educação')?.id, allAreas.find(a => a.nome === 'Direitos humanos')?.id, allAreas.find(a => a.nome === 'Inclusão social')?.id].filter(Boolean)
    },
    {
      nome: 'Laboratório de Ciências para Jovens',
      descricao: 'Atividades práticas de química, física e biologia para jovens dos 12 aos 18 anos.',
      dataInicio: new Date('2025-11-28T14:00:00Z'),
      dataFim: new Date('2025-11-28T18:00:00Z'),
      localizacao: 'Escola Secundária de Leiria, Leiria',
      latitude: 39.7437,
      longitude: -8.8071,
      tipo: 'PRESENCIAL',
      maxParticipantes: 30,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/laboratorio-ciencias',
      imagem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Jovens Cientistas')?.id || ngos[9]?.id,
      odsIds: [allOds.find(o => o.numero === 4)?.id, allOds.find(o => o.numero === 9)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Educação')?.id].filter(Boolean)
    },
    {
      nome: 'Projeto de Purificação de Água Rural',
      descricao: 'Instalação de sistemas de purificação de água em comunidades rurais de Castelo Branco.',
      dataInicio: new Date('2025-12-05T08:00:00Z'),
      dataFim: new Date('2025-12-05T17:00:00Z'),
      localizacao: 'Aldeia da Benquerença, Castelo Branco',
      latitude: 39.8222,
      longitude: -7.4931,
      tipo: 'PRESENCIAL',
      maxParticipantes: 20,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/purificacao-agua',
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Águas Cristalinas')?.id || ngos[10]?.id,
      odsIds: [allOds.find(o => o.numero === 6)?.id, allOds.find(o => o.numero === 3)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id, allAreas.find(a => a.nome === 'Ação Social')?.id].filter(Boolean)
    },
    {
      nome: 'Criação de Horta Urbana Comunitária',
      descricao: 'Projeto colaborativo para criar uma horta urbana sustentável no centro de Viseu.',
      dataInicio: new Date('2025-12-10T09:00:00Z'),
      dataFim: new Date('2025-12-10T15:00:00Z'),
      localizacao: 'Parque Aquilino Ribeiro, Viseu',
      latitude: 40.6566,
      longitude: -7.9122,
      tipo: 'PRESENCIAL',
      maxParticipantes: 40,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/horta-urbana',
      imagem: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Cidade Sustentável')?.id || ngos[11]?.id,
      odsIds: [allOds.find(o => o.numero === 11)?.id, allOds.find(o => o.numero === 2)?.id, allOds.find(o => o.numero === 15)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id, allAreas.find(a => a.nome === 'Desenvolvimento comunitário')?.id].filter(Boolean)
    },
    {
      nome: 'Programa de Apoio a Idosos Isolados',
      descricao: 'Visitas domiciliárias e atividades de convívio para idosos em situação de isolamento social.',
      dataInicio: new Date('2025-12-15T10:00:00Z'),
      dataFim: new Date('2025-12-15T16:00:00Z'),
      localizacao: 'Centro de Dia de Faro, Faro',
      latitude: 37.0194,
      longitude: -7.9322,
      tipo: 'PRESENCIAL',
      maxParticipantes: 50,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/apoio-idosos',
      imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Apoio Sénior')?.id || ngos[12]?.id,
      odsIds: [allOds.find(o => o.numero === 3)?.id, allOds.find(o => o.numero === 10)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Saúde')?.id, allAreas.find(a => a.nome === 'Ação Social')?.id, allAreas.find(a => a.nome === 'Inclusão social')?.id].filter(Boolean)
    },
    {
      nome: 'Espetáculo de Teatro Inclusivo',
      descricao: 'Apresentação teatral com atores com e sem deficiência, promovendo a inclusão através das artes.',
      dataInicio: new Date('2025-12-20T20:00:00Z'),
      dataFim: new Date('2025-12-20T22:00:00Z'),
      localizacao: 'Teatro Municipal de Viana do Castelo, Viana do Castelo',
      latitude: 41.6947,
      longitude: -8.8314,
      tipo: 'PRESENCIAL',
      maxParticipantes: 150,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/teatro-inclusivo',
      imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Arte Inclusiva')?.id || ngos[13]?.id,
      odsIds: [allOds.find(o => o.numero === 10)?.id, allOds.find(o => o.numero === 11)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Cultura e património')?.id, allAreas.find(a => a.nome === 'Inclusão social')?.id].filter(Boolean)
    },
    {
      nome: 'Expedição de Limpeza Marinha',
      descricao: 'Expedição de mergulho para limpeza de fundos marinhos na costa de Peniche.',
      dataInicio: new Date('2026-01-15T08:00:00Z'),
      dataFim: new Date('2026-01-15T16:00:00Z'),
      localizacao: 'Marina de Peniche, Peniche',
      latitude: 39.3558,
      longitude: -9.3811,
      tipo: 'PRESENCIAL',
      maxParticipantes: 25,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/limpeza-marinha',
      imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'Oceano Azul')?.id || ngos[14]?.id,
      odsIds: [allOds.find(o => o.numero === 14)?.id, allOds.find(o => o.numero === 15)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Conservação')?.id, allAreas.find(a => a.nome === 'Ambiente')?.id].filter(Boolean)
    },
    {
      nome: 'Webinar sobre Sustentabilidade Empresarial',
      descricao: 'Sessão online sobre práticas sustentáveis no mundo empresarial e responsabilidade social corporativa.',
      dataInicio: new Date('2026-01-22T15:00:00Z'),
      dataFim: new Date('2026-01-22T17:30:00Z'),
      localizacao: 'Online via Zoom',
      tipo: 'REMOTO',
      maxParticipantes: 100,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/webinar-sustentabilidade',
      linkEvento: 'https://zoom.us/j/987654321',
      imagem: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'EcoMundo')?.id || ngos[0]?.id,
      odsIds: [allOds.find(o => o.numero === 12)?.id, allOds.find(o => o.numero === 13)?.id, allOds.find(o => o.numero === 17)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Ambiente')?.id].filter(Boolean)
    },
    {
      nome: 'Maratona de Programação Solidária',
      descricao: 'Hackathon de 24 horas para desenvolver soluções tecnológicas para ONGs e causas sociais.',
      dataInicio: new Date('2026-02-01T09:00:00Z'),
      dataFim: new Date('2026-02-02T09:00:00Z'),
      localizacao: 'Universidade de Aveiro, Aveiro',
      latitude: 40.6405,
      longitude: -8.6538,
      tipo: 'PRESENCIAL',
      maxParticipantes: 60,
      inscricoesAbertas: true,
      linkInscricao: 'https://exemplo.com/hackathon-solidario',
      imagem: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ngoId: ngos.find(n => n.nome === 'TechSocial')?.id || ngos[1]?.id,
      odsIds: [allOds.find(o => o.numero === 9)?.id, allOds.find(o => o.numero === 17)?.id].filter(Boolean),
      areaIds: [allAreas.find(a => a.nome === 'Educação')?.id, allAreas.find(a => a.nome === 'Desenvolvimento comunitário')?.id].filter(Boolean)
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

