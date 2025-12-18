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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full pt-24 flex flex-col items-center" style={{ paddingLeft: '64px', paddingRight: '64px', gap: '24px' }}>
        <div className="w-full max-w-[1312px] flex flex-col" style={{ gap: '24px' }}>
        {/* Header com Avatar e Impact Score */}
          <div className="w-full pt-10 flex justify-start items-center gap-6">
            <div className="flex-1 flex flex-col justify-center items-start gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                {empresa?.logo || empresa?.imagem ? (
                  <Image 
                    src={empresa.logo || empresa.imagem} 
                    alt={empresa?.nome || 'Empresa'}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="w-full text-stone-900 text-3xl font-semibold font-sans leading-10">
                  Bem-Vinda, {empresa?.nome || 'Empresa'}
                </div>
                <div className="w-full text-zinc-600 text-lg font-normal font-sans leading-8">
                  Acompanhe o resumo do impacto das tuas atividades recentes.
                </div>
              </div>
            </div>
          
          {/* UNIVA Impact Score Card */}
          <div className="w-80 h-44 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 inline-flex flex-col justify-center items-center gap-4">
            <div className="inline-flex justify-start items-center gap-2">
              <div className="justify-start text-gray-600 text-lg font-bold font-sans leading-8">UNIVA Impact Score</div>
              <div className="w-6 h-6 relative">
                <Info className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-7">
              <div 
                className="justify-start text-sky-500 text-6xl font-bold font-sans leading-tight"
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
          <div className="w-full flex flex-col justify-start items-start gap-8">
            <div className="w-full flex justify-between items-center">
            <div className="max-w-2xl flex justify-start items-center gap-4">
              <div className="flex justify-start items-center">
                <select
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="justify-start text-stone-900 text-4xl font-semibold font-sans leading-tight bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
                <div className="w-8 h-8 relative ml-2">
                  <div className="w-8 h-8 left-0 top-0 absolute bg-zinc-300 rounded"></div>
                  <div className="w-4 h-2.5 left-2 top-2.5 absolute bg-gray-700"></div>
                </div>
              </div>
              <div className="flex justify-start items-center">
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="justify-start text-stone-900 text-4xl font-semibold font-sans leading-tight bg-transparent border-none outline-none cursor-pointer capitalize"
                >
                  {meses.map(m => (
                    <option key={m} value={m} className="capitalize">{m}</option>
                  ))}
                </select>
                <div className="w-8 h-8 relative ml-2">
                  <div className="w-8 h-8 left-0 top-0 absolute bg-zinc-300 rounded"></div>
                  <div className="w-4 h-2.5 left-2 top-2.5 absolute bg-gray-700"></div>
                </div>
              </div>
            </div>
            <button className="w-80 px-6 py-2 bg-black rounded-full flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
              <div className="justify-start text-white text-lg font-bold font-sans leading-8">Exportar Relatório</div>
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>

            {/* 6 Cards de Estatísticas */}
            <div className="w-full flex flex-col justify-start items-start" style={{ gap: '24px' }}>
              {/* Primeira linha - 2 cards */}
              <div className="w-full flex justify-start items-start" style={{ gap: '24px' }}>
              {/* Card 1: Horas de voluntariado */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start" style={{ gap: '16px' }}>
                <div className="flex-1 flex flex-col justify-start items-start" style={{ gap: '27px' }}>
                  <div className="w-full text-gray-900 text-lg font-bold font-sans leading-8">Horas de voluntariado</div>
                  <div className="w-[596px] justify-start text-gray-900 text-3xl font-semibold font-sans leading-10">
                    {Math.round(kpis.horasVoluntariado).toLocaleString('pt-PT')}
                  </div>
                  <div className="w-[596px] justify-start text-gray-500 text-sm font-normal font-sans leading-5">Total acumulado</div>
                  <div className="w-full flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-sans leading-5">+12% este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Número de pessoas impactadas */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start" style={{ gap: '16px' }}>
                <div className="flex-1 flex flex-col justify-start items-start" style={{ gap: '27px' }}>
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-sans leading-8">Número de pessoas impactadas</div>
                  <div className="w-[596px] justify-start text-gray-900 text-3xl font-semibold font-sans leading-10">
                    {kpis.pessoasImpactadas.toLocaleString('pt-PT')}
                  </div>
                  <div className="w-[596px] justify-start text-gray-500 text-sm font-normal font-sans leading-5">Pessoas beneficiadas</div>
                  <div className="w-full flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-sans leading-5">+8% este mês</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Segunda linha - 4 cards */}
            <div className="w-full flex justify-start items-start" style={{ gap: '24px' }}>
              {/* Card 3: Eventos */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start" style={{ gap: '16px' }}>
                <div className="flex-1 flex flex-col justify-start items-start" style={{ gap: '27px' }}>
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-sans leading-8">Eventos</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-sans leading-10">
                    {kpis.eventos}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-sans leading-5">Eventos participados</div>
                  <div className="w-full flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-sans leading-5">+3 este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 4: Voluntários */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start" style={{ gap: '16px' }}>
                <div className="flex-1 flex flex-col justify-start items-start" style={{ gap: '27px' }}>
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-sans leading-8">Voluntarios</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-sans leading-10">
                    {kpis.voluntarios}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-sans leading-5">Colaboradores ativos</div>
                  <div className="w-full flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-sans leading-5">+5 este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 5: Hora / Voluntário */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start" style={{ gap: '16px' }}>
                <div className="flex-1 flex flex-col justify-start items-start" style={{ gap: '27px' }}>
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-sans leading-8">Hora / Voluntário</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-sans leading-10">
                    {Math.round(kpis.horaPorVoluntario).toLocaleString('pt-PT')}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-sans leading-5">Média por colaborador</div>
                  <div className="w-full flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-sans leading-5">+2h este mês</div>
                  </div>
                </div>
              </div>

              {/* Card 6: ONGs Apoiadas */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start" style={{ gap: '16px' }}>
                <div className="flex-1 flex flex-col justify-start items-start" style={{ gap: '27px' }}>
                  <div className="self-stretch justify-start text-gray-900 text-lg font-bold font-sans leading-8">ONGs Apoiadas</div>
                  <div className="w-64 justify-start text-gray-900 text-3xl font-semibold font-sans leading-10">
                    {kpis.ongsApoiadas}
                  </div>
                  <div className="w-64 justify-start text-gray-500 text-sm font-normal font-sans leading-5">Parceiros ativos</div>
                  <div className="w-full flex justify-start items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 justify-start text-green-600 text-sm font-normal font-sans leading-5">+1 este mês</div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Metas 2025 e Minhas Causas - 2 Colunas */}
            <div className="w-full flex justify-start items-start" style={{ gap: '24px' }}>
              {/* Card Metas 2025 */}
              <div className="flex-1 self-stretch p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex flex-col justify-start items-start" style={{ gap: '32px' }}>
                <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                  <div className="w-full flex flex-col justify-start items-start" style={{ gap: '4px' }}>
                    <div className="w-full" style={{ color: '#1E1E1E', fontSize: '24px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '28.80px', wordWrap: 'break-word' }}>Metas 2025</div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                  <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                    <div className="w-full flex justify-between items-end">
                      <div style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Horas</div>
                      <div style={{ color: '#595959', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '16.80px', wordWrap: 'break-word' }}>100€ doados</div>
                    </div>
                    <div className="w-full" style={{ height: '8px', background: '#F3F4F6', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <div className="flex-1" style={{ height: '24px', background: 'linear-gradient(135deg, #0086FF 30%, #00B5D3 63%, #00EAA2 100%)', borderRadius: '100px' }}></div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                  <div className="w-full flex justify-between items-end">
                    <div style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Eventos</div>
                    <div style={{ color: '#595959', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '16.80px', wordWrap: 'break-word' }}>1000 Horas</div>
                  </div>
                  <div className="w-full" style={{ height: '8px', background: '#F3F4F6', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <div style={{ width: '500px', height: '24px', background: 'linear-gradient(135deg, #0086FF 30%, #00B5D3 63%, #00EAA2 100%)', borderRadius: '100px' }}></div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                  <div className="w-full flex justify-between items-end">
                    <div style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Nº voluntários</div>
                    <div style={{ color: '#595959', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '16.80px', wordWrap: 'break-word' }}>50 participações</div>
                  </div>
                  <div className="w-full" style={{ height: '8px', background: '#F3F4F6', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <div style={{ width: '200px', height: '24px', background: 'linear-gradient(135deg, #0086FF 30%, #00B5D3 63%, #00EAA2 100%)', borderRadius: '100px' }}></div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                  <div className="w-full flex justify-between items-end">
                    <div style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Pessoas impactadas</div>
                    <div style={{ color: '#595959', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '16.80px', wordWrap: 'break-word' }}>5 Mentorandos</div>
                  </div>
                  <div className="w-full" style={{ height: '8px', background: '#F3F4F6', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <div style={{ width: '168px', height: '24px', background: 'linear-gradient(135deg, #0086FF 30%, #00B5D3 63%, #00EAA2 100%)', borderRadius: '100px' }}></div>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                  <div className="w-full flex justify-between items-end">
                    <div style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>ONGs de apoiadas</div>
                    <div style={{ color: '#595959', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '16.80px', wordWrap: 'break-word' }}>15 Colaborações</div>
                  </div>
                  <div className="w-full" style={{ height: '8px', background: '#F3F4F6', overflow: 'hidden', borderRadius: '8px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <div style={{ width: '200px', height: '24px', background: 'linear-gradient(135deg, #0086FF 30%, #00B5D3 63%, #00EAA2 100%)', borderRadius: '100px' }}></div>
                  </div>
                </div>
                <div className="flex justify-start items-start" style={{ gap: '8px' }}>
                  <button className="px-6 py-2 bg-black rounded-full flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                    <div style={{ color: '#F1F5F9', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '31.50px', wordWrap: 'break-word' }}>Adicionar Metas</div>
                  </button>
                </div>
              </div>

              {/* Card Minhas Causas */}
              <div className="self-stretch p-6 relative rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 overflow-hidden flex justify-start items-start" style={{ width: '644px', gap: '32px' }}>
                <div className="flex-1 self-stretch flex flex-col justify-start items-start" style={{ gap: '32px' }}>
                  <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                    <div className="w-full flex flex-col justify-start items-start" style={{ gap: '4px' }}>
                      <div className="w-full" style={{ color: '#1E1E1E', fontSize: '24px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '28.80px', wordWrap: 'break-word' }}>Minhas Causas</div>
                    </div>
                  </div>
                  <div className="w-full flex-1 flex justify-start items-start" style={{ gap: '32px' }}>
                    <div className="flex-1 self-stretch flex justify-start items-start" style={{ gap: '8px' }}>
                      <div className="flex-1 self-stretch overflow-y-auto max-h-[400px] flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                        <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                          <div className="w-full" style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Ambiente e Ação Climática</div>
                          <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                            <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Mitigação das Alterações Climáticas</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>24 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Emissões de Gases com Efeito de Estufa</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>12 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Transição para Energias Renováveis</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>02 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Economia Circular</div>
                                <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>07 iniciativas</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                          <div className="w-full" style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Direitos humanos e Proteção</div>
                          <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                            <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Proteção da criança</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>02 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Suporte à vítimas</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>12 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Suporte à vítimas</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>12 iniciativas</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                          <div className="w-full" style={{ color: '#595959', fontSize: '18px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '25.20px', wordWrap: 'break-word' }}>Saúde e Bem-Estar</div>
                          <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                            <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Proteção da criança</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>02 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Suporte à vítimas</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>12 iniciativas</span></div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col justify-start items-start" style={{ gap: '8px' }}>
                                <div className="w-full px-4 py-2 rounded-lg flex justify-start items-center overflow-hidden" style={{ background: '#DCFCE7' }}>
                                  <div className="flex-1" style={{ color: '#007A55', fontSize: '14px', fontFamily: 'Inter', fontWeight: '600', lineHeight: '19.60px', wordWrap: 'break-word' }}>Suporte à vítimas</div>
                                  <div><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '18px', wordWrap: 'break-word' }}>Participaste de </span><span style={{ color: '#007A55', fontSize: '12px', fontFamily: 'Inter', fontWeight: '700', lineHeight: '18px', wordWrap: 'break-word' }}>12 iniciativas</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-0 pointer-events-none" style={{ width: '644px', height: '123px', top: '439px', background: 'linear-gradient(180deg, rgba(248, 250, 252, 0) 30%, #F8FAFC 75%)' }}></div>
                <div className="self-stretch flex flex-col justify-start items-start" style={{ gap: '16px' }}>
                  <div className="flex-1 flex justify-start items-start" style={{ width: '16px', paddingLeft: '2px', paddingRight: '2px', gap: '10.67px' }}>
                    <div className="flex-1" style={{ height: '36px', background: '#1E293B', borderRadius: '533.33px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Iniciativas recentes e ONGs Favoritas - 2 Colunas */}
            <div className="w-full flex justify-start items-start" style={{ gap: '24px' }}>
              {/* Card Iniciativas recentes */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex flex-col justify-start items-start" style={{ gap: '32px' }}>
              <div className="w-full text-stone-900 text-2xl font-bold font-sans leading-7">Iniciativas recentes</div>
              <div className="w-full flex flex-col justify-start items-start gap-4">
                {iniciativasRecentes.length > 0 ? (
                  iniciativasRecentes.map((iniciativa) => (
                    <div key={iniciativa.id} className="w-full h-28 bg-white rounded-2xl shadow-lg outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-start overflow-hidden">
                      <div className="w-48 h-full flex justify-start items-center gap-2 relative">
                        {iniciativa.imagem ? (
                          <Image src={iniciativa.imagem} alt={iniciativa.titulo || 'Iniciativa'} fill className="flex-1 self-stretch object-cover" sizes="192px" />
                        ) : (
                          <div className="flex-1 self-stretch bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 h-full px-4 pt-2 pb-4 bg-white flex justify-start items-start">
                        <div className="flex-1 h-full flex justify-start items-start gap-2">
                          <div className="flex-1 h-full flex flex-col justify-between items-start">
                            <div className="w-full flex-1 flex flex-col justify-start items-start">
                              <div className="w-full text-gray-900 text-base font-bold font-sans leading-6">{iniciativa.titulo || 'Nome da Iniciativa'}</div>
                              <div className="w-full flex justify-start items-center gap-2">
                                <div className="text-gray-500 text-sm font-semibold font-sans leading-5">{iniciativa.localizacao || 'Location'}</div>
                                {iniciativa.dataInicio && (
                                  <div className="inline-flex flex-col justify-center items-start gap-1">
                                    <div className="flex justify-start items-start gap-3">
                                      <div className="flex justify-start items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div className="opacity-70 justify-start text-zinc-600 text-sm font-normal font-sans leading-5">{formatDateShort(iniciativa.dataInicio)}</div>
                                      </div>
                                      <div className="flex justify-start items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        <div className="opacity-70 justify-start text-zinc-600 text-sm font-normal font-sans leading-5">
                                          {formatTime(iniciativa.dataInicio)}
                                          {iniciativa.dataFim && ` - ${formatTime(iniciativa.dataFim)}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-full text-zinc-600 text-sm font-medium font-sans leading-4">{getTimeAgo(iniciativa.createdAt || iniciativa.dataInicio)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhuma iniciativa recente</p>
                )}
              </div>
              <button className="px-6 py-2 bg-black rounded-full inline-flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                <div className="justify-start text-white text-lg font-bold font-sans leading-8">Ver mais</div>
              </button>
            </div>

              {/* Card ONGs Favoritas */}
              <div className="flex-1 p-6 rounded-2xl outline outline-1 -outline-offset-px outline-gray-200 flex flex-col justify-start items-start" style={{ gap: '32px' }}>
              <div className="w-full text-stone-900 text-2xl font-bold font-sans leading-7">ONGs Favoritas</div>
              <div className="w-full flex flex-col justify-start items-start gap-4">
                {ongsFavoritas.length > 0 ? (
                  ongsFavoritas.map((ong) => (
                    <div key={ong.id} className="w-full h-28 bg-white rounded-2xl shadow-lg outline outline-1 -outline-offset-px outline-gray-200 flex justify-start items-center overflow-hidden">
                      <div className="w-48 h-full flex justify-start items-center gap-2 relative">
                        {ong.logo || ong.imagem ? (
                          <Image src={ong.logo || ong.imagem} alt={ong.nome} fill className="flex-1 self-stretch object-cover" sizes="192px" />
                        ) : (
                          <div className="flex-1 self-stretch bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 h-full px-4 pt-2 pb-4 bg-white flex justify-start items-center">
                        <div className="flex-1 h-full flex justify-end items-center gap-2">
                          <div className="flex-1 h-full flex flex-col justify-between items-start">
                            <div className="w-full flex flex-col justify-center items-start">
                              <div className="w-full text-gray-900 text-base font-bold font-sans leading-6">{ong.nome}</div>
                              <div className="w-full text-gray-500 text-sm font-semibold font-sans leading-5">{ong.localizacao || 'Location'}</div>
                            </div>
                            <div className="w-full flex justify-start items-center gap-2">
                              {ong.areas && ong.areas.slice(0, 2).map((area, idx) => (
                                <div key={idx} className="px-2 py-1 rounded-lg outline outline-1 -outline-offset-px outline-gray-200 flex justify-center items-center overflow-hidden">
                                  <div className="justify-start text-gray-500 text-sm font-semibold font-sans leading-5">
                                    {typeof area === 'object' ? area.tipo?.nome || area.nome : area}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="w-7 h-7 relative shadow-md">
                            <Heart className="w-5 h-5 left-0.5 top-0.5 absolute text-red-500 fill-red-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhuma ONG favorita</p>
                )}
              </div>
              <button className="px-6 py-2 bg-black rounded-full inline-flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors">
                <div className="justify-start text-white text-lg font-bold font-sans leading-8">Ver mais</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
