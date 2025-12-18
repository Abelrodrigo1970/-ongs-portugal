import { getEmpresaById } from '@/lib/repositories/empresas';
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

    // Buscar colaboradores da empresa (emails únicos)
    let emailsColaboradores = [];
    try {
      const colaboradores = await prisma.colaboradorEmpresa.findMany({
        where: {
          empresaId: id,
          ativo: true
        },
        select: {
          email: true
        }
      });
      emailsColaboradores = colaboradores.map(col => col.email.toLowerCase().trim()).filter(Boolean);
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
      emailsColaboradores = [];
    }

    // Buscar inscrições dos colaboradores da empresa em eventos (não iniciativas)
    let totalHoras = 0;
    let voluntariosUnicos = new Set();
    let pessoasImpactadas = 0;
    let eventosParticipados = new Set();
    
    if (emailsColaboradores.length > 0) {
      try {
        // Buscar todas as inscrições dos colaboradores da empresa em eventos (ignorar status)
        const inscricoesEventos = await prisma.inscricao.findMany({
          where: {
            emailColaborador: { in: emailsColaboradores },
            eventoId: { not: null } // Apenas eventos, não iniciativas
          },
          include: {
            evento: {
              select: {
                id: true,
                nome: true,
                dataInicio: true,
                dataFim: true
              }
            }
          }
        });
        
        // Contar voluntários únicos e eventos
        inscricoesEventos.forEach(insc => {
          if (insc.emailColaborador) {
            voluntariosUnicos.add(insc.emailColaborador.toLowerCase());
          }
          if (insc.evento) {
            eventosParticipados.add(insc.evento.id);
          }
        });
        
        pessoasImpactadas = voluntariosUnicos.size;
        
        // Agrupar inscrições por evento para calcular horas corretamente
        const eventosUnicos = new Map();
        inscricoesEventos.forEach(insc => {
          if (insc.evento && insc.eventoId) {
            const eventoId = insc.eventoId;
            if (!eventosUnicos.has(eventoId)) {
              eventosUnicos.set(eventoId, {
                evento: insc.evento,
                inscricoes: []
              });
            }
            eventosUnicos.get(eventoId).inscricoes.push(insc);
          }
        });
        
        // Calcular horas totais: para cada evento, duração × número de participantes
        eventosUnicos.forEach((eventoData, eventoId) => {
          const evento = eventoData.evento;
          const numParticipantes = eventoData.inscricoes.length;
          
          if (evento.dataInicio && numParticipantes > 0) {
            const dataInicio = new Date(evento.dataInicio);
            const dataFim = evento.dataFim 
              ? new Date(evento.dataFim) 
              : new Date(dataInicio.getTime() + 4 * 60 * 60 * 1000); // Default 4 horas se não houver data fim
            
            const diffMs = dataFim - dataInicio;
            const duracaoHoras = Math.max(1, Math.round(diffMs / (1000 * 60 * 60))); // Mínimo 1 hora
            
            // Total de horas = duração do evento x número de participantes aprovados
            totalHoras += duracaoHoras * numParticipantes;
          }
        });
      } catch (error) {
        console.error('Erro ao buscar inscrições de eventos:', error);
      }
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

    // Buscar eventos recentes onde os colaboradores participaram
    let eventosRecentes = [];
    if (emailsColaboradores.length > 0) {
      try {
        const inscricoesRecentes = await prisma.inscricao.findMany({
          where: {
            emailColaborador: { in: emailsColaboradores },
            eventoId: { not: null }
          },
          include: {
            evento: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                dataInicio: true,
                imagem: true,
                ngo: {
                  select: {
                    nome: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        });
        
        // Pegar eventos únicos e ordenar por data
        const eventosMap = new Map();
        inscricoesRecentes.forEach(insc => {
          if (insc.evento && !eventosMap.has(insc.evento.id)) {
            eventosMap.set(insc.evento.id, insc.evento);
          }
        });
        
        eventosRecentes = Array.from(eventosMap.values())
          .sort((a, b) => {
            const dateA = new Date(a.dataInicio || 0);
            const dateB = new Date(b.dataInicio || 0);
            return dateB - dateA;
          })
          .slice(0, 5);
      } catch (error) {
        console.error('Erro ao buscar eventos recentes:', error);
        eventosRecentes = [];
      }
    }

    const totalVoluntariosUnicos = voluntariosUnicos.size;
    const horaPorVoluntario = totalVoluntariosUnicos > 0 ? totalHoras / totalVoluntariosUnicos : 0;
    const totalEventos = eventosParticipados.size;

    console.log('Dashboard Data:', {
      empresaId: id,
      empresaNome: empresa.nome,
      empresaLogo: empresa.logo,
      emailsColaboradores: emailsColaboradores.length,
      totalHoras: Math.round(totalHoras),
      totalVoluntariosUnicos: totalVoluntariosUnicos,
      totalEventos,
      pessoasImpactadas,
      horaPorVoluntario: Math.round(horaPorVoluntario * 10) / 10,
      eventosRecentes: eventosRecentes.length
    });

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
      iniciativasRecentes: eventosRecentes || [],
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
