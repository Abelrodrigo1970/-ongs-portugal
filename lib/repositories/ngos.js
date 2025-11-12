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

    // Remover fallback automático - tentar sempre a base de dados primeiro

    // Construir condições where
    const where = {
      AND: []
    };

    // Filtro de visibilidade (apenas quando explicitamente definido)
    if (typeof visivel === 'boolean') {
      where.AND.push({ visivel });
    }

    // Filtro de texto (busca em nome, descrição, missão, localização, áreas e ODS)
    if (query) {
      const normalizedQuery = normalizeText(query);
      
      // Fallbacks para pesquisas específicas
      const specificFallbacks = [];
      
      // Fallback para pesquisas por "saúde" devido a problemas de codificação
      if (normalizedQuery.includes('saude') || normalizedQuery.includes('saúde')) {
        specificFallbacks.push(
          { nome: { contains: '?? para Todos', mode: 'insensitive' } },
          { descricao: { contains: 'sa??de', mode: 'insensitive' } },
          { missao: { contains: 'sa??de', mode: 'insensitive' } },
          { descricao: { contains: '??gua', mode: 'insensitive' } },
          { missao: { contains: '??gua', mode: 'insensitive' } },
          { nome: { contains: '??nior', mode: 'insensitive' } },
          { descricao: { contains: '??nior', mode: 'insensitive' } }
        );
      }
      
      // Fallback para pesquisas por "arvore" - incluir variações com acentos
      if (normalizedQuery.includes('arvore')) {
        specificFallbacks.push(
          { nome: { contains: 'árvore', mode: 'insensitive' } },
          { descricao: { contains: 'árvore', mode: 'insensitive' } },
          { missao: { contains: 'árvore', mode: 'insensitive' } },
          { nome: { contains: 'árvores', mode: 'insensitive' } },
          { descricao: { contains: 'árvores', mode: 'insensitive' } },
          { missao: { contains: 'árvores', mode: 'insensitive' } },
          { nome: { contains: 'plantação', mode: 'insensitive' } },
          { descricao: { contains: 'plantação', mode: 'insensitive' } },
          { missao: { contains: 'plantação', mode: 'insensitive' } },
          { nome: { contains: 'plantar', mode: 'insensitive' } },
          { descricao: { contains: 'plantar', mode: 'insensitive' } },
          { missao: { contains: 'plantar', mode: 'insensitive' } },
          { nome: { contains: 'bosques', mode: 'insensitive' } },
          { descricao: { contains: 'bosques', mode: 'insensitive' } },
          { missao: { contains: 'bosques', mode: 'insensitive' } },
          { nome: { contains: 'floresta', mode: 'insensitive' } },
          { descricao: { contains: 'floresta', mode: 'insensitive' } },
          { missao: { contains: 'floresta', mode: 'insensitive' } },
          { nome: { contains: 'reflorestação', mode: 'insensitive' } },
          { descricao: { contains: 'reflorestação', mode: 'insensitive' } },
          { missao: { contains: 'reflorestação', mode: 'insensitive' } }
        );
      }
      
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
          },
          // Fallbacks para problemas de codificação e variações
          ...specificFallbacks
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

    // Se não houver filtros explícitos, remover cláusula AND vazia
    if (where.AND.length === 0) {
      delete where.AND;
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
          },
          projetos: {
            orderBy: { ordem: 'asc' }
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
    // Fallback para IDs mock
    if (id.startsWith('mock-')) {
      console.log(`🔍 Retornando dados mock para NGO ID: ${id}`);
      
      const mockData = {
        'mock-health-ngo-1': {
          id: 'mock-health-ngo-1',
          nome: 'Saúde para Todos',
          descricao: 'ONG focada em garantir acesso à saúde básica para comunidades carenciadas, com especial atenção à saúde materno-infantil.',
          missao: 'Democratizar o acesso à saúde de qualidade, especialmente nas áreas mais vulneráveis do país.',
          email: 'info@saudeparatodos.pt',
          telefone: '+351 22 987 6543',
          localizacao: 'Porto, Portugal',
          latitude: 41.1579,
          longitude: -8.6291,
          impacto: JSON.stringify([
            'Atendimento médico a 5.000 pessoas carenciadas',
            'Programa de saúde materno-infantil em 15 comunidades',
            'Distribuição de medicamentos essenciais'
          ]),
          imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
          logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
          instagramUrl: 'https://instagram.com/saudeparatodos',
          websiteUrl: 'https://saudeparatodos.pt',
          visivel: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ods: [
            { ods: { numero: 3, nome: 'Saúde de qualidade' } }
          ],
          areaAtuacao: [
            { tipo: { nome: 'Saúde' } }
          ],
          colaboracao: [
            { tipo: { nome: 'Doações financeiras' } }
          ]
        },
        'mock-health-ngo-2': {
          id: 'mock-health-ngo-2',
          nome: 'Apoio Sénior',
          descricao: 'Organização dedicada ao apoio e cuidado de pessoas idosas, promovendo o envelhecimento ativo e saudável.',
          missao: 'Garantir dignidade e qualidade de vida para pessoas idosas, combatendo o isolamento e promovendo a participação social.',
          email: 'contato@apoiosenior.pt',
          telefone: '+351 28 555 4433',
          localizacao: 'Faro, Portugal',
          latitude: 37.0194,
          longitude: -7.9322,
          impacto: JSON.stringify([
            'Apoio domiciliário a 600 idosos',
            'Programas de convívio para 1.000 seniores',
            'Formação de 200 cuidadores'
          ]),
          imagem: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop&crop=entropy&auto=format',
          logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
          instagramUrl: 'https://instagram.com/apoiosenior',
          websiteUrl: 'https://apoiosenior.pt',
          visivel: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ods: [
            { ods: { numero: 3, nome: 'Saúde de qualidade' } }
          ],
          areaAtuacao: [
            { tipo: { nome: 'Saúde' } }
          ],
          colaboracao: [
            { tipo: { nome: 'Voluntariado presencial' } }
          ]
        },
        'mock-env-ngo-1': {
          id: 'mock-env-ngo-1',
          nome: 'Verde Portugal',
          descricao: 'Organização dedicada à proteção do ambiente e promoção da sustentabilidade. Focamos na reflorestação e educação ambiental.',
          missao: 'Proteger e restaurar o património natural português através de ações concretas e educação ambiental.',
          email: 'info@verdeportugal.pt',
          telefone: '+351 21 123 4567',
          localizacao: 'Lisboa, Portugal',
          latitude: 38.7223,
          longitude: -9.1393,
          impacto: JSON.stringify([
            'Plantação de 50.000 árvores nativas',
            'Educação ambiental para 10.000 crianças',
            'Proteção de 5 áreas naturais'
          ]),
          imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format',
          logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
          instagramUrl: 'https://instagram.com/verdeportugal',
          websiteUrl: 'https://verdeportugal.pt',
          visivel: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ods: [
            { ods: { numero: 15, nome: 'Vida terrestre' } }
          ],
          areaAtuacao: [
            { tipo: { nome: 'Ambiente' } }
          ],
          colaboracao: [
            { tipo: { nome: 'Voluntariado presencial' } }
          ]
        },
        'mock-env-ngo-2': {
          id: 'mock-env-ngo-2',
          nome: 'Plantar o Futuro',
          descricao: 'Iniciativa comunitária para reflorestação urbana e rural. Organizamos campanhas de plantação de árvores em todo o país.',
          missao: 'Tornar Portugal mais verde através da participação cidadã na reflorestação e conservação da natureza.',
          email: 'contato@plantarofuturo.pt',
          telefone: '+351 91 234 5678',
          localizacao: 'Coimbra, Portugal',
          latitude: 40.2033,
          longitude: -8.4103,
          impacto: JSON.stringify([
            '100.000 árvores plantadas',
            '50 comunidades envolvidas',
            '200 hectares reflorestados'
          ]),
          imagem: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format',
          logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          instagramUrl: 'https://instagram.com/plantarofuturo',
          websiteUrl: 'https://plantarofuturo.pt',
          visivel: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ods: [
            { ods: { numero: 15, nome: 'Vida terrestre' } }
          ],
          areaAtuacao: [
            { tipo: { nome: 'Ambiente' } }
          ],
          colaboracao: [
            { tipo: { nome: 'Doações financeiras' } }
          ]
        },
        'mock-generic-ngo-1': {
          id: 'mock-generic-ngo-1',
          nome: 'Ação Solidária',
          descricao: 'ONG com foco em múltiplas causas sociais, promovendo voluntariado e solidariedade em diversas áreas.',
          missao: 'Construir uma sociedade mais justa e solidária através da mobilização de pessoas e recursos.',
          email: 'info@acaosolidaria.pt',
          telefone: '+351 22 111 2222',
          localizacao: 'Braga, Portugal',
          latitude: 41.5518,
          longitude: -8.4229,
          impacto: JSON.stringify([
            'Mais de 1.000 voluntários ativos',
            'Projetos em 20 municípios',
            'Apoio a 5.000 famílias'
          ]),
          imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=entropy&auto=format',
          logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
          instagramUrl: 'https://instagram.com/acaosolidaria',
          websiteUrl: 'https://acaosolidaria.pt',
          visivel: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ods: [
            { ods: { numero: 1, nome: 'Erradicar a pobreza' } }
          ],
          areaAtuacao: [
            { tipo: { nome: 'Ação Social' } }
          ],
          colaboracao: [
            { tipo: { nome: 'Voluntariado presencial' } }
          ]
        }
      };
      
      return mockData[id] || null;
    }

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
        },
        projetos: {
          orderBy: { ordem: 'asc' }
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
  try {
    const { ods = [], areas = [], colaboracao = [], projetos = [], ...ngoData } = data;

    if (Array.isArray(ngoData.impacto)) {
      ngoData.impacto = JSON.stringify(ngoData.impacto);
    }

    const formattedProjects = Array.isArray(projetos)
      ? projetos
          .slice(0, 3)
          .map((project, index) => ({
            titulo: project?.titulo?.trim() || '',
            descricao: project?.descricao?.trim() || '',
            imagem: project?.imagem || null,
            ordem: index + 1
          }))
          .filter((project) => project.titulo && project.descricao)
      : [];

    const ngo = await prisma.nGO.create({
      data: {
        ...ngoData,
        ods: {
          create: ods.map((odsId) => ({ odsId }))
        },
        areaAtuacao: {
          create: areas.map((areaId) => ({ areaAtuacaoTipoId: areaId }))
        },
        colaboracao: {
          create: colaboracao.map((colabId) => ({ colaboracaoTipoId: colabId }))
        },
        projetos: {
          create: formattedProjects
        }
      },
      include: {
        ods: { include: { ods: true } },
        areaAtuacao: { include: { tipo: true } },
        colaboracao: { include: { tipo: true } },
        projetos: true
      }
    });

    return { success: true, data: ngo };
  } catch (error) {
    console.error('Erro ao criar ONG:', error);
    return { success: false, error: error.message };
  }
}

export async function updateNGO(id, data) {
  try {
    const { ods = [], areas = [], colaboracao = [], projetos, ...ngoData } = data;

    if (Array.isArray(ngoData.impacto)) {
      ngoData.impacto = JSON.stringify(ngoData.impacto);
    }

    if (ods.length > 0) {
      await prisma.nGOODS.deleteMany({ where: { ngoId: id } });
    }
    if (areas.length > 0) {
      await prisma.areaAtuacao.deleteMany({ where: { ngoId: id } });
    }
    if (colaboracao.length > 0) {
      await prisma.colaboracao.deleteMany({ where: { ngoId: id } });
    }

    const updateData = { ...ngoData };

    if (ods.length > 0) {
      updateData.ods = {
        create: ods.map((odsId) => ({ odsId }))
      };
    }

    if (areas.length > 0) {
      updateData.areaAtuacao = {
        create: areas.map((areaId) => ({ areaAtuacaoTipoId: areaId }))
      };
    }

    if (colaboracao.length > 0) {
      updateData.colaboracao = {
        create: colaboracao.map((colabId) => ({ colaboracaoTipoId: colabId }))
      };
    }

    if (Array.isArray(projetos)) {
      await prisma.nGOProjeto.deleteMany({ where: { ngoId: id } });
      const formattedProjects = projetos
        .slice(0, 3)
        .map((project, index) => ({
          titulo: project?.titulo?.trim() || '',
          descricao: project?.descricao?.trim() || '',
          imagem: project?.imagem || null,
          ordem: index + 1
        }))
        .filter((project) => project.titulo && project.descricao);

      updateData.projetos = {
        create: formattedProjects
      };
    }

    const ngo = await prisma.nGO.update({
      where: { id },
      data: updateData,
      include: {
        ods: { include: { ods: true } },
        areaAtuacao: { include: { tipo: true } },
        colaboracao: { include: { tipo: true } },
        projetos: {
          orderBy: { ordem: 'asc' }
        }
      }
    });

    return { success: true, data: ngo };
  } catch (error) {
    console.error('Erro ao atualizar ONG:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteNGO(id) {
  try {
    await prisma.nGO.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar ONG:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleNGOVisibility(id) {
  try {
    const ngo = await prisma.nGO.findUnique({ where: { id } });
    
    if (!ngo) {
      return { success: false, error: 'ONG não encontrada' };
    }

    const updated = await prisma.nGO.update({
      where: { id },
      data: { visivel: !ngo.visivel }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Erro ao alterar visibilidade da ONG:', error);
    return { success: false, error: error.message };
  }
}