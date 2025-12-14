import { prisma } from '@/lib/db';
import { normalizeText } from '@/lib/utils';

/**
 * Get colaboradores with filters
 */
export async function getColaboradores(filters = {}) {
  const {
    query = '',
    empresaId = null,
    ativo = null,
    page = 1,
    limit = 50
  } = filters;

  const where = {
    AND: [
      // Filtro por empresa
      empresaId ? { empresaId } : {},
      
      // Filtro por status ativo
      ativo !== null ? { ativo } : {},
      
      // Busca por texto
      query ? {
        OR: [
          { nome: { contains: normalizeText(query), mode: 'insensitive' } },
          { email: { contains: normalizeText(query), mode: 'insensitive' } },
          { departamento: { contains: normalizeText(query), mode: 'insensitive' } },
          { cargo: { contains: normalizeText(query), mode: 'insensitive' } },
          { empresa: { nome: { contains: normalizeText(query), mode: 'insensitive' } } }
        ]
      } : {}
    ]
  };

  const skip = (page - 1) * limit;

  const [colaboradores, total] = await Promise.all([
    prisma.colaboradorEmpresa.findMany({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            nome: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.colaboradorEmpresa.count({ where })
  ]);

  return {
    colaboradores,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get colaborador by ID
 */
export async function getColaboradorById(id) {
  return prisma.colaboradorEmpresa.findUnique({
    where: { id },
    include: {
      empresa: true
    }
  });
}

/**
 * Create colaborador
 */
export async function createColaborador(data) {
  const { empresaId, nome, email, departamento, cargo, avatar, ativo = true } = data;

  // Verificar se já existe colaborador com mesmo email na empresa
  const existing = await prisma.colaboradorEmpresa.findUnique({
    where: {
      empresaId_email: {
        empresaId,
        email
      }
    }
  });

  if (existing) {
    throw new Error('Já existe um colaborador com este email nesta empresa');
  }

  return prisma.colaboradorEmpresa.create({
    data: {
      empresaId,
      nome,
      email,
      departamento: departamento || null,
      cargo: cargo || null,
      avatar: avatar || null,
      ativo: ativo !== undefined ? ativo : true
    },
    include: {
      empresa: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });
}

/**
 * Update colaborador
 */
export async function updateColaborador(id, data) {
  const { empresaId, nome, email, departamento, cargo, avatar, ativo } = data;

  // Se o email ou empresa mudou, verificar se já existe
  if (email || empresaId) {
    const current = await prisma.colaboradorEmpresa.findUnique({
      where: { id },
      select: { empresaId: true, email: true }
    });

    const finalEmpresaId = empresaId || current.empresaId;
    const finalEmail = email || current.email;

    if (finalEmail !== current.email || finalEmpresaId !== current.empresaId) {
      const existing = await prisma.colaboradorEmpresa.findUnique({
        where: {
          empresaId_email: {
            empresaId: finalEmpresaId,
            email: finalEmail
          }
        }
      });

      if (existing && existing.id !== id) {
        throw new Error('Já existe um colaborador com este email nesta empresa');
      }
    }
  }

  const updateData = {};
  if (nome !== undefined) updateData.nome = nome;
  if (email !== undefined) updateData.email = email;
  if (departamento !== undefined) updateData.departamento = departamento || null;
  if (cargo !== undefined) updateData.cargo = cargo || null;
  if (avatar !== undefined) updateData.avatar = avatar || null;
  if (ativo !== undefined) updateData.ativo = ativo;
  if (empresaId !== undefined) updateData.empresaId = empresaId;

  return prisma.colaboradorEmpresa.update({
    where: { id },
    data: updateData,
    include: {
      empresa: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });
}

/**
 * Delete colaborador
 */
export async function deleteColaborador(id) {
  return prisma.colaboradorEmpresa.delete({
    where: { id }
  });
}

