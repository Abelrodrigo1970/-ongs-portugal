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
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1528px] mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            {/* Logo e Boas-vindas */}
            <div className="flex items-start gap-4">
              {/* Logo FF */}
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">FF</span>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Bem-Vinda, {empresa?.nome || 'Empresa'}
                </h1>
                <p className="text-sm text-gray-600">
                  Acompanhe o resumo do impacto das tuas atividades recentes.
                </p>
              </div>
            </div>

            {/* Seletor de Data e Impact Score */}
            <div className="flex items-start gap-6">
              {/* Seletores de Ano e Mês */}
              <div className="flex gap-2">
                <select
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-900"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-900 capitalize"
                >
                  {meses.map(m => (
                    <option key={m} value={m} className="capitalize">{m}</option>
                  ))}
                </select>
              </div>

              {/* UNIVA Impact Score Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">UNIVA Impact Score</span>
                  <Info size={16} className="text-gray-400" />
                </div>
                <div 
                  className="text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(177.14deg, rgba(0, 134, 255, 1) 16.451%, rgba(0, 181, 211, 1) 54.473%, rgba(0, 234, 162, 1) 97.15%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {impactScore.toFixed(1)}
                </div>
              </div>

              {/* Botão Exportar Relatório */}
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-800 transition-colors">
                <Download size={18} />
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1528px] mx-auto px-6 py-8">
        {/* 6 Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Horas de voluntariado */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-base font-bold text-[#00395E] mb-4">Horas de voluntariado</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {Math.round(kpis.horasVoluntariado).toLocaleString('pt-PT')}
                    </div>
                    <div className="text-sm text-gray-500">Total acumulado</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">+12% este mês</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <Clock className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Card 2: Número de pessoas impactadas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-base font-bold text-[#00395E] mb-4">Número de pessoas impactadas</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis.pessoasImpactadas.toLocaleString('pt-PT')}
                    </div>
                    <div className="text-sm text-gray-500">Pessoas beneficiadas</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">+8% este mês</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Voluntários */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-base font-bold text-[#00395E] mb-4">Voluntários</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis.voluntarios}
                    </div>
                    <div className="text-sm text-gray-500">Colaboradores ativos</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">+5 este mês</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Eventos */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-base font-bold text-[#00395E] mb-4">Eventos</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis.eventos}
                    </div>
                    <div className="text-sm text-gray-500">Eventos participados</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">+3 este mês</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <Calendar className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Card 5: Hora / Voluntário */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-base font-bold text-[#00395E] mb-4">Hora / Voluntário</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {Math.round(kpis.horaPorVoluntario).toLocaleString('pt-PT')}
                    </div>
                    <div className="text-sm text-gray-500">Média por colaborador</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">+2h este mês</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <Clock className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Card 6: ONGs Apoiadas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-base font-bold text-[#00395E] mb-4">ONGs Apoiadas</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis.ongsApoiadas}
                    </div>
                    <div className="text-sm text-gray-500">Parceiros ativos</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">+1 este mês</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Metas 2025 e Minhas Causas - 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card Metas 2025 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Metas 2025</h2>
            <div className="space-y-5">
              {/* Meta 1: Horas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Horas</span>
                  <span className="text-xs font-bold text-gray-900">1000 Horas</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '75%',
                      background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Meta 2: Eventos */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Eventos</span>
                  <span className="text-xs font-bold text-gray-900">50 participações</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '30%',
                      background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Meta 3: Nº voluntários */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Nº voluntários</span>
                  <span className="text-xs font-bold text-gray-900">100€ doados</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '40%',
                      background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Meta 4: Pessoas impactadas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Pessoas impactadas</span>
                  <span className="text-xs font-bold text-gray-900">5 Mentorandos</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '25%',
                      background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Meta 5: ONGs de apoiadas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">ONGs de apoiadas</span>
                  <span className="text-xs font-bold text-gray-900">15 Colaborações</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '60%',
                      background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Adicionar Metas
            </button>
          </div>

          {/* Card Minhas Causas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Minhas Causas</h2>
            <div className="space-y-6">
              {causas.length > 0 ? (
                // Agrupar causas por categoria (mock - pode ser melhorado depois)
                <>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Ambiente e Ação Climática</h3>
                    <div className="space-y-3">
                      {causas.filter(c => 
                        typeof c === 'object' && c.causa && 
                        (c.causa.nome?.toLowerCase().includes('ambiente') || 
                         c.causa.nome?.toLowerCase().includes('clima') ||
                         c.causa.nome?.toLowerCase().includes('energia'))
                      ).map((causa, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-700">{causa.causa?.nome || causa.nome}</span>
                          <span className="text-sm font-medium text-gray-600">
                            Participaste de {iniciativasRecentes.filter(i => i.causaId === causa.causaId || i.causa?.id === causa.causaId).length} iniciativas
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Direitos humanos e Proteção</h3>
                    <div className="space-y-3">
                      {causas.filter(c => 
                        typeof c === 'object' && c.causa && 
                        (c.causa.nome?.toLowerCase().includes('direitos') || 
                         c.causa.nome?.toLowerCase().includes('proteção') ||
                         c.causa.nome?.toLowerCase().includes('criança'))
                      ).map((causa, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-700">{causa.causa?.nome || causa.nome}</span>
                          <span className="text-sm font-medium text-gray-600">
                            Participaste de {iniciativasRecentes.filter(i => i.causaId === causa.causaId || i.causa?.id === causa.causaId).length} iniciativas
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Saúde e Bem-Estar</h3>
                    <div className="space-y-3">
                      {causas.filter(c => 
                        typeof c === 'object' && c.causa && 
                        c.causa.nome?.toLowerCase().includes('saúde')
                      ).map((causa, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-700">{causa.causa?.nome || causa.nome}</span>
                          <span className="text-sm font-medium text-gray-600">
                            Participaste de {iniciativasRecentes.filter(i => i.causaId === causa.causaId || i.causa?.id === causa.causaId).length} iniciativas
                          </span>
                        </div>
                      ))}
                      {causas.filter(c => 
                        typeof c === 'object' && c.causa && 
                        c.causa.nome?.toLowerCase().includes('saúde')
                      ).length === 0 && (
                        <p className="text-sm text-gray-500">Nenhuma causa nesta categoria</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // Mock data quando não há causas
                <>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Ambiente e Ação Climática</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Mitigação das Alterações Climáticas</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 24 iniciativas</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Emissões de Gases com Efeito de Estufa</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 12 iniciativas</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Transição para Energias Renováveis</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 02 iniciativas</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Economia Circular</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 07 iniciativas</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Direitos humanos e Proteção</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Proteção da criança</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 02 iniciativas</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Suporte à vitimas</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 12 iniciativas</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Saúde e Bem-Estar</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700">Saúde Mental</span>
                        <span className="text-sm font-medium text-gray-600">Participaste de 08 iniciativas</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Iniciativas recentes e ONGs Favoritas - 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Iniciativas recentes */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Iniciativas recentes</h2>
            <div className="space-y-4">
              {iniciativasRecentes.length > 0 ? (
                iniciativasRecentes.map((iniciativa) => (
                  <div key={iniciativa.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    {iniciativa.imagem ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={iniciativa.imagem}
                          alt={iniciativa.titulo || 'Iniciativa'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-gray-900 mb-1 truncate">
                        {iniciativa.titulo || 'Nome da Iniciativa'}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                        <MapPin size={14} />
                        <span className="truncate">{iniciativa.localizacao || 'Location'}</span>
                      </div>
                      {iniciativa.dataInicio && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatDateShort(iniciativa.dataInicio)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>
                              {formatTime(iniciativa.dataInicio)}
                              {iniciativa.dataFim && ` - ${formatTime(iniciativa.dataFim)}`}
                            </span>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">{getTimeAgo(iniciativa.createdAt || iniciativa.dataInicio)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">Nenhuma iniciativa recente</p>
              )}
            </div>
            <button className="w-full mt-6 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Ver mais
            </button>
          </div>

          {/* Card ONGs Favoritas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">ONGs Favoritas</h2>
            <div className="space-y-4">
              {ongsFavoritas.length > 0 ? (
                ongsFavoritas.map((ong) => (
                  <div key={ong.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    {ong.logo ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={ong.logo}
                          alt={ong.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-gray-900 mb-1 truncate">
                        {ong.nome}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                        <MapPin size={14} />
                        <span className="truncate">{ong.localizacao || 'Location'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ong.areas && ong.areas.slice(0, 2).map((area, idx) => (
                          <span 
                            key={idx}
                            className="bg-[#EDF5FF] text-[#193CC8] px-2 py-1 rounded text-xs font-medium"
                          >
                            {typeof area === 'object' ? area.tipo?.nome || area.nome : area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Heart size={20} className="text-red-500 fill-red-500 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">Nenhuma ONG favorita</p>
              )}
            </div>
            <button className="w-full mt-6 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Ver mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
