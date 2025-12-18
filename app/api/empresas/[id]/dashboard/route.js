import { getEmpresaById } from '@/lib/repositories/empresas';
import { getIniciativas } from '@/lib/repositories/iniciativas';
import { getColaboradores } from '@/lib/repositories/colaboradores';
import { getInscricoes } from '@/lib/repositories/inscricoes';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Buscar empresa com todos os dados relacionados
    const empresa = await getEmpresaById(id);
    
    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    // Buscar colaboradores ativos
    const colaboradoresResult = await getColaboradores({
      empresaId: id,
      ativo: true,
      limit: 1000
    });

    // Buscar todas as iniciativas da empresa
    const iniciativasResult = await getIniciativas({
      empresaId: id,
      limit: 100
    });

    // Buscar pessoas impactadas (inscrições aprovadas nas iniciativas)
    let pessoasImpactadas = 0;
    if (iniciativasResult.iniciativas && iniciativasResult.iniciativas.length > 0) {
      const iniciativaIds = iniciativasResult.iniciativas.map(init => init.id);
      const emailsUnicos = new Set();
      
      // Buscar todas as inscrições aprovadas de uma vez
      const todasInscricoes = await prisma.inscricao.findMany({
        where: {
          iniciativaId: { in: iniciativaIds },
          status: 'APROVADA'
        },
        select: {
          emailColaborador: true
        }
      });
      
      todasInscricoes.forEach(insc => {
        if (insc.emailColaborador) {
          emailsUnicos.add(insc.emailColaborador.toLowerCase());
        }
      });
      
      pessoasImpactadas = emailsUnicos.size;
    }

    // Buscar ONGs favoritas (ONGs que marcaram esta empresa como favorita)
    let ongsFavoritas = [];
    let ongsApoiadasCount = 0;
    try {
      const favoritos = await prisma.favorito.findMany({
        where: { empresaId: id },
        include: {
          ong: {
            include: {
              areaAtuacao: {
                include: {
                  tipo: true
                }
              }
            }
          }
        },
        take: 5
      });

      ongsApoiadasCount = await prisma.favorito.count({
        where: { empresaId: id }
      });

      ongsFavoritas = favoritos.map(fav => ({
        ...fav.ong,
        areas: fav.ong.areaAtuacao?.map(area => area.tipo).filter(Boolean) || []
      }));
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      ongsFavoritas = [];
      ongsApoiadasCount = 0;
    }

    // Calcular KPIs
    const totalHoras = empresa.estatisticas?.reduce((sum, est) => sum + (Number(est.horasVoluntariado) || 0), 0) || 0;
    const totalVoluntarios = colaboradoresResult.colaboradores?.length || 0;
    const horaPorVoluntario = totalVoluntarios > 0 ? totalHoras / totalVoluntarios : 0;
    const totalEventos = iniciativasResult.iniciativas?.length || 0;

    // Iniciativas recentes (ordenadas por data)
    const iniciativasRecentes = iniciativasResult.iniciativas
      ? [...iniciativasResult.iniciativas]
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.dataInicio || 0);
            const dateB = new Date(b.createdAt || b.dataInicio || 0);
            return dateB - dateA;
          })
          .slice(0, 5)
      : [];

    // Mapear causas para o formato esperado
    const causasMapeadas = empresa.causas?.map(empCausa => ({
      ...empCausa.causa,
      empresaCausaId: empCausa.id
    })) || [];

    return NextResponse.json({
      success: true,
      empresa: {
        ...empresa,
        causas: causasMapeadas
      },
      kpis: {
        horasVoluntariado: totalHoras,
        pessoasImpactadas: pessoasImpactadas,
        voluntarios: totalVoluntarios,
        eventos: totalEventos,
        horaPorVoluntario: horaPorVoluntario,
        ongsApoiadas: ongsApoiadasCount
      },
      iniciativasRecentes,
      ongsFavoritas
    });

  } catch (error) {
    console.error('Error in /api/empresas/[id]/dashboard:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
