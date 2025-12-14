import { prisma } from '@/lib/db';

export async function getEmpresas(filters = {}) {
  try {
    const {
      query = '',
      ods = [],
      causas = [],
      tiposApoio = [],
      localizacao = '',
      visivel = true,
      sort = 'nome-asc',
      page = 1,
      limit = 12
    } = filters;

    const where = {
      AND: []
    };

    // Filtro de visibilidade (só aplica se visivel não for undefined)
    if (visivel !== undefined) {
      where.AND.push({ visivel });
    }

    // Filtro de texto
    if (query) {
      where.AND.push({
        OR: [
          { nome: { contains: query, mode: 'insensitive' } },
          { descricao: { contains: query, mode: 'insensitive' } },
          { missao: { contains: query, mode: 'insensitive' } },
          { localizacao: { contains: query, mode: 'insensitive' } },
          { setor: { contains: query, mode: 'insensitive' } }
        ]
      });
    }

    // Filtro por localização
    if (localizacao) {
      where.AND.push({
        localizacao: { contains: localizacao, mode: 'insensitive' }
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

    // Filtro por causas
    if (causas.length > 0) {
      where.AND.push({
        causas: {
          some: {
            causaId: { in: causas }
          }
        }
      });
    }

    // Filtro por tipos de apoio
    if (tiposApoio.length > 0) {
      where.AND.push({
        tiposApoio: {
          some: {
            tipoApoioId: { in: tiposApoio }
          }
        }
      });
    }

    // Configurar ordenação
    let orderBy = { nome: 'asc' };
    if (sort === 'nome-desc') orderBy = { nome: 'desc' };
    if (sort === 'recent') orderBy = { createdAt: 'desc' };

    // Buscar empresas e contar total
    const [empresas, total] = await Promise.all([
      prisma.empresa.findMany({
        where,
        include: {
          ods: {
            include: {
              ods: true
            }
          },
          causas: {
            include: {
              causa: true
            }
          },
          tiposApoio: {
            include: {
              tipoApoio: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.empresa.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return {
      empresas,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  } catch (error) {
    console.error('Error in getEmpresas:', error);
    return {
      empresas: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      }
    };
  }
}

export async function getEmpresaById(id) {
  try {
    return await prisma.empresa.findUnique({
      where: { id },
      include: {
        ods: {
          include: {
            ods: true
          }
        },
        causas: {
          include: {
            causa: true
          }
        },
        tiposApoio: {
          include: {
            tipoApoio: true
          }
        },
        iniciativas: {
          where: {
            status: 'ATIVA'
          },
          include: {
            causa: true
          },
          orderBy: {
            dataInicio: 'asc'
          },
          take: 5
        },
        estatisticas: {
          orderBy: [
            { periodoAno: 'desc' },
            { periodoMes: 'desc' }
          ],
          take: 12
        }
      }
    });
  } catch (error) {
    console.error('Error in getEmpresaById:', error);
    return null;
  }
}

export async function getFeaturedEmpresas(limit = 6) {
  try {
    return await prisma.empresa.findMany({
      where: { visivel: true },
      include: {
        ods: {
          include: {
            ods: true
          }
        },
        causas: {
          include: {
            causa: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Error in getFeaturedEmpresas:', error);
    return [];
  }
}

export async function getEmpresaDashboard(empresaId) {
  try {
    // KPIs principais
    const [empresa, totalIniciativas, totalColaboradores, totalPropostas, estatisticasRecentes] = await Promise.all([
      prisma.empresa.findUnique({
        where: { id: empresaId },
        include: {
          ods: {
            include: {
              ods: true
            }
          }
        }
      }),
      prisma.iniciativa.count({
        where: { empresaId, status: 'ATIVA' }
      }),
      prisma.colaboradorEmpresa.count({
        where: { empresaId, ativo: true }
      }),
      prisma.proposta.count({
        where: { empresaId, status: 'PENDENTE' }
      }),
      prisma.estatisticaImpactoEmpresa.aggregate({
        where: { empresaId },
        _sum: {
          horasVoluntariado: true,
          numProjetos: true,
          numVoluntarios: true,
          valorDoacoes: true
        }
      })
    ]);

    return {
      empresa,
      kpis: {
        totalIniciativasAtivas: totalIniciativas,
        totalColaboradores,
        totalPropostasPendentes: totalPropostas,
        totalHorasVoluntariado: estatisticasRecentes._sum.horasVoluntariado || 0,
        totalProjetos: estatisticasRecentes._sum.numProjetos || 0,
        totalVoluntarios: estatisticasRecentes._sum.numVoluntarios || 0,
        totalDoacoes: estatisticasRecentes._sum.valorDoacoes || 0
      }
    };
  } catch (error) {
    console.error('Error in getEmpresaDashboard:', error);
    return null;
  }
}

/**
 * Create empresa
 */
export async function createEmpresa(data) {
  const { ods = [], causas = [], tiposApoio = [], ...empresaData } = data;

  const empresa = await prisma.empresa.create({
    data: {
      ...empresaData,
      ods: {
        create: ods.map((odsId) => ({ odsId }))
      },
      causas: {
        create: causas.map((causaId) => ({ causaId }))
      },
      tiposApoio: {
        create: tiposApoio.map((tipoApoioId) => ({ tipoApoioId }))
      }
    },
    include: {
      ods: {
        include: {
          ods: true
        }
      },
      causas: {
        include: {
          causa: true
        }
      },
      tiposApoio: {
        include: {
          tipoApoio: true
        }
      }
    }
  });

  return empresa;
}

/**
 * Update empresa
 */
export async function updateEmpresa(id, data) {
  const { ods = [], causas = [], tiposApoio = [], ...empresaData } = data;

  // Atualizar relações se fornecidas
  if (ods.length > 0) {
    await prisma.empresaODS.deleteMany({ where: { empresaId: id } });
  }
  if (causas.length > 0) {
    await prisma.empresaCausa.deleteMany({ where: { empresaId: id } });
  }
  if (tiposApoio.length > 0) {
    await prisma.empresaTipoApoio.deleteMany({ where: { empresaId: id } });
  }

  const updateData = { ...empresaData };

  if (ods.length > 0) {
    updateData.ods = {
      create: ods.map((odsId) => ({ odsId }))
    };
  }

  if (causas.length > 0) {
    updateData.causas = {
      create: causas.map((causaId) => ({ causaId }))
    };
  }

  if (tiposApoio.length > 0) {
    updateData.tiposApoio = {
      create: tiposApoio.map((tipoApoioId) => ({ tipoApoioId }))
    };
  }

  return prisma.empresa.update({
    where: { id },
    data: updateData,
    include: {
      ods: {
        include: {
          ods: true
        }
      },
      causas: {
        include: {
          causa: true
        }
      },
      tiposApoio: {
        include: {
          tipoApoio: true
        }
      }
    }
  });
}

/**
 * Delete empresa
 */
export async function deleteEmpresa(id) {
  return prisma.empresa.delete({
    where: { id }
  });
}