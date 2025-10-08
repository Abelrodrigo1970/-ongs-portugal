import { prisma } from '../lib/db.js';

async function setupEmpresasDB() {
  try {
    console.log('🔧 Configurando base de dados para Empresas...');
    
    // Como não podemos criar enums via Prisma executeRaw com múltiplos comandos,
    // vamos criar dados seed para testar a funcionalidade
    
    console.log('\n📊 Criando dados de exemplo para Empresas...');
    
    // Buscar ODS existentes para associar
    const ods3 = await prisma.oDS.findFirst({ where: { numero: 3 } }); // Saúde
    const ods4 = await prisma.oDS.findFirst({ where: { numero: 4 } }); // Educação
    const ods8 = await prisma.oDS.findFirst({ where: { numero: 8 } }); // Trabalho
    const ods13 = await prisma.oDS.findFirst({ where: { numero: 13 } }); // Ação Climática
    
    // Criar Causas
    console.log('\n🎯 Criando Causas...');
    const causas = await Promise.all([
      prisma.causa.upsert({
        where: { nome: 'Educação' },
        update: {},
        create: { nome: 'Educação', descricao: 'Projetos de educação e formação' }
      }),
      prisma.causa.upsert({
        where: { nome: 'Ambiente' },
        update: {},
        create: { nome: 'Ambiente', descricao: 'Sustentabilidade e conservação' }
      }),
      prisma.causa.upsert({
        where: { nome: 'Saúde' },
        update: {},
        create: { nome: 'Saúde', descricao: 'Saúde e bem-estar' }
      }),
      prisma.causa.upsert({
        where: { nome: 'Inclusão Social' },
        update: {},
        create: { nome: 'Inclusão Social', descricao: 'Igualdade e inclusão' }
      })
    ]);
    
    console.log(`✅ ${causas.length} causas criadas`);
    
    // Criar Tipos de Apoio
    console.log('\n🤝 Criando Tipos de Apoio...');
    const tiposApoio = await Promise.all([
      prisma.tipoApoioEmpresa.upsert({
        where: { nome: 'Voluntariado Presencial' },
        update: {},
        create: {
          nome: 'Voluntariado Presencial',
          descricao: 'Colaboradores dedicam tempo presencialmente',
          tipo: 'TEMPO_VOLUNTARIADO'
        }
      }),
      prisma.tipoApoioEmpresa.upsert({
        where: { nome: 'Formação e Capacitação' },
        update: {},
        create: {
          nome: 'Formação e Capacitação',
          descricao: 'Workshops e formações para ONGs',
          tipo: 'CONHECIMENTO_CAPACITACAO'
        }
      }),
      prisma.tipoApoioEmpresa.upsert({
        where: { nome: 'Consultoria Pro Bono' },
        update: {},
        create: {
          nome: 'Consultoria Pro Bono',
          descricao: 'Consultoria gratuita especializada',
          tipo: 'RECURSOS_SERVICOS'
        }
      }),
      prisma.tipoApoioEmpresa.upsert({
        where: { nome: 'Doação de Produtos' },
        update: {},
        create: {
          nome: 'Doação de Produtos',
          descricao: 'Doação de produtos da empresa',
          tipo: 'PRODUTOS_BENS'
        }
      })
    ]);
    
    console.log(`✅ ${tiposApoio.length} tipos de apoio criados`);
    
    // Criar Empresas de exemplo
    console.log('\n🏢 Criando Empresas de exemplo...');
    
    const empresa1 = await prisma.empresa.create({
      data: {
        nome: 'TechForGood Portugal',
        missao: 'Usar a tecnologia para criar impacto social positivo e apoiar ONGs na transformação digital.',
        descricao: 'Empresa tecnológica focada em desenvolvimento de soluções para o terceiro setor.',
        setor: 'Tecnologia',
        numColaboradores: 50,
        email: 'contato@techforgood.pt',
        telefone: '+351 21 123 4567',
        localizacao: 'Lisboa, Portugal',
        latitude: 38.7223,
        longitude: -9.1393,
        logo: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=200&h=200&fit=crop',
        website: 'https://techforgood.pt',
        visivel: true
      }
    });
    
    const empresa2 = await prisma.empresa.create({
      data: {
        nome: 'GreenBusiness Solutions',
        missao: 'Promover práticas empresariais sustentáveis e apoiar projetos ambientais.',
        descricao: 'Consultoria em sustentabilidade e responsabilidade social corporativa.',
        setor: 'Consultoria',
        numColaboradores: 30,
        email: 'info@greenbusiness.pt',
        telefone: '+351 22 987 6543',
        localizacao: 'Porto, Portugal',
        latitude: 41.1579,
        longitude: -8.6291,
        logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
        website: 'https://greenbusiness.pt',
        visivel: true
      }
    });
    
    console.log(`✅ 2 empresas criadas`);
    
    // Associar ODS às empresas
    if (ods3 && ods4 && ods8 && ods13) {
      await Promise.all([
        prisma.empresaODS.create({ data: { empresaId: empresa1.id, odsId: ods4.id } }),
        prisma.empresaODS.create({ data: { empresaId: empresa1.id, odsId: ods8.id } }),
        prisma.empresaODS.create({ data: { empresaId: empresa2.id, odsId: ods13.id } }),
        prisma.empresaODS.create({ data: { empresaId: empresa2.id, odsId: ods3.id } })
      ]);
      console.log('✅ ODS associados às empresas');
    }
    
    // Associar causas às empresas
    await Promise.all([
      prisma.empresaCausa.create({ data: { empresaId: empresa1.id, causaId: causas[0].id } }), // Educação
      prisma.empresaCausa.create({ data: { empresaId: empresa1.id, causaId: causas[3].id } }), // Inclusão
      prisma.empresaCausa.create({ data: { empresaId: empresa2.id, causaId: causas[1].id } }), // Ambiente
      prisma.empresaCausa.create({ data: { empresaId: empresa2.id, causaId: causas[2].id } })  // Saúde
    ]);
    console.log('✅ Causas associadas às empresas');
    
    // Associar tipos de apoio às empresas
    await Promise.all([
      prisma.empresaTipoApoio.create({ data: { empresaId: empresa1.id, tipoApoioId: tiposApoio[0].id } }),
      prisma.empresaTipoApoio.create({ data: { empresaId: empresa1.id, tipoApoioId: tiposApoio[1].id } }),
      prisma.empresaTipoApoio.create({ data: { empresaId: empresa2.id, tipoApoioId: tiposApoio[0].id } }),
      prisma.empresaTipoApoio.create({ data: { empresaId: empresa2.id, tipoApoioId: tiposApoio[2].id } })
    ]);
    console.log('✅ Tipos de apoio associados às empresas');
    
    // Criar estatísticas de impacto
    const currentYear = new Date().getFullYear();
    await Promise.all([
      prisma.estatisticaImpactoEmpresa.create({
        data: {
          empresaId: empresa1.id,
          periodoAno: currentYear,
          periodoMes: 1,
          horasVoluntariado: 120,
          numProjetos: 3,
          numVoluntarios: 15
        }
      }),
      prisma.estatisticaImpactoEmpresa.create({
        data: {
          empresaId: empresa1.id,
          periodoAno: currentYear,
          periodoMes: 2,
          horasVoluntariado: 150,
          numProjetos: 4,
          numVoluntarios: 20
        }
      }),
      prisma.estatisticaImpactoEmpresa.create({
        data: {
          empresaId: empresa2.id,
          periodoAno: currentYear,
          periodoMes: 1,
          horasVoluntariado: 80,
          numProjetos: 2,
          numVoluntarios: 10
        }
      })
    ]);
    console.log('✅ Estatísticas de impacto criadas');
    
    // Criar iniciativas
    console.log('\n🎯 Criando Iniciativas de exemplo...');
    await prisma.iniciativa.create({
      data: {
        empresaId: empresa1.id,
        causaId: causas[0].id,
        titulo: 'Programa de Mentoria Digital',
        descricao: 'Mentoria de colaboradores da TechForGood para jovens em situação vulnerável.',
        dataInicio: new Date('2024-12-01T10:00:00Z'),
        dataFim: new Date('2025-06-01T18:00:00Z'),
        tipoApoio: 'CONHECIMENTO_CAPACITACAO',
        vagas: 20,
        vagasPreenchidas: 12,
        status: 'ATIVA',
        localizacao: 'Lisboa, Portugal'
      }
    });
    
    await prisma.iniciativa.create({
      data: {
        empresaId: empresa2.id,
        causaId: causas[1].id,
        titulo: 'Dia do Voluntariado Ambiental',
        descricao: 'Ação de limpeza de praias e plantação de árvores com colaboradores.',
        dataInicio: new Date('2024-11-20T09:00:00Z'),
        dataFim: new Date('2024-11-20T17:00:00Z'),
        tipoApoio: 'TEMPO_VOLUNTARIADO',
        vagas: 30,
        vagasPreenchidas: 25,
        status: 'ATIVA',
        localizacao: 'Porto, Portugal'
      }
    });
    
    console.log('✅ 2 iniciativas criadas');
    
    console.log('\n🎉 Setup completo! Base de dados de Empresas pronta para usar.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.code) console.error('Código:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

setupEmpresasDB();
