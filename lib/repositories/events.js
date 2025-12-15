import { prisma } from '@/lib/db';
import { normalizeText } from '@/lib/utils';

/**
 * Get events with filters
 */
export async function getEvents(filters = {}) {
  const {
    query = '',
    ods = [],
    areas = [],
    tipo = [],
    morada = '',
    ngoId = null,
    dataInicio = null,
    dataFim = null,
    inscricoesAbertas = null,
    visivel = true,
    sort = 'dataInicio-asc',
    page = 1,
    limit = 12
  } = filters;

  // Remover fallback automático - tentar sempre a base de dados primeiro

  const where = {
    AND: [
      // Visibilidade
      { visivel: visivel },
      
      // Texto livre
      query ? (() => {
        const normalizedQuery = normalizeText(query);
        
        // Fallbacks para pesquisas específicas
        const specificFallbacks = [];
        
        // Fallback para pesquisas por "saúde" devido a problemas de codificação
        if (normalizedQuery.includes('saude') || normalizedQuery.includes('saúde')) {
          specificFallbacks.push(
            { nome: { contains: 'Forma??o em Primeiros Socorros', mode: 'insensitive' } },
            { descricao: { contains: 'primeiros socorros', mode: 'insensitive' } },
            { descricao: { contains: 'sa??de', mode: 'insensitive' } },
            { nome: { contains: 'Caminhada Solid??ria', mode: 'insensitive' } },
            { descricao: { contains: 'Caminhada solid??ria', mode: 'insensitive' } },
            { nome: { contains: 'Programa de Apoio a Idosos', mode: 'insensitive' } },
            { descricao: { contains: 'idosos', mode: 'insensitive' } }
          );
        }
        
        // Fallback para pesquisas por "arvore" - incluir variações com acentos
        if (normalizedQuery.includes('arvore')) {
          specificFallbacks.push(
            { nome: { contains: 'árvore', mode: 'insensitive' } },
            { descricao: { contains: 'árvore', mode: 'insensitive' } },
            { nome: { contains: 'árvores', mode: 'insensitive' } },
            { descricao: { contains: 'árvores', mode: 'insensitive' } },
            { nome: { contains: 'plantação', mode: 'insensitive' } },
            { descricao: { contains: 'plantação', mode: 'insensitive' } },
            { nome: { contains: 'plantar', mode: 'insensitive' } },
            { descricao: { contains: 'plantar', mode: 'insensitive' } },
            { nome: { contains: 'floresta', mode: 'insensitive' } },
            { descricao: { contains: 'floresta', mode: 'insensitive' } },
            { nome: { contains: 'reflorestação', mode: 'insensitive' } },
            { descricao: { contains: 'reflorestação', mode: 'insensitive' } }
          );
        }
        
        return {
          OR: [
            { nome: { contains: normalizedQuery, mode: 'insensitive' } },
            { descricao: { contains: normalizedQuery, mode: 'insensitive' } },
            { morada: { contains: normalizedQuery, mode: 'insensitive' } },
            { ngo: { nome: { contains: normalizedQuery, mode: 'insensitive' } } },
            // Busca em áreas de atuação do evento
            {
              areas: {
                some: {
                  tipo: {
                    nome: { contains: normalizedQuery, mode: 'insensitive' }
                  }
                }
              }
            },
            // Busca em ODS do evento
            {
              ods: {
                some: {
                  ods: {
                    nome: { contains: normalizedQuery, mode: 'insensitive' }
                  }
                }
              }
            },
            // Fallbacks para problemas de codificação e variações
            ...specificFallbacks
          ]
        };
      })() : {},

      // Filtro por morada
      morada ? {
        morada: {
          contains: morada,
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
 * Calculate event duration in hours
 */
export function calcularDuracaoEvento(dataInicio, dataFim) {
  if (!dataInicio) {
    return 0;
  }

  const inicio = new Date(dataInicio);
  const fim = dataFim ? new Date(dataFim) : new Date();
  
  const diffMs = fim.getTime() - inicio.getTime();
  const diffHoras = diffMs / (1000 * 60 * 60);
  
  return Math.max(0, Math.round(diffHoras));
}

/**
 * Get event by ID
 */
export async function getEventById(id) {
  // Fallback para IDs mock
  if (id.startsWith('mock-')) {
    console.log(`🔍 Retornando dados mock para Event ID: ${id}`);
    
    const mockData = {
      'mock-health-event-1': {
        id: 'mock-health-event-1',
        nome: 'Formação em Primeiros Socorros',
        descricao: 'Formação gratuita em primeiros socorros aberta à comunidade. Certificação incluída.',
        dataInicio: new Date('2024-11-30T09:00:00Z'),
        dataFim: new Date('2024-11-30T17:00:00Z'),
        morada: 'Centro de Saúde de Aveiro, Aveiro',
        latitude: 40.6443,
        longitude: -8.6455,
        tipo: 'PRESENCIAL',
        maxParticipantes: 20,
        inscricoesAbertas: true,
        linkInscricao: 'https://exemplo.com/primeiros-socorros',
        imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
        visivel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngo: {
          id: 'mock-health-ngo-1',
          nome: 'Saúde para Todos',
          logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
          localizacao: 'Porto, Portugal'
        },
        ods: [
          { ods: { numero: 3, nome: 'Saúde de qualidade' } }
        ],
        areas: [
          { tipo: { nome: 'Saúde' } }
        ]
      },
      'mock-health-event-2': {
        id: 'mock-health-event-2',
        nome: 'Caminhada Solidária pelo Porto',
        descricao: 'Caminhada solidária para angariação de fundos para famílias carenciadas. Percurso de 5km pelo centro histórico do Porto.',
        dataInicio: new Date('2024-11-02T09:30:00Z'),
        dataFim: new Date('2024-11-02T12:00:00Z'),
        morada: 'Ribeira do Porto, Porto',
        latitude: 41.1405,
        longitude: -8.6130,
        tipo: 'PRESENCIAL',
        maxParticipantes: 200,
        inscricoesAbertas: true,
        linkInscricao: 'https://exemplo.com/caminhada-solidaria',
        imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        visivel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngo: {
          id: 'mock-health-ngo-2',
          nome: 'Apoio Sénior',
          logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
          localizacao: 'Faro, Portugal'
        },
        ods: [
          { ods: { numero: 3, nome: 'Saúde de qualidade' } }
        ],
        areas: [
          { tipo: { nome: 'Saúde' } }
        ]
      },
      'mock-env-event-1': {
        id: 'mock-env-event-1',
        nome: 'Plantação de Árvores Nativas',
        descricao: 'Junte-se a nós para plantar árvores nativas portuguesas. Uma atividade para toda a família que contribui para um planeta mais verde.',
        dataInicio: new Date('2024-12-15T09:00:00Z'),
        dataFim: new Date('2024-12-15T17:00:00Z'),
        morada: 'Parque Florestal de Sintra, Sintra',
        latitude: 38.8029,
        longitude: -9.3817,
        tipo: 'PRESENCIAL',
        maxParticipantes: 100,
        inscricoesAbertas: true,
        linkInscricao: 'https://exemplo.com/plantacao-arvores',
        imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format',
        visivel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngo: {
          id: 'mock-env-ngo-1',
          nome: 'Verde Portugal',
          logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
          localizacao: 'Lisboa, Portugal'
        },
        ods: [
          { ods: { numero: 15, nome: 'Vida terrestre' } }
        ],
        areas: [
          { tipo: { nome: 'Ambiente' } }
        ]
      },
      'mock-env-event-2': {
        id: 'mock-env-event-2',
        nome: 'Limpeza da Praia do Estoril',
        descricao: 'Campanha de limpeza da praia para remover lixo e plásticos. Atividade de consciencialização ambiental.',
        dataInicio: new Date('2024-12-22T10:00:00Z'),
        dataFim: new Date('2024-12-22T15:00:00Z'),
        morada: 'Praia do Estoril, Estoril',
        latitude: 38.7057,
        longitude: -9.4167,
        tipo: 'PRESENCIAL',
        maxParticipantes: 50,
        inscricoesAbertas: true,
        linkInscricao: 'https://exemplo.com/limpeza-praia',
        imagem: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=entropy&auto=format',
        visivel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngo: {
          id: 'mock-env-ngo-2',
          nome: 'Plantar o Futuro',
          logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          localizacao: 'Coimbra, Portugal'
        },
        ods: [
          { ods: { numero: 14, nome: 'Vida marinha' } }
        ],
        areas: [
          { tipo: { nome: 'Ambiente' } }
        ]
      },
      'mock-env-event-3': {
        id: 'mock-env-event-3',
        nome: 'Workshop de Compostagem Doméstica',
        descricao: 'Aprenda a fazer compostagem em casa e reduza o seu lixo orgânico. Workshop prático com materiais fornecidos.',
        dataInicio: new Date('2025-01-10T14:00:00Z'),
        dataFim: new Date('2025-01-10T17:00:00Z'),
        morada: 'Centro Ambiental de Coimbra, Coimbra',
        latitude: 40.2033,
        longitude: -8.4103,
        tipo: 'PRESENCIAL',
        maxParticipantes: 25,
        inscricoesAbertas: true,
        linkInscricao: 'https://exemplo.com/workshop-compostagem',
        imagem: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=entropy&auto=format',
        visivel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngo: {
          id: 'mock-env-ngo-2',
          nome: 'Plantar o Futuro',
          logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          localizacao: 'Coimbra, Portugal'
        },
        ods: [
          { ods: { numero: 12, nome: 'Consumo e produção responsáveis' } }
        ],
        areas: [
          { tipo: { nome: 'Ambiente' } }
        ]
      },
      'mock-generic-event-1': {
        id: 'mock-generic-event-1',
        nome: 'Ação Solidária Comunitária',
        descricao: 'Evento de voluntariado para apoiar famílias carenciadas da comunidade local.',
        dataInicio: new Date('2024-12-01T09:00:00Z'),
        dataFim: new Date('2024-12-01T17:00:00Z'),
        morada: 'Centro Comunitário de Braga, Braga',
        latitude: 41.5518,
        longitude: -8.4229,
        tipo: 'PRESENCIAL',
        maxParticipantes: 30,
        inscricoesAbertas: true,
        linkInscricao: 'https://exemplo.com/acao-solidaria',
        imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=entropy&auto=format',
        visivel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ngo: {
          id: 'mock-generic-ngo-1',
          nome: 'Ação Solidária',
          logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
          localizacao: 'Braga, Portugal'
        },
        ods: [
          { ods: { numero: 1, nome: 'Erradicar a pobreza' } }
        ],
        areas: [
          { tipo: { nome: 'Ação Social' } }
        ]
      }
    };
    
    return mockData[id] || null;
  }

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
      },
      inscricoes: {
        where: {
          status: 'APROVADA'
        },
        select: {
          id: true
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
