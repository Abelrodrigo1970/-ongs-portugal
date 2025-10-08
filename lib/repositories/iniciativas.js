import { prisma } from '@/lib/db';

export async function getIniciativas(filters = {}) {
  try {
    const {
      empresaId = null,
      causaId = null,
      tipoApoio = null,
      status = null,
      dataInicio = null,
      page = 1,
      limit = 12
    } = filters;

    const where = {
      AND: []
    };

    if (empresaId) {
      where.AND.push({ empresaId });
    }

    if (causaId) {
      where.AND.push({ causaId });
    }

    if (tipoApoio) {
      where.AND.push({ tipoApoio });
    }

    if (status) {
      where.AND.push({ status });
    }

    if (dataInicio) {
      where.AND.push({
        dataInicio: { gte: new Date(dataInicio) }
      });
    }

    const [iniciativas, total] = await Promise.all([
      prisma.iniciativa.findMany({
        where,
        include: {
          empresa: {
            select: {
              id: true,
              nome: true,
              logo: true
            }
          },
          causa: true,
          _count: {
            select: {
              inscricoes: true
            }
          }
        },
        orderBy: { dataInicio: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.iniciativa.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return {
      iniciativas,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    };
  } catch (error) {
    console.error('Error in getIniciativas:', error);
    return {
      iniciativas: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 }
    };
  }
}

export async function getIniciativaById(id) {
  try {
    return await prisma.iniciativa.findUnique({
      where: { id },
      include: {
        empresa: true,
        causa: true,
        inscricoes: {
          include: {
            colaborador: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in getIniciativaById:', error);
    return null;
  }
}
