import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Configuração do Prisma com tratamento de erro
const prismaConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
};

// Verificar se DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não está definida!');
  console.error('Variáveis de ambiente disponíveis:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('SUPABASE')));
  
  // Fallback para desenvolvimento local
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Usando configuração de fallback para desenvolvimento');
    prismaConfig.datasources = {
      db: {
        url: "postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
      }
    };
  }
}

export const prisma = globalForPrisma.prisma || new PrismaClient(prismaConfig);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;







