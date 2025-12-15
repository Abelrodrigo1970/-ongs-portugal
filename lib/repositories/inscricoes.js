import prisma from '@/lib/db';

/**
 * Create a new inscription
 */
export async function createInscricao(data) {
  // Normalizar email (lowercase e trim) - garantir que é string
  let emailNormalized = null;
  if (data.emailColaborador) {
    if (typeof data.emailColaborador === 'string') {
      emailNormalized = data.emailColaborador.toLowerCase().trim();
    } else {
      emailNormalized = String(data.emailColaborador).toLowerCase().trim();
    }
  }
  
  if (!emailNormalized || emailNormalized === '') {
    throw new Error('Email é obrigatório');
  }

  // Validar que temos pelo menos eventoId ou iniciativaId (não ambos, não nenhum)
  // Garantir que são strings antes de chamar trim()
  const eventoId = data.eventoId && typeof data.eventoId === 'string' && data.eventoId.trim() !== '' ? data.eventoId.trim() : null;
  const iniciativaId = data.iniciativaId && typeof data.iniciativaId === 'string' && data.iniciativaId.trim() !== '' ? data.iniciativaId.trim() : null;

  if (!eventoId && !iniciativaId) {
    throw new Error('Evento ou Iniciativa é obrigatório');
  }

  if (eventoId && iniciativaId) {
    throw new Error('Não é possível ter evento e iniciativa ao mesmo tempo');
  }

  // Validar nomeColaborador
  if (!data.nomeColaborador || (typeof data.nomeColaborador === 'string' && data.nomeColaborador.trim() === '')) {
    throw new Error('Nome do colaborador é obrigatório');
  }

  console.log('Criando inscrição com dados:', {
    eventoId,
    iniciativaId,
    nomeColaborador: data.nomeColaborador,
    emailColaborador: emailNormalized,
    hasEventoId: !!eventoId,
    hasIniciativaId: !!iniciativaId
  });

  // Verificar se o evento existe e se há vagas disponíveis (se for evento)
  if (eventoId) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventoId },
        select: { id: true, maxParticipantes: true, inscricoesAbertas: true }
      });
      
      if (!event) {
        throw new Error(`Evento com ID ${eventoId} não encontrado`);
      }

      // Verificar se inscrições estão abertas
      if (!event.inscricoesAbertas) {
        throw new Error('As inscrições para este evento estão encerradas');
      }

      // Verificar vagas disponíveis se houver limite
      if (event.maxParticipantes && event.maxParticipantes > 0) {
        const vagas = await getVagasEvento(eventoId);
        if (vagas.disponiveis !== null && vagas.disponiveis <= 0) {
          throw new Error('Não há vagas disponíveis para este evento');
        }
        console.log('Vagas disponíveis:', vagas.disponiveis, '/', vagas.total);
      }

      console.log('Evento encontrado:', eventoId);
    } catch (error) {
      console.error('Erro ao verificar evento:', error);
      throw error; // Re-throw para manter a mensagem de erro original
    }
  }

  try {
    const inscricaoData = {
      eventoId: eventoId,
      iniciativaId: iniciativaId,
      nomeColaborador: String(data.nomeColaborador).trim(),
      emailColaborador: emailNormalized,
      telefone: data.telefone ? String(data.telefone).trim() : null,
      mensagem: data.mensagem ? String(data.mensagem).trim() : null,
      status: 'PENDENTE'
    };

    console.log('Dados que serão inseridos no banco:', inscricaoData);

    const result = await prisma.inscricao.create({
      data: inscricaoData
    });

    console.log('Inscrição criada com sucesso:', result.id);
    return result;
  } catch (error) {
    console.error('Prisma error creating inscricao:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error meta:', error.meta);
    
    // Se for erro de constraint do banco, dar mensagem mais clara
    if (error.code === 'P2002') {
      const constraint = error.meta?.target || 'dados únicos';
      throw new Error(`Já existe uma inscrição com estes dados (constraint: ${constraint})`);
    }
    if (error.code === 'P2003') {
      const field = error.meta?.field_name || 'evento/iniciativa';
      throw new Error(`Evento ou Iniciativa não encontrado (campo: ${field})`);
    }
    
    // Re-throw com mais detalhes em desenvolvimento
    const errorMessage = error.message || 'Erro desconhecido ao criar inscrição';
    throw new Error(`Erro ao criar inscrição: ${errorMessage}`);
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

/**
 * Count approved inscriptions for an event
 */
export async function countInscricoesAprovadas(eventoId) {
  if (!eventoId) {
    return 0;
  }

  return prisma.inscricao.count({
    where: {
      eventoId: eventoId,
      status: 'APROVADA'
    }
  });
}

/**
 * Count all inscriptions (any status) for an event
 */
export async function countInscricoes(eventoId, status = null) {
  if (!eventoId) {
    return 0;
  }

  const where = {
    eventoId: eventoId
  };

  if (status) {
    where.status = status;
  }

  return prisma.inscricao.count({
    where
  });
}

/**
 * Get available slots for an event
 * Returns: { total, ocupadas, disponiveis, hasLimit }
 */
export async function getVagasEvento(eventoId) {
  if (!eventoId) {
    return { total: 0, ocupadas: 0, disponiveis: 0, hasLimit: false };
  }

  // Buscar evento para obter maxParticipantes
  const event = await prisma.event.findUnique({
    where: { id: eventoId },
    select: { maxParticipantes: true }
  });

  if (!event) {
    return { total: 0, ocupadas: 0, disponiveis: 0, hasLimit: false };
  }

  const total = event.maxParticipantes || 0;
  const ocupadas = await countInscricoesAprovadas(eventoId);
  const disponiveis = total > 0 ? Math.max(0, total - ocupadas) : null;
  const hasLimit = total > 0;

  return {
    total,
    ocupadas,
    disponiveis,
    hasLimit
  };
}
