import { prisma } from '@/lib/db';

export async function getAllColaboracaoTipos() {
  return prisma.colaboracaoTipo.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function getColaboracaoTipoById(id) {
  return prisma.colaboracaoTipo.findUnique({
    where: { id }
  });
}

export async function createColaboracaoTipo(data) {
  return prisma.colaboracaoTipo.create({
    data
  });
}

export async function updateColaboracaoTipo(id, data) {
  return prisma.colaboracaoTipo.update({
    where: { id },
    data
  });
}

export async function deleteColaboracaoTipo(id) {
  return prisma.colaboracaoTipo.delete({
    where: { id }
  });
}















