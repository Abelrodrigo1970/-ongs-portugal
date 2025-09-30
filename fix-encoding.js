require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixEncoding() {
  try {
    console.log('🔧 Corrigindo codificação de caracteres...');
    
    // Listar todas as ONGs com problemas de codificação
    const ngos = await prisma.nGO.findMany();
    console.log(`\n📊 Encontradas ${ngos.length} ONGs`);
    
    // Mostrar algumas ONGs com problemas
    console.log('\n🔍 ONGs com problemas de codificação:');
    ngos.slice(0, 5).forEach((ngo, index) => {
      console.log(`${index + 1}. ${ngo.nome}`);
    });
    
    // Listar todas as áreas de atuação
    const areas = await prisma.areaAtuacaoTipo.findMany();
    console.log(`\n📊 Encontradas ${areas.length} áreas de atuação`);
    
    console.log('\n🔍 Áreas com problemas de codificação:');
    areas.forEach((area, index) => {
      console.log(`${index + 1}. ${area.nome}`);
    });
    
    // Listar todos os ODS
    const ods = await prisma.oDS.findMany();
    console.log(`\n📊 Encontrados ${ods.length} ODS`);
    
    console.log('\n🔍 ODS com problemas de codificação:');
    ods.slice(0, 5).forEach((odsItem, index) => {
      console.log(`${index + 1}. ODS ${odsItem.numero} - ${odsItem.nome}`);
    });
    
    // Testar pesquisa por "saúde" nas áreas
    console.log('\n🔍 Testando pesquisa por "saúde" nas áreas:');
    const healthAreas = await prisma.areaAtuacaoTipo.findMany({
      where: {
        OR: [
          { nome: { contains: 'saúde', mode: 'insensitive' } },
          { nome: { contains: 'saude', mode: 'insensitive' } },
          { nome: { contains: 'Saúde', mode: 'insensitive' } },
          { nome: { contains: 'SAÚDE', mode: 'insensitive' } }
        ]
      }
    });
    
    console.log(`Resultados encontrados: ${healthAreas.length}`);
    healthAreas.forEach(area => {
      console.log(`- ${area.nome}`);
    });
    
    // Testar pesquisa por "saúde" nos ODS
    console.log('\n🔍 Testando pesquisa por "saúde" nos ODS:');
    const healthODS = await prisma.oDS.findMany({
      where: {
        OR: [
          { nome: { contains: 'saúde', mode: 'insensitive' } },
          { nome: { contains: 'saude', mode: 'insensitive' } },
          { nome: { contains: 'Saúde', mode: 'insensitive' } },
          { nome: { contains: 'SAÚDE', mode: 'insensitive' } }
        ]
      }
    });
    
    console.log(`Resultados encontrados: ${healthODS.length}`);
    healthODS.forEach(odsItem => {
      console.log(`- ODS ${odsItem.numero} - ${odsItem.nome}`);
    });
    
    // Testar pesquisa por "saúde" nas ONGs
    console.log('\n🔍 Testando pesquisa por "saúde" nas ONGs:');
    const healthNGOs = await prisma.nGO.findMany({
      where: {
        OR: [
          { nome: { contains: 'saúde', mode: 'insensitive' } },
          { nome: { contains: 'saude', mode: 'insensitive' } },
          { nome: { contains: 'Saúde', mode: 'insensitive' } },
          { nome: { contains: 'SAÚDE', mode: 'insensitive' } },
          { descricao: { contains: 'saúde', mode: 'insensitive' } },
          { descricao: { contains: 'saude', mode: 'insensitive' } },
          { missao: { contains: 'saúde', mode: 'insensitive' } },
          { missao: { contains: 'saude', mode: 'insensitive' } }
        ]
      }
    });
    
    console.log(`Resultados encontrados: ${healthNGOs.length}`);
    healthNGOs.forEach(ngo => {
      console.log(`- ${ngo.nome}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEncoding();

