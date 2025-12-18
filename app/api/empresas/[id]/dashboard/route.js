import { getEmpresaById } from '@/lib/repositories/empresas';
import { getIniciativas } from '@/lib/repositories/iniciativas';
import { getColaboradores } from '@/lib/repositories/colaboradores';
import { getInscricoes } from '@/lib/repositories/inscricoes';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da empresa é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar empresa com todos os dados relacionados
    const empresa = await getEmpresaById(id);
    
    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      );
    }

    // Buscar colaboradores ativos diretamente via Prisma para evitar problemas com filtros
    let totalVoluntarios = 0;
    try {
      const colaboradoresCount = await prisma.colaboradorEmpresa.count({
        where: {
          empresaId: id,
          ativo: true
        }
      });
      totalVoluntarios = colaboradoresCount;
    } catch (error) {
      console.error('Erro ao contar colaboradores:', error);
      totalVoluntarios = 0;
    }

    // Buscar todas as iniciativas da empresa
    let iniciativasResult = { iniciativas: [] };
    try {
      iniciativasResult = await getIniciativas({
        empresaId: id,
        limit: 100
      });
    } catch (error) {
      console.error('Erro ao buscar iniciativas:', error);
      iniciativasResult = { iniciativas: [] };
    }

    // Buscar pessoas impactadas (inscrições aprovadas nas iniciativas)
    let pessoasImpactadas = 0;
    try {
      if (iniciativasResult?.iniciativas && iniciativasResult.iniciativas.length > 0) {
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
    } catch (error) {
      console.error('Erro ao buscar pessoas impactadas:', error);
      pessoasImpactadas = 0;
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

    // Calcular KPIs baseado nas iniciativas e inscrições reais
    let totalHoras = 0;
    let voluntariosUnicos = new Set();
    
    if (iniciativasResult?.iniciativas && iniciativasResult.iniciativas.length > 0) {
      const iniciativaIds = iniciativasResult.iniciativas.map(init => init.id);
      
      // Buscar todas as inscrições aprovadas das iniciativas
      const todasInscricoes = await prisma.inscricao.findMany({
        where: {
          iniciativaId: { in: iniciativaIds },
          status: 'APROVADA'
        },
        select: {
          emailColaborador: true,
          iniciativaId: true
        }
      });
      
      // Contar voluntários únicos
      todasInscricoes.forEach(insc => {
        if (insc.emailColaborador) {
          voluntariosUnicos.add(insc.emailColaborador.toLowerCase());
        }
      });
      
      // Calcular horas: para cada iniciativa, calcular duração e multiplicar por número de inscrições aprovadas
      for (const iniciativa of iniciativasResult.iniciativas) {
        const inscricoesAprovadas = todasInscricoes.filter(
          insc => insc.iniciativaId === iniciativa.id
        ).length;
        
        if (inscricoesAprovadas > 0 && iniciativa.dataInicio) {
          // Calcular duração da iniciativa em horas
          const dataInicio = new Date(iniciativa.dataInicio);
          const dataFim = iniciativa.dataFim 
            ? new Date(iniciativa.dataFim) 
            : new Date(dataInicio.getTime() + 4 * 60 * 60 * 1000); // Default 4 horas se não houver data fim
          
          const diffMs = dataFim - dataInicio;
          const duracaoHoras = Math.max(1, Math.round(diffMs / (1000 * 60 * 60))); // Mínimo 1 hora
          
          // Total de horas = duração da iniciativa x número de participantes aprovados
          totalHoras += duracaoHoras * inscricoesAprovadas;
        }
      }
    }
    
    const totalVoluntariosUnicos = voluntariosUnicos.size;
    const horaPorVoluntario = totalVoluntariosUnicos > 0 ? totalHoras / totalVoluntariosUnicos : 0;
    const totalEventos = iniciativasResult?.iniciativas?.length || 0;

    console.log('Dashboard Data:', {
      empresaId: id,
      empresaNome: empresa.nome,
      empresaLogo: empresa.logo,
      totalHoras: Math.round(totalHoras),
      totalVoluntariosUnicos: totalVoluntariosUnicos,
      totalEventos,
      pessoasImpactadas,
      horaPorVoluntario: Math.round(horaPorVoluntario * 10) / 10,
      iniciativasCount: iniciativasResult?.iniciativas?.length || 0
    });

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

    const response = {
      success: true,
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        logo: empresa.logo,
        imagem: empresa.imagem,
        descricao: empresa.descricao,
        missao: empresa.missao,
        email: empresa.email,
        telefone: empresa.telefone,
        localizacao: empresa.localizacao,
        website: empresa.website,
        causas: causasMapeadas,
        ods: empresa.ods,
        tiposApoio: empresa.tiposApoio
      },
      kpis: {
        horasVoluntariado: Math.round(totalHoras) || 0,
        pessoasImpactadas: pessoasImpactadas || 0,
        voluntarios: totalVoluntariosUnicos || 0,
        eventos: totalEventos || 0,
        horaPorVoluntario: Math.round(horaPorVoluntario * 10) / 10 || 0, // Arredondar para 1 casa decimal
        ongsApoiadas: ongsApoiadasCount || 0
      },
      iniciativasRecentes: iniciativasRecentes || [],
      ongsFavoritas: ongsFavoritas || []
    };

    console.log('Response sendo enviada:', {
      empresaNome: response.empresa.nome,
      empresaLogo: response.empresa.logo,
      kpis: response.kpis
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in /api/empresas/[id]/dashboard:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
