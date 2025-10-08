import { prisma } from '@/lib/db';

export async function getReunioes(filters = {}) {
  try {
    const {
      empresaId = null,
      ongId = null,
      status = null,
      dataInicio = null,
      page = 1,
      limit = 12
    } = filters;

    const where = { AND: [] };

    if (empresaId) where.AND.push({ empresaId });
    if (ongId) where.AND.push({ ongId });
    if (status) where.AND.push({ status });
    if (dataInicio) {
      where.AND.push({ startAt: { gte: new Date(dataInicio) } });
    }

    const [reunioes, total] = await Promise.all([
      prisma.reuniao.findMany({
        where,
        include: {
          empresa: {
            select: {
              id: true,
              nome: true,
              logo: true
            }
          },
          ong: {
            select: {
              id: true,
              nome: true,
              logo: true
            }
          },
          proposta: {
            select: {
              id: true,
              titulo: true
            }
          }
        },
        orderBy: { startAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.reuniao.count({ where })
    ]);

    return {
      reunioes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getReunioes:', error);
    return {
      reunioes: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 }
    };
  }
}

export async function createReuniao(data) {
  try {
    return await prisma.reuniao.create({
      data,
      include: {
        empresa: true,
        ong: true
      }
    });
  } catch (error) {
    console.error('Error in createReuniao:', error);
    throw error;
  }
}
