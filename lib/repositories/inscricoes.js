import prisma from '@/lib/db';

/**
 * Create a new inscription
 */
export async function createInscricao(data) {
  // Normalizar email (lowercase e trim)
  const emailNormalized = data.emailColaborador ? data.emailColaborador.toLowerCase().trim() : null;
  
  if (!emailNormalized) {
    throw new Error('Email é obrigatório');
  }

  return prisma.inscricao.create({
    data: {
      eventoId: data.eventoId || null,
      iniciativaId: data.iniciativaId || null,
      nomeColaborador: data.nomeColaborador,
      emailColaborador: emailNormalized,
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
  if (!emailColaborador) {
    return null;
  }

  const where = {
    emailColaborador: emailColaborador.toLowerCase().trim()
  };

  // Se temos eventoId, verificar apenas para esse evento
  if (eventoId) {
    where.eventoId = eventoId;
    // Garantir que iniciativaId é null para eventos
    where.iniciativaId = null;
  } else if (iniciativaId) {
    // Se temos iniciativaId, verificar apenas para essa iniciativa
    where.iniciativaId = iniciativaId;
    // Garantir que eventoId é null para iniciativas
    where.eventoId = null;
  } else {
    // Se não temos nem evento nem iniciativa, não podemos verificar
    return null;
  }

  return prisma.inscricao.findFirst({
    where
  });
}
