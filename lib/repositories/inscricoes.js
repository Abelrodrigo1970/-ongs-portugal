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

  // Validar que temos pelo menos eventoId ou iniciativaId (não ambos, não nenhum)
  const eventoId = data.eventoId && data.eventoId.trim() !== '' ? data.eventoId : null;
  const iniciativaId = data.iniciativaId && data.iniciativaId.trim() !== '' ? data.iniciativaId : null;

  if (!eventoId && !iniciativaId) {
    throw new Error('Evento ou Iniciativa é obrigatório');
  }

  if (eventoId && iniciativaId) {
    throw new Error('Não é possível ter evento e iniciativa ao mesmo tempo');
  }

  try {
    return await prisma.inscricao.create({
      data: {
        eventoId: eventoId,
        iniciativaId: iniciativaId,
        nomeColaborador: data.nomeColaborador,
        emailColaborador: emailNormalized,
        telefone: data.telefone || null,
        mensagem: data.mensagem || null,
        status: 'PENDENTE'
      }
    });
  } catch (error) {
    console.error('Prisma error creating inscricao:', error);
    // Se for erro de constraint do banco, dar mensagem mais clara
    if (error.code === 'P2002') {
      throw new Error('Já existe uma inscrição com estes dados');
    }
    if (error.code === 'P2003') {
      throw new Error('Evento ou Iniciativa não encontrado');
    }
    throw error;
  }
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
