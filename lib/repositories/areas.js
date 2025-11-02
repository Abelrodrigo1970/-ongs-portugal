import { prisma } from '@/lib/db';

export async function getAllAreas() {
  return prisma.areaAtuacaoTipo.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function getAreaById(id) {
  return prisma.areaAtuacaoTipo.findUnique({
    where: { id }
  });
}

export async function createArea(data) {
  return prisma.areaAtuacaoTipo.create({
    data
  });
}

export async function updateArea(id, data) {
  return prisma.areaAtuacaoTipo.update({
    where: { id },
    data
  });
}

export async function deleteArea(id) {
  return prisma.areaAtuacaoTipo.delete({
    where: { id }
  });
}



























