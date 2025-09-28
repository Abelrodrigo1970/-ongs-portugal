// Teste de conexão com o banco de dados
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'Não definida');
    
    // Teste simples de conexão
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão bem-sucedida:', result);
    
    // Teste de uma tabela
    const odsCount = await prisma.oDS.count();
    console.log('📊 Número de ODS:', odsCount);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
