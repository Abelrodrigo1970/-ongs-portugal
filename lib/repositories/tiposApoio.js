import { prisma } from '@/lib/db';

export async function getAllTiposApoio() {
  return prisma.tipoApoioEmpresa.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function getTipoApoioById(id) {
  return prisma.tipoApoioEmpresa.findUnique({
    where: { id }
  });
}

