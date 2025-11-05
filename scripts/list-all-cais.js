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
  console.log('🔍 Procurando todas as CAIS...\n');

  const todasCAIS = await prisma.nGO.findMany({
    where: {
      nome: {
        contains: 'CAIS',
        mode: 'insensitive'
      }
    },
    include: {
      eventos: true,
      ods: true,
      areaAtuacao: true
    }
  });

  console.log(`📊 Total encontrado: ${todasCAIS.length}\n`);

  if (todasCAIS.length === 0) {
    console.log('❌ Nenhuma CAIS encontrada!');
    return;
  }

  todasCAIS.forEach((cais, index) => {
    console.log(`\n${index + 1}. ${cais.nome}`);
    console.log(`   ID: ${cais.id}`);
    console.log(`   Email: ${cais.email}`);
    console.log(`   Telefone: ${cais.telefone}`);
    console.log(`   Localização: ${cais.localizacao}`);
    console.log(`   Logo: ${cais.logo || '❌ Sem logo'}`);
    console.log(`   Imagem: ${cais.imagem || '❌ Sem imagem'}`);
    console.log(`   Website: ${cais.websiteUrl || '❌ Sem website'}`);
    console.log(`   Visível: ${cais.visivel ? '✅' : '❌'}`);
    console.log(`   Eventos: ${cais.eventos.length}`);
    console.log(`   ODS: ${cais.ods.length}`);
    console.log(`   Áreas: ${cais.areaAtuacao.length}`);
    console.log(`   Criado: ${cais.createdAt.toLocaleString('pt-PT')}`);
  });

  console.log('\n\n🗑️ Qual CAIS deseja MANTER?');
  console.log('   A CAIS CORRETA normalmente tem:');
  console.log('   ✅ Logo e Imagem definidos');
  console.log('   ✅ 3 Eventos');
  console.log('   ✅ 3 ODS');
  console.log('   ✅ 6 Áreas de atuação');
  console.log('   ✅ Data de criação mais recente');

  if (todasCAIS.length === 2) {
    console.log('\n🤖 Análise automática:');
    
    const cais1 = todasCAIS[0];
    const cais2 = todasCAIS[1];
    
    let melhorCAIS = null;
    let piorCAIS = null;
    
    // Comparar qual está mais completa
    const score1 = 
      (cais1.logo ? 10 : 0) +
      (cais1.imagem ? 10 : 0) +
      (cais1.eventos.length * 5) +
      (cais1.ods.length * 3) +
      (cais1.areaAtuacao.length * 2);
      
    const score2 = 
      (cais2.logo ? 10 : 0) +
      (cais2.imagem ? 10 : 0) +
      (cais2.eventos.length * 5) +
      (cais2.ods.length * 3) +
      (cais2.areaAtuacao.length * 2);
    
    if (score1 > score2) {
      melhorCAIS = cais1;
      piorCAIS = cais2;
    } else {
      melhorCAIS = cais2;
      piorCAIS = cais1;
    }
    
    console.log(`\n✅ MANTER: ${melhorCAIS.nome} (ID: ${melhorCAIS.id})`);
    console.log(`   Score: ${Math.max(score1, score2)} pontos`);
    console.log(`   ${melhorCAIS.eventos.length} eventos, ${melhorCAIS.ods.length} ODS, ${melhorCAIS.areaAtuacao.length} áreas`);
    
    console.log(`\n❌ DELETAR: ${piorCAIS.nome} (ID: ${piorCAIS.id})`);
    console.log(`   Score: ${Math.min(score1, score2)} pontos`);
    console.log(`   ${piorCAIS.eventos.length} eventos, ${piorCAIS.ods.length} ODS, ${piorCAIS.areaAtuacao.length} áreas`);
    
    console.log('\n🔧 Execute o seguinte comando para deletar a duplicada:');
    console.log(`   node scripts/delete-ngo.js ${piorCAIS.id}`);
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

