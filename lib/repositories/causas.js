import { prisma } from '@/lib/db';

export async function getAllCausas() {
  return prisma.causa.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function getCausaById(id) {
  return prisma.causa.findUnique({
    where: { id }
  });
}

