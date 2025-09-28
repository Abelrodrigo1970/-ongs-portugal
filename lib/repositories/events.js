import { prisma } from '@/lib/db';

/**
 * Get events with filters
 */
export async function getEvents(filters = {}) {
  const {
    query = '',
    ods = [],
    areas = [],
    tipo = [],
    localizacao = '',
    ngoId = null,
    dataInicio = null,
    dataFim = null,
    inscricoesAbertas = null,
    visivel = true,
    sort = 'dataInicio-asc',
    page = 1,
    limit = 12
  } = filters;

  const where = {
    AND: [
      // Visibilidade
      { visivel: visivel },
      
      // Texto livre
      query ? {
        OR: [
          { nome: { contains: query } },
          { descricao: { contains: query } },
          { localizacao: { contains: query } },
          { ngo: { nome: { contains: query } } }
        ]
      } : {},

      // Filtro por localização
      localizacao ? {
        localizacao: {
          contains: localizacao,
          mode: 'insensitive'
        }
      } : {},

      // NGO específica
      ngoId ? { ngoId: ngoId } : {},

      // Tipo de evento
      tipo.length > 0 ? { tipo: { in: tipo } } : {},

      // Inscrições abertas
      inscricoesAbertas !== null ? { inscricoesAbertas: inscricoesAbertas } : {},

      // Filtro por data
      dataInicio ? { dataInicio: { gte: new Date(dataInicio) } } : {},
      dataFim ? { dataInicio: { lte: new Date(dataFim) } } : {},

      // ODS
      ods.length > 0 ? {
        ods: {
          some: {
            odsId: { in: ods }
          }
        }
      } : {},

      // Areas
      areas.length > 0 ? {
        areas: {
          some: {
            areaAtuacaoTipoId: { in: areas }
          }
        }
      } : {}
    ].filter(condition => Object.keys(condition).length > 0)
  };

  // Sorting
  let orderBy = {};
  switch (sort) {
    case 'nome-asc':
      orderBy = { nome: 'asc' };
      break;
    case 'nome-desc':
      orderBy = { nome: 'desc' };
      break;
    case 'dataInicio-asc':
      orderBy = { dataInicio: 'asc' };
      break;
    case 'dataInicio-desc':
      orderBy = { dataInicio: 'desc' };
      break;
    case 'recent':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { dataInicio: 'asc' };
  }

  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        ngo: {
          select: {
            id: true,
            nome: true,
            logo: true,
            localizacao: true
          }
        },
        ods: {
          include: {
            ods: true
          }
        },
        areas: {
          include: {
            tipo: true
          }
        }
      }
    }),
    prisma.event.count({ where })
  ]);

  const pages = Math.ceil(total / limit);

  return {
    events,
    pagination: {
      page,
      pages,
      total,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  };
}

/**
 * Get event by ID
 */
export async function getEventById(id) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      ngo: true,
      ods: {
        include: {
          ods: true
        }
      },
      areas: {
        include: {
          tipo: true
        }
      }
    }
  });
}

/**
 * Get featured events
 */
export async function getFeaturedEvents(limit = 6) {
  // Primeiro, tenta encontrar eventos futuros com imagens
  const futureEvents = await prisma.event.findMany({
    where: {
      visivel: true,
      inscricoesAbertas: true,
      imagem: {
        not: null
      },
      dataInicio: {
        gte: new Date() // Eventos futuros
      }
    },
    orderBy: {
      dataInicio: 'asc'
    },
    take: limit,
    include: {
      ngo: {
        select: {
          id: true,
          nome: true,
          logo: true,
          localizacao: true
        }
      },
      ods: {
        include: {
          ods: true
        }
      },
      areas: {
        include: {
          tipo: true
        }
      }
    }
  });

  // Se não houver eventos futuros suficientes, pega eventos recentes com imagens
  if (futureEvents.length < limit) {
    const recentEvents = await prisma.event.findMany({
      where: {
        visivel: true,
        imagem: {
          not: null
        }
      },
      orderBy: {
        dataInicio: 'desc'
      },
      take: limit,
      include: {
        ngo: {
          select: {
            id: true,
            nome: true,
            logo: true,
            localizacao: true
          }
        },
        ods: {
          include: {
            ods: true
          }
        },
        areas: {
          include: {
            tipo: true
          }
        }
      }
    });

    return recentEvents;
  }

  return futureEvents;
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(limit = 10) {
  return prisma.event.findMany({
    where: {
      visivel: true,
      dataInicio: {
        gte: new Date()
      }
    },
    orderBy: {
      dataInicio: 'asc'
    },
    take: limit,
    include: {
      ngo: {
        select: {
          id: true,
          nome: true,
          logo: true
        }
      },
      ods: {
        include: {
          ods: true
        }
      }
    }
  });
}

/**
 * Get events by NGO
 */
export async function getEventsByNGO(ngoId, options = {}) {
  const { includeAll = false, limit = 10 } = options;
  
  const where = {
    ngoId,
    visivel: true
  };

  if (!includeAll) {
    where.dataInicio = {
      gte: new Date() // Apenas eventos futuros por padrão
    };
  }

  return prisma.event.findMany({
    where,
    orderBy: {
      dataInicio: 'asc'
    },
    take: limit,
    include: {
      ngo: {
        select: {
          id: true,
          nome: true,
          logo: true
        }
      },
      ods: {
        include: {
          ods: true
        }
      },
      areas: {
        include: {
          tipo: true
        }
      }
    }
  });
}

/**
 * Create event
 */
export async function createEvent(data) {
  const { ods = [], areas = [], ...eventData } = data;

  return prisma.event.create({
    data: {
      ...eventData,
      ods: {
        create: ods.map(odsId => ({
          odsId
        }))
      },
      areas: {
        create: areas.map(areaId => ({
          areaAtuacaoTipoId: areaId
        }))
      }
    },
    include: {
      ngo: true,
      ods: {
        include: {
          ods: true
        }
      },
      areas: {
        include: {
          tipo: true
        }
      }
    }
  });
}

/**
 * Update event
 */
export async function updateEvent(id, data) {
  const { ods = [], areas = [], ...eventData } = data;

  // Remove existing relations
  await prisma.eventODS.deleteMany({
    where: { eventId: id }
  });

  await prisma.eventArea.deleteMany({
    where: { eventId: id }
  });

  return prisma.event.update({
    where: { id },
    data: {
      ...eventData,
      ods: {
        create: ods.map(odsId => ({
          odsId
        }))
      },
      areas: {
        create: areas.map(areaId => ({
          areaAtuacaoTipoId: areaId
        }))
      }
    },
    include: {
      ngo: true,
      ods: {
        include: {
          ods: true
        }
      },
      areas: {
        include: {
          tipo: true
        }
      }
    }
  });
}

/**
 * Delete event
 */
export async function deleteEvent(id) {
  return prisma.event.delete({
    where: { id }
  });
}

/**
 * Get event types enum values
 */
export function getEventTypes() {
  return [
    { value: 'PRESENCIAL', label: 'Presencial' },
    { value: 'REMOTO', label: 'Remoto' },
    { value: 'HIBRIDO', label: 'Híbrido' }
  ];
}
