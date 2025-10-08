import prisma from '@/lib/db';

/**
 * Create a new inscription
 */
export async function createInscricao(data) {
  return prisma.inscricao.create({
    data: {
      eventoId: data.eventoId || null,
      iniciativaId: data.iniciativaId || null,
      nomeColaborador: data.nomeColaborador,
      emailColaborador: data.emailColaborador,
      telefone: data.telefone || null,
      mensagem: data.mensagem || null,
      status: 'PENDENTE'
    }
  });
}

/**
 * Get all inscriptions with optional filters
 */
export async function getInscricoes(filters = {}) {
  const where = {};

  if (filters.eventoId) {
    where.eventoId = filters.eventoId;
  }

  if (filters.iniciativaId) {
    where.iniciativaId = filters.iniciativaId;
  }

  if (filters.emailColaborador) {
    where.emailColaborador = filters.emailColaborador;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return prisma.inscricao.findMany({
    where,
    include: {
      evento: {
        include: {
          ngo: true
        }
      },
      iniciativa: {
        include: {
          empresa: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Get inscription by ID
 */
export async function getInscricaoById(id) {
  return prisma.inscricao.findUnique({
    where: { id },
    include: {
      evento: {
        include: {
          ngo: true
        }
      },
      iniciativa: {
        include: {
          empresa: true
        }
      }
    }
  });
}

/**
 * Update inscription status
 */
export async function updateInscricaoStatus(id, status) {
  return prisma.inscricao.update({
    where: { id },
    data: { status }
  });
}

/**
 * Delete inscription
 */
export async function deleteInscricao(id) {
  return prisma.inscricao.delete({
    where: { id }
  });
}

/**
 * Check if colaborador is already inscribed
 */
export async function checkInscricao(eventoId, iniciativaId, emailColaborador) {
  const where = {
    emailColaborador
  };

  if (eventoId) {
    where.eventoId = eventoId;
  }

  if (iniciativaId) {
    where.iniciativaId = iniciativaId;
  }

  return prisma.inscricao.findFirst({
    where
  });
}
