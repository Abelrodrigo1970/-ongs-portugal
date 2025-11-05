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
  console.log('🔍 Verificando ONG CAIS...\n');

  // Buscar CAIS
  const cais = await prisma.nGO.findFirst({
    where: { nome: 'Associação CAIS' },
    include: {
      ods: {
        include: {
          ods: true
        }
      },
      areaAtuacao: {
        include: {
          tipo: true
        }
      },
      colaboracao: {
        include: {
          tipo: true
        }
      },
      eventos: true
    }
  });

  if (!cais) {
    console.log('❌ CAIS não encontrada na base de dados');
    return;
  }

  console.log('✅ ONG CAIS ENCONTRADA!\n');
  console.log('📋 Dados Principais:');
  console.log(`   ID: ${cais.id}`);
  console.log(`   Nome: ${cais.nome}`);
  console.log(`   Missão: ${cais.missao}`);
  console.log(`   Email: ${cais.email}`);
  console.log(`   Telefone: ${cais.telefone}`);
  console.log(`   Localização: ${cais.localizacao}`);
  console.log(`   Website: ${cais.websiteUrl}`);
  console.log(`   Logo: ${cais.logo}`);
  console.log(`   Imagem: ${cais.imagem}\n`);

  console.log('🎯 Áreas de Atuação:');
  cais.areaAtuacao.forEach(area => {
    console.log(`   - ${area.tipo.nome}`);
  });

  console.log('\n🤝 Tipos de Colaboração:');
  cais.colaboracao.forEach(colab => {
    console.log(`   - ${colab.tipo.nome}`);
  });

  console.log('\n🌍 ODS Relacionados:');
  cais.ods.forEach(o => {
    console.log(`   - ODS ${o.ods.numero}: ${o.ods.nome}`);
  });

  console.log('\n📊 Métricas de Impacto:');
  try {
    const impacto = JSON.parse(cais.impacto);
    impacto.forEach(metrica => {
      console.log(`   - ${metrica}`);
    });
  } catch (e) {
    console.log('   (Não disponível)');
  }

  console.log('\n📅 Eventos:');
  console.log(`   Total: ${cais.eventos.length}`);
  cais.eventos.forEach(evento => {
    console.log(`   - ${evento.nome} (${evento.dataInicio.toLocaleDateString('pt-PT')})`);
  });

  console.log('\n🌐 URL da Página:');
  console.log(`   http://localhost:3000/ongs/${cais.id}`);
  console.log('\n📱 Teste a página no navegador! ✨');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

