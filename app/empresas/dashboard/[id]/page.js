'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Download, 
  Info, 
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  Heart
} from 'lucide-react';

export default function EmpresaDashboardPage() {
  const params = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState(new Date().toLocaleString('pt-PT', { month: 'long' }));
  
  // Estados para dados
  const [kpis, setKpis] = useState({
    horasVoluntariado: 0,
    pessoasImpactadas: 0,
    voluntarios: 0,
    eventos: 0,
    horaPorVoluntario: 0,
    ongsApoiadas: 0
  });
  const [metas, setMetas] = useState([]);
  const [causas, setCausas] = useState([]);
  const [iniciativasRecentes, setIniciativasRecentes] = useState([]);
  const [ongsFavoritas, setOngsFavoritas] = useState([]);
  const [impactScore, setImpactScore] = useState(0.0);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    loadDashboardData();
  }, [params.id, ano, mes]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados da empresa
      const empresaRes = await fetch(`/api/empresas?id=${params.id}`);
      const empresaData = await empresaRes.json();
      
      if (empresaData.data && empresaData.data.length > 0) {
        const empresaCompleta = empresaData.data[0];
        setEmpresa(empresaCompleta);
        
        // Calcular KPIs baseado nas estatísticas
        const totalHoras = empresaCompleta.estatisticas?.reduce((sum, est) => sum + (Number(est.horasVoluntariado) || 0), 0) || 0;
        
        // Buscar colaboradores ativos
        const colaboradoresRes = await fetch(`/api/colaboradores/search?empresaId=${params.id}&ativo=true`);
        let totalVoluntarios = 0;
        if (colaboradoresRes.ok) {
          const colaboradoresData = await colaboradoresRes.json();
          totalVoluntarios = colaboradoresData.colaboradores?.length || 0;
        }
        
        const horaPorVoluntario = totalVoluntarios > 0 ? totalHoras / totalVoluntarios : 0;
        const totalEventos = empresaCompleta.iniciativas?.length || 0;
        
        setKpis({
          horasVoluntariado: totalHoras,
          pessoasImpactadas: 0, // TODO: Calcular baseado em inscrições
          voluntarios: totalVoluntarios,
          eventos: totalEventos,
          horaPorVoluntario: horaPorVoluntario,
          ongsApoiadas: 0 // TODO: Buscar da tabela favoritos
        });

        // Iniciativas recentes (ordenadas por data de criação)
        if (empresaCompleta.iniciativas && empresaCompleta.iniciativas.length > 0) {
          const recentes = [...empresaCompleta.iniciativas]
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.dataInicio || 0);
              const dateB = new Date(b.createdAt || b.dataInicio || 0);
              return dateB - dateA;
            })
            .slice(0, 5);
          setIniciativasRecentes(recentes);
        } else {
          // Se não vier no objeto empresa, buscar separadamente
          const iniciativasRes = await fetch(`/api/iniciativas?empresaId=${params.id}&limit=5`);
          if (iniciativasRes.ok) {
            const iniciativasData = await iniciativasRes.json();
            if (iniciativasData.iniciativas) {
              const recentes = [...iniciativasData.iniciativas]
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt || a.dataInicio || 0);
                  const dateB = new Date(b.createdAt || b.dataInicio || 0);
                  return dateB - dateA;
                })
                .slice(0, 5);
              setIniciativasRecentes(recentes);
            }
          }
        }

        // Causas da empresa
        if (empresaCompleta.causas) {
          setCausas(empresaCompleta.causas);
        }
      }

      // Buscar ONGs favoritas (favoritos onde empresaId = params.id)
      // Por enquanto deixar vazio - pode ser implementado depois
      setOngsFavoritas([]);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    return `${weekday}, ${day} ${month}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    
    if (diffWeeks === 1) return '1 semana atrás';
    if (diffWeeks > 1 && diffWeeks < 4) return `${diffWeeks} semanas atrás`;
    if (diffMonths === 1) return '1 Mês atrás';
    if (diffMonths > 1) return `${diffMonths} Meses atrás`;
    return 'Recente';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0086FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="self-stretch pt-24 inline-flex flex-col justify-center items-start gap-16 px-6">
        {/* Header com Avatar e Impact Score */}
        <div className="self-stretch pt-10 inline-flex justify-start items-center gap-6">
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-6">
            <img 
              className="w-20 h-20 rounded-full" 
              src={empresa?.logo || empresa?.imagem || "https://placehold.co/87x87"} 
              alt={empresa?.nome || 'Empresa'}
            />
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-start text-stone-900 text-3xl font-semibold font-['Inter'] leading-10">
                Bem-Vinda, {empresa?.nome || 'Empresa'}
              </div>
              <div className="self-stretch justify-start text-zinc-600 text-lg font-normal font-['Inter'] leading-8">
                Acompanhe o resumo do impacto das tuas atividades recentes.
              </div>
            </div>
          </div>
          
          {/* UNIVA Impact Score Card */}
          <div className="w-80 h-44 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-center items-center gap-4">
            <div className="inline-flex justify-start items-center gap-2">
              <div className="justify-start text-gray-600 text-lg font-bold font-['Inter'] leading-8">UNIVA Impact Score</div>
              <div className="w-6 h-6 relative">
                <Info className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-7">
              <div 
                className="justify-start text-sky-500 text-6xl font-bold font-['Inter'] leading-[76.80px]"
                style={{
                  background: 'linear-gradient(177.14deg, rgba(14, 165, 233, 1) 16.451%, rgba(6, 182, 212, 1) 54.473%, rgba(20, 184, 166, 1) 97.15%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {impactScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Seletores de Data e Botão Exportar */}
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="w-[656px] flex justify-start items-center gap-4">
              <div className="flex justify-start items-center">
                <select
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="justify-start text-stone-900 text-4xl font-semibold font-['Inter'] leading-[48px] bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
                <div className="w-8 h-8 relative ml-2">
                  <div className="w-8 h-8 left-0 top-0 absolute bg-zinc-300 rounded"></div>
                  <div className="w-4 h-2.5 left-[8px] top-[10.67px] absolute bg-gray-700"></div>
                </div>
              </div>
              <div className="flex justify-start items-center">
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="justify-start text-stone-900 text-4xl font-semibold font-['Inter'] leading-[48px] bg-transparent border-none outline-none cursor-pointer capitalize"
                >
                  {meses.map(m => (
                    <option key={m} value={m} className="capitalize">{m}</option>
                  ))}
                </select>
                <div className="w-8 h-8 relative ml-2">
                  <div className="w-8 h-8 left-0 top-0 absolute bg-zinc-300 rounded"></div>
                  <div className="w-4 h-2.5 left-[8px] top-[10.67px] absolute bg-gray-700"></div>
                </div>
              </div>
            </div>
            <button className="w-80 px-6 py-2 bg-black rounded-[100px] flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
              <div className="justify-start text-white text-lg font-bold font-['Inter'] leading-8">Exportar Relatório</div>
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* 6 Cards de Estatísticas */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            {/* Primeira linha - 2 cards */}
            <div className="self-stretch inline-flex justify-start items-start gap-6">
              {/* Card 1: Horas de voluntariado */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-['Inter'] leading-8">Horas de voluntariado</div>
                  <div className="w-[596px] justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-10">
                    {Math.round(kpis.horasVoluntariado).toLocaleString('pt-PT')}
                  </div>
                  <div className="w-[596px] justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5">Total acumulado</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-['Inter'] leading-5">+12% este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Número de pessoas impactadas */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-['Inter'] leading-8">Número de pessoas impactadas</div>
                  <div className="w-[596px] justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-10">
                    {kpis.pessoasImpactadas.toLocaleString('pt-PT')}
                  </div>
                  <div className="w-[596px] justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5">Pessoas beneficiadas</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-['Inter'] leading-5">+8% este mês</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Segunda linha - 4 cards */}
            <div className="self-stretch inline-flex justify-start items-start gap-6">
              {/* Card 3: Eventos */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-['Inter'] leading-8">Eventos</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-10">
                    {kpis.eventos}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5">Eventos participados</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-['Inter'] leading-5">+3 este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 4: Voluntários */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-['Inter'] leading-8">Voluntarios</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-10">
                    {kpis.voluntarios}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5">Colaboradores ativos</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-['Inter'] leading-5">+5 este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 5: Hora / Voluntário */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-['Inter'] leading-8">Hora / Voluntário</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-10">
                    {Math.round(kpis.horaPorVoluntario).toLocaleString('pt-PT')}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5">Média por colaborador</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-['Inter'] leading-5">+2h este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 6: ONGs Apoiadas */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-4">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-7">
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-['Inter'] leading-8">ONGs Apoiadas</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-10">
                    {kpis.ongsApoiadas}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5">Parceiros ativos</div>
                  <div className="self-stretch inline-flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-['Inter'] leading-5">+1 este mês</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Metas 2025 e Minhas Causas - 2 Colunas */}
          <div className="self-stretch inline-flex justify-start items-start gap-6">
            {/* Card Metas 2025 */}
            <div className="flex-1 self-stretch p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch justify-start text-stone-900 text-2xl font-bold font-['Inter'] leading-7">Metas 2025</div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch inline-flex justify-between items-end">
                    <div className="justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">Horas</div>
                    <div className="justify-start text-zinc-600 text-xs font-bold font-['Inter'] leading-4">100€ doados</div>
                  </div>
                  <div className="self-stretch h-2 bg-gray-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                    <div className="flex-1 h-6 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-[100px]" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-end">
                  <div className="justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">Eventos</div>
                  <div className="justify-start text-zinc-600 text-xs font-bold font-['Inter'] leading-4">1000 Horas</div>
                </div>
                <div className="self-stretch h-2 bg-gray-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                  <div className="h-6 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-[100px]" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-end">
                  <div className="justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">Nº voluntários</div>
                  <div className="justify-start text-zinc-600 text-xs font-bold font-['Inter'] leading-4">50 participações</div>
                </div>
                <div className="self-stretch h-2 bg-gray-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                  <div className="h-6 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-[100px]" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-end">
                  <div className="justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">Pessoas impactadas</div>
                  <div className="justify-start text-zinc-600 text-xs font-bold font-['Inter'] leading-4">5 Mentorandos</div>
                </div>
                <div className="self-stretch h-2 bg-gray-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                  <div className="h-6 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-[100px]" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-end">
                  <div className="justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">ONGs de apoiadas</div>
                  <div className="justify-start text-zinc-600 text-xs font-bold font-['Inter'] leading-4">15 Colaborações</div>
                </div>
                <div className="self-stretch h-2 bg-gray-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                  <div className="h-6 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 rounded-[100px]" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="inline-flex justify-start items-start gap-2">
                <button className="px-6 py-2 bg-black rounded-[100px] flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                  <div className="justify-start text-white text-lg font-bold font-['Inter'] leading-8">Adicionar Metas</div>
                </button>
              </div>
            </div>

            {/* Card Minhas Causas */}
            <div className="w-[644px] self-stretch p-6 relative rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-start gap-8 overflow-hidden">
              <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-8">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-stone-900 text-2xl font-bold font-['Inter'] leading-7">Minhas Causas</div>
                  </div>
                </div>
                <div className="self-stretch flex-1 inline-flex justify-start items-start gap-8">
                  <div className="flex-1 self-stretch flex justify-start items-start gap-2">
                    <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4 overflow-y-auto max-h-[400px] pr-2">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">Ambiente e Ação Climática</div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch px-4 py-2 bg-green-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                            <div className="flex-1 justify-start text-emerald-700 text-sm font-semibold font-['Inter'] leading-5">Mitigação das Alterações Climáticas</div>
                            <div className="justify-start"><span className="text-emerald-700 text-xs font-normal font-['Inter'] leading-4">Participaste de </span><span className="text-emerald-700 text-xs font-bold font-['Inter'] leading-4">24 iniciativas</span></div>
                          </div>
                          <div className="self-stretch px-4 py-2 bg-green-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                            <div className="flex-1 justify-start text-emerald-700 text-sm font-semibold font-['Inter'] leading-5">Emissões de Gases com Efeito de Estufa</div>
                            <div className="justify-start"><span className="text-emerald-700 text-xs font-normal font-['Inter'] leading-4">Participaste de </span><span className="text-emerald-700 text-xs font-bold font-['Inter'] leading-4">12 iniciativas</span></div>
                          </div>
                          <div className="self-stretch px-4 py-2 bg-green-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                            <div className="flex-1 justify-start text-emerald-700 text-sm font-semibold font-['Inter'] leading-5">Transição para Energias Renováveis</div>
                            <div className="justify-start"><span className="text-emerald-700 text-xs font-normal font-['Inter'] leading-4">Participaste de </span><span className="text-emerald-700 text-xs font-bold font-['Inter'] leading-4">02 iniciativas</span></div>
                          </div>
                          <div className="self-stretch px-4 py-2 bg-green-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                            <div className="flex-1 justify-start text-emerald-700 text-sm font-semibold font-['Inter'] leading-5">Economia Circular</div>
                            <div className="justify-start"><span className="text-emerald-700 text-xs font-normal font-['Inter'] leading-4">Participaste de </span><span className="text-emerald-700 text-xs font-bold font-['Inter'] leading-4">07 iniciativas</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch justify-start text-zinc-600 text-lg font-bold font-['Inter'] leading-6">Direitos humanos e Proteção</div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch px-4 py-2 bg-green-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                            <div className="flex-1 justify-start text-emerald-700 text-sm font-semibold font-['Inter'] leading-5">Proteção da criança</div>
                            <div className="justify-start"><span className="text-emerald-700 text-xs font-normal font-['Inter'] leading-4">Participaste de </span><span className="text-emerald-700 text-xs font-bold font-['Inter'] leading-4">02 iniciativas</span></div>
                          </div>
                          <div className="self-stretch px-4 py-2 bg-green-100 rounded-lg inline-flex justify-start items-center overflow-hidden">
                            <div className="flex-1 justify-start text-emerald-700 text-sm font-semibold font-['Inter'] leading-5">Suporte à vítimas</div>
                            <div className="justify-start"><span className="text-emerald-700 text-xs font-normal font-['Inter'] leading-4">Participaste de </span><span className="text-emerald-700 text-xs font-bold font-['Inter'] leading-4">12 iniciativas</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[644px] h-32 left-0 top-[439px] absolute bg-gradient-to-b from-slate-50/0 to-slate-50 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Iniciativas recentes e ONGs Favoritas - 2 Colunas */}
          <div className="self-stretch inline-flex justify-start items-start gap-6">
            {/* Card Iniciativas recentes */}
            <div className="flex-1 self-stretch p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch justify-start text-stone-900 text-2xl font-bold font-['Inter'] leading-7">Iniciativas recentes</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                {iniciativasRecentes.length > 0 ? (
                  iniciativasRecentes.map((iniciativa) => (
                    <div key={iniciativa.id} className="self-stretch h-28 bg-white rounded-2xl shadow-[0px_0px_50px_0px_rgba(225,225,225,1.00)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-start overflow-hidden">
                      <div className="w-48 self-stretch flex justify-start items-center gap-2 relative">
                        {iniciativa.imagem ? (
                          <Image src={iniciativa.imagem} alt={iniciativa.titulo || 'Iniciativa'} fill className="flex-1 self-stretch object-cover" sizes="192px" />
                        ) : (
                          <div className="flex-1 self-stretch bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 self-stretch px-4 pt-2 pb-4 bg-white flex justify-start items-start">
                        <div className="flex-1 self-stretch flex justify-start items-start gap-2">
                          <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                            <div className="self-stretch flex-1 flex flex-col justify-start items-start">
                              <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-6">{iniciativa.titulo || 'Nome da Iniciativa'}</div>
                              <div className="self-stretch inline-flex justify-start items-center gap-2">
                                <div className="justify-start text-gray-500 text-sm font-semibold font-['Inter'] leading-5">{iniciativa.localizacao || 'Location'}</div>
                                {iniciativa.dataInicio && (
                                  <div className="inline-flex flex-col justify-center items-start gap-1">
                                    <div className="self-stretch inline-flex justify-start items-start gap-3">
                                      <div className="flex justify-start items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div className="opacity-70 justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5">{formatDateShort(iniciativa.dataInicio)}</div>
                                      </div>
                                      <div className="flex justify-start items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        <div className="opacity-70 justify-start text-zinc-600 text-sm font-normal font-['Inter'] leading-5">
                                          {formatTime(iniciativa.dataInicio)}
                                          {iniciativa.dataFim && ` - ${formatTime(iniciativa.dataFim)}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="self-stretch justify-start text-zinc-600 text-sm font-medium font-['Inter'] leading-4">{getTimeAgo(iniciativa.createdAt || iniciativa.dataInicio)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhuma iniciativa recente</p>
                )}
              </div>
              <button className="px-6 py-2 bg-black rounded-[100px] inline-flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                <div className="justify-start text-white text-lg font-bold font-['Inter'] leading-8">Ver mais</div>
              </button>
            </div>

            {/* Card ONGs Favoritas */}
            <div className="flex-1 self-stretch p-6 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start gap-8">
              <div className="self-stretch justify-start text-stone-900 text-2xl font-bold font-['Inter'] leading-7">ONGs Favoritas</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                {ongsFavoritas.length > 0 ? (
                  ongsFavoritas.map((ong) => (
                    <div key={ong.id} className="self-stretch h-28 bg-white rounded-2xl shadow-[0px_0px_50px_0px_rgba(225,225,225,1.00)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-start items-center overflow-hidden">
                      <div className="w-48 self-stretch flex justify-start items-center gap-2 relative">
                        {ong.logo || ong.imagem ? (
                          <Image src={ong.logo || ong.imagem} alt={ong.nome} fill className="flex-1 self-stretch object-cover" sizes="192px" />
                        ) : (
                          <div className="flex-1 self-stretch bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 self-stretch px-4 pt-2 pb-4 bg-white flex justify-start items-center">
                        <div className="flex-1 self-stretch flex justify-end items-center gap-2">
                          <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                            <div className="self-stretch flex flex-col justify-center items-start">
                              <div className="self-stretch justify-start text-gray-900 text-base font-bold font-['Inter'] leading-6">{ong.nome}</div>
                              <div className="self-stretch justify-start text-gray-500 text-sm font-semibold font-['Inter'] leading-5">{ong.localizacao || 'Location'}</div>
                            </div>
                            <div className="self-stretch inline-flex justify-start items-center gap-2">
                              {ong.areas && ong.areas.slice(0, 2).map((area, idx) => (
                                <div key={idx} className="px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center overflow-hidden">
                                  <div className="justify-start text-gray-500 text-sm font-semibold font-['Inter'] leading-5">
                                    {typeof area === 'object' ? area.tipo?.nome || area.nome : area}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="w-7 h-7 relative shadow-[0px_0px_8.88888931274414px_0px_rgba(0,0,0,0.75)]">
                            <Heart className="w-5 h-5 left-[2.20px] top-[2.91px] absolute text-red-500 fill-red-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhuma ONG favorita</p>
                )}
              </div>
              <button className="px-6 py-2 bg-black rounded-[100px] inline-flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                <div className="justify-start text-white text-lg font-bold font-['Inter'] leading-8">Ver mais</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
