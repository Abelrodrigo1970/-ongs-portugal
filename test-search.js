const { PrismaClient } = require('@prisma/client');
const { normalizeText } = require('./lib/utils.js');

const prisma = new PrismaClient();

async function testSearch() {
  console.log('🔍 Testando pesquisa por "saúde"...');
  console.log('Normalized query:', normalizeText('saúde'));
  
  // Teste 1: Buscar eventos que contenham "saude" no nome, descrição ou áreas
  const eventsWithSaude = await prisma.event.findMany({
    where: {
      AND: [
        { visivel: true },
        {
          OR: [
            { nome: { contains: normalizeText('saúde'), mode: 'insensitive' } },
            { descricao: { contains: normalizeText('saúde'), mode: 'insensitive' } },
            { localizacao: { contains: normalizeText('saúde'), mode: 'insensitive' } },
            { ngo: { nome: { contains: normalizeText('saúde'), mode: 'insensitive' } } },
            {
              areas: {
                some: {
                  tipo: {
                    nome: { contains: normalizeText('saúde'), mode: 'insensitive' }
                  }
                }
              }
            },
            {
              ods: {
                some: {
                  ods: {
                    nome: { contains: normalizeText('saúde'), mode: 'insensitive' }
                  }
                }
              }
            }
          ]
        }
      ]
    },
    include: {
      ngo: {
        select: {
          id: true,
          nome: true
        }
      },
      areas: {
        include: {
          tipo: true
        }
      },
      ods: {
        include: {
          ods: true
        }
      }
    }
  });

  console.log(`\n📊 Eventos encontrados: ${eventsWithSaude.length}`);
  eventsWithSaude.forEach((event, index) => {
    console.log(`${index + 1}. ${event.nome}`);
    console.log(`   NGO: ${event.ngo.nome}`);
    console.log(`   Áreas: ${event.areas.map(a => a.tipo.nome).join(', ')}`);
    console.log(`   ODS: ${event.ods.map(o => `${o.ods.numero} - ${o.ods.nome}`).join(', ')}`);
    console.log('');
  });

  // Teste 2: Buscar todas as áreas de atuação
  const allAreas = await prisma.areaAtuacaoTipo.findMany();
  console.log('\n🏷️ Todas as áreas de atuação:');
  allAreas.forEach(area => {
    console.log(`- ${area.nome}`);
  });

  // Teste 3: Buscar eventos com área "Saúde"
  const healthArea = await prisma.areaAtuacaoTipo.findFirst({
    where: { nome: { contains: 'Saúde', mode: 'insensitive' } }
  });

  if (healthArea) {
    console.log(`\n🏥 Área de saúde encontrada: ${healthArea.nome} (ID: ${healthArea.id})`);
    
    const eventsWithHealthArea = await prisma.event.findMany({
      where: {
        AND: [
          { visivel: true },
          {
            areas: {
              some: {
                areaAtuacaoTipoId: healthArea.id
              }
            }
          }
        ]
      },
      include: {
        ngo: {
          select: {
            id: true,
            nome: true
          }
        },
        areas: {
          include: {
            tipo: true
          }
        }
      }
    });

    console.log(`\n📊 Eventos com área de saúde: ${eventsWithHealthArea.length}`);
    eventsWithHealthArea.forEach((event, index) => {
      console.log(`${index + 1}. ${event.nome}`);
      console.log(`   NGO: ${event.ngo.nome}`);
      console.log(`   Áreas: ${event.areas.map(a => a.tipo.nome).join(', ')}`);
      console.log('');
    });
  }

  await prisma.$disconnect();
}

testSearch().catch(console.error);

