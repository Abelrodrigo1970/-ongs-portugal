import { prisma } from '@/lib/db';

// Queries otimizadas para dashboard

export async function getEmpresaKPIs(empresaId) {
  try {
    const [
      totalIniciativas,
      iniciativasAtivas,
      totalColaboradores,
      totalPropostas,
      propostasPendentes,
      reunioesFuturas,
      estatisticas
    ] = await Promise.all([
      prisma.iniciativa.count({ where: { empresaId } }),
      prisma.iniciativa.count({ where: { empresaId, status: 'ATIVA' } }),
      prisma.colaboradorEmpresa.count({ where: { empresaId, ativo: true } }),
      prisma.proposta.count({ where: { empresaId } }),
      prisma.proposta.count({ where: { empresaId, status: 'PENDENTE' } }),
      prisma.reuniao.count({ 
        where: { 
          empresaId, 
          startAt: { gte: new Date() },
          status: { in: ['AGENDADA', 'CONFIRMADA'] }
        } 
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
      totalIniciativas,
      iniciativasAtivas,
      totalColaboradores,
      totalPropostas,
      propostasPendentes,
      reunioesFuturas,
      totalHoras: estatisticas._sum.horasVoluntariado || 0,
      totalProjetos: estatisticas._sum.numProjetos || 0,
      totalVoluntarios: estatisticas._sum.numVoluntarios || 0,
      totalDoacoes: estatisticas._sum.valorDoacoes || 0
    };
  } catch (error) {
    console.error('Error in getEmpresaKPIs:', error);
    return null;
  }
}

// Gráfico: Evolução de horas (linha)
export async function getEvolucaoHoras(empresaId, anoInicio) {
  try {
    const data = await prisma.estatisticaImpactoEmpresa.findMany({
      where: {
        empresaId,
        periodoAno: { gte: anoInicio }
      },
      select: {
        periodoAno: true,
        periodoMes: true,
        horasVoluntariado: true
      },
      orderBy: [
        { periodoAno: 'asc' },
        { periodoMes: 'asc' }
      ]
    });

    return data.map(d => ({
      ano: d.periodoAno,
      mes: d.periodoMes,
      horas: d.horasVoluntariado
    }));
  } catch (error) {
    console.error('Error in getEvolucaoHoras:', error);
    return [];
  }
}

// Gráfico: Projetos por causa (barras)
export async function getProjetosPorCausa(empresaId) {
  try {
    const result = await prisma.empresaCausa.findMany({
      where: { empresaId },
      include: {
        causa: {
          include: {
            iniciativas: {
              where: { empresaId }
            }
          }
        }
      }
    });

    return result.map(ec => ({
      causa: ec.causa.nome,
      total: ec.causa.iniciativas.length
    }));
  } catch (error) {
    console.error('Error in getProjetosPorCausa:', error);
    return [];
  }
}

// Gráfico: Distribuição por tipo de apoio (pizza)
export async function getDistribuicaoTipoApoio(empresaId) {
  try {
    const result = await prisma.iniciativa.groupBy({
      by: ['tipoApoio'],
      where: { 
        empresaId,
        status: 'CONCLUIDA'
      },
      _count: true
    });

    return result.map(r => ({
      tipo: r.tipoApoio,
      total: r._count
    }));
  } catch (error) {
    console.error('Error in getDistribuicaoTipoApoio:', error);
    return [];
  }
}

// Gráfico: Impacto por ODS (área)
export async function getImpactoPorODS(empresaId) {
  try {
    const result = await prisma.empresaODS.findMany({
      where: { empresaId },
      include: {
        ods: true
      }
    });

    const estatisticas = await prisma.estatisticaImpactoEmpresa.aggregate({
      where: { empresaId },
      _sum: { horasVoluntariado: true }
    });

    const totalHoras = estatisticas._sum.horasVoluntariado || 0;
    const horaPorODS = totalHoras / (result.length || 1);

    return result.map(eo => ({
      numero: eo.ods.numero,
      nome: eo.ods.nome,
      horas: horaPorODS
    })).sort((a, b) => a.numero - b.numero);
  } catch (error) {
    console.error('Error in getImpactoPorODS:', error);
    return [];
  }
}
