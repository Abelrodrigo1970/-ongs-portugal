import { prisma } from '@/lib/db';

export async function getAllODS() {
  return prisma.oDS.findMany({
    orderBy: { numero: 'asc' }
  });
}

export async function getODSByNumero(numero) {
  return prisma.oDS.findUnique({
    where: { numero },
    include: {
      ngos: {
        include: {
          ngo: {
            where: { visivel: true },
            select: {
              id: true,
              nome: true,
              descricao: true,
              logo: true,
              localizacao: true
            }
          }
        }
      }
    }
  });
}

export async function getODSById(id) {
  return prisma.oDS.findUnique({
    where: { id },
    include: {
      ngos: {
        include: {
          ngo: {
            where: { visivel: true },
            select: {
              id: true,
              nome: true,
              descricao: true,
              logo: true,
              localizacao: true
            }
          }
        }
      }
    }
  });
}

export async function createODS(data) {
  return prisma.oDS.create({
    data
  });
}

export async function updateODS(id, data) {
  return prisma.oDS.update({
    where: { id },
    data
  });
}

export async function deleteODS(id) {
  return prisma.oDS.delete({
    where: { id }
  });
}















