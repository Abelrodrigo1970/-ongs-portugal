import { prisma } from '@/lib/db';
import { normalizeText } from '@/lib/utils';

export async function getNGOs(filters = {}) {
  try {
    const {
      query = '',
      ods = [],
      areas = [],
      colaboracao = [],
      localizacao = '',
      visivel = true,
      sort = 'nome-asc',
      page = 1,
      limit = 12
    } = filters;

    // Construir condições where
    const where = {
      AND: []
    };

    // Filtro de visibilidade
    where.AND.push({ visivel });

    // Filtro de texto (busca em nome, descrição, missão, localização, áreas e ODS)
    if (query) {
      const normalizedQuery = normalizeText(query);
      where.AND.push({
        OR: [
          { nome: { contains: normalizedQuery, mode: 'insensitive' } },
          { descricao: { contains: normalizedQuery, mode: 'insensitive' } },
          { missao: { contains: normalizedQuery, mode: 'insensitive' } },
          { localizacao: { contains: normalizedQuery, mode: 'insensitive' } },
          // Busca em áreas de atuação
          {
            areaAtuacao: {
              some: {
                tipo: {
                  nome: { contains: normalizedQuery, mode: 'insensitive' }
                }
              }
            }
          },
          // Busca em ODS
          {
            ods: {
              some: {
                ods: {
                  nome: { contains: normalizedQuery, mode: 'insensitive' }
                }
              }
            }
          }
        ]
      });
    }

    // Filtro por localização
    if (localizacao) {
      where.AND.push({
        localizacao: {
          contains: localizacao,
          mode: 'insensitive'
        }
      });
    }

    // Filtro por ODS
    if (ods.length > 0) {
      where.AND.push({
        ods: {
          some: {
            odsId: { in: ods }
          }
        }
      });
    }

    // Filtro por áreas de atuação
    if (areas.length > 0) {
      where.AND.push({
        areaAtuacao: {
          some: {
            areaAtuacaoTipoId: { in: areas }
          }
        }
      });
    }

    // Filtro por tipos de colaboração
    if (colaboracao.length > 0) {
      where.AND.push({
        colaboracao: {
          some: {
            colaboracaoTipoId: { in: colaboracao }
          }
        }
      });
    }

    // Configurar ordenação
    let orderBy = { nome: 'asc' };
    if (sort === 'nome-desc') orderBy = { nome: 'desc' };
    if (sort === 'data-asc') orderBy = { createdAt: 'asc' };
    if (sort === 'data-desc') orderBy = { createdAt: 'desc' };

    // Buscar NGOs e contar total
    const [ngos, total] = await Promise.all([
      prisma.nGO.findMany({
        where,
        include: {
          ods: {
            include: {
              ods: true
            }
          },
          areaAtuacao: {
            include: {
              tipo: true
            }
          },
          colaboracao: {
            include: {
              tipo: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.nGO.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return {
      ngos,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  } catch (error) {
    console.error('Error in getNGOs:', error);
    return {
      ngos: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      }
    };
  }
}

// ... resto das funções permanecem iguais ...
export async function getFeaturedNGOs(limit = 6) {
  try {
    return await prisma.nGO.findMany({
      where: { visivel: true },
      include: {
        ods: {
          include: {
            ods: true
          }
        },
        areaAtuacao: {
          include: {
            tipo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Error in getFeaturedNGOs:', error);
    return [];
  }
}

export async function getNGOById(id) {
  try {
    return await prisma.nGO.findUnique({
      where: { id },
      include: {
        ods: {
          include: {
            ods: true
          }
        },
        areaAtuacao: {
          include: {
            tipo: true
          }
        },
        colaboracao: {
          include: {
            tipo: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in getNGOById:', error);
    return null;
  }
}

export async function getRelatedNGOs(ngoId, limit = 4) {
  try {
    return await prisma.nGO.findMany({
      where: {
        id: { not: ngoId },
        visivel: true
      },
      include: {
        ods: {
          include: {
            ods: true
          }
        },
        areaAtuacao: {
          include: {
            tipo: true
          }
        }
      },
      take: limit
    });
  } catch (error) {
    console.error('Error in getRelatedNGOs:', error);
    return [];
  }
}

export async function createNGO(data) {
  return { success: true };
}

export async function updateNGO(id, data) {
  return { success: true };
}

export async function deleteNGO(id) {
  return { success: true };
}

export async function toggleNGOVisibility(id) {
  return { success: true };
}