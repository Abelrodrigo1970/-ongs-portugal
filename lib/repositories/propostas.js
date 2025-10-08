import { prisma } from '@/lib/db';

export async function getPropostas(filters = {}) {
  try {
    const {
      empresaId = null,
      ongId = null,
      status = null,
      page = 1,
      limit = 12
    } = filters;

    const where = { AND: [] };

    if (empresaId) where.AND.push({ empresaId });
    if (ongId) where.AND.push({ ongId });
    if (status) where.AND.push({ status });

    const [propostas, total] = await Promise.all([
      prisma.proposta.findMany({
        where,
        include: {
          ong: {
            select: {
              id: true,
              nome: true,
              logo: true,
              localizacao: true
            }
          },
          empresa: {
            select: {
              id: true,
              nome: true,
              logo: true
            }
          },
          iniciativa: {
            select: {
              id: true,
              titulo: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.proposta.count({ where })
    ]);

    return {
      propostas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getPropostas:', error);
    return {
      propostas: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 }
    };
  }
}

export async function getPropostaById(id) {
  try {
    return await prisma.proposta.findUnique({
      where: { id },
      include: {
        ong: true,
        empresa: true,
        iniciativa: true,
        reunioes: true
      }
    });
  } catch (error) {
    console.error('Error in getPropostaById:', error);
    return null;
  }
}

export async function createProposta(data) {
  try {
    return await prisma.proposta.create({
      data,
      include: {
        ong: true,
        empresa: true
      }
    });
  } catch (error) {
    console.error('Error in createProposta:', error);
    throw error;
  }
}

export async function updatePropostaStatus(id, status, respostaEmpresa = null) {
  try {
    return await prisma.proposta.update({
      where: { id },
      data: {
        status,
        respostaEmpresa,
        respondidoEm: new Date()
      }
    });
  } catch (error) {
    console.error('Error in updatePropostaStatus:', error);
    throw error;
  }
}
