'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Users, Briefcase, FileText, Calendar, TrendingUp } from 'lucide-react';

export default function EmpresaDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [empresa, setEmpresa] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [periodo, setPeriodo] = useState('1M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [params.id]);

  const loadDashboardData = async () => {
    try {
      // Carregar dados da empresa via API
      const empresaRes = await fetch(`/api/empresas?id=${params.id}`);
      const empresaData = await empresaRes.json();
      
      if (empresaData.data && empresaData.data.length > 0) {
        setEmpresa(empresaData.data[0]);
      } else {
        // Dados mock se não encontrar
        setEmpresa({
          id: params.id,
          nome: 'Empresa Demo',
          setor: 'Tecnologia'
        });
      }

      setKpis({
        totalHoras: 1250,
        totalVoluntarios: 45,
        iniciativasAtivas: 8,
        propostasPendentes: 3
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Usar dados mock em caso de erro
      setEmpresa({
        id: params.id,
        nome: 'Empresa Demo',
        setor: 'Tecnologia'
      });
      setKpis({
        totalHoras: 1250,
        totalVoluntarios: 45,
        iniciativasAtivas: 8,
        propostasPendentes: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const getOdsImage = (numero) => {
    return `/ods/ods-${numero.toString().padStart(2, '0')}.png`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7AF691] via-white to-white">
      {/* Navegação Superior */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[102px] max-w-[1528px] mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-bold tracking-wider uppercase" style={{ fontFamily: 'Tilt Warp, sans-serif' }}>
                UNIVA
              </span>
            </Link>

            {/* Menu Central */}
            <nav className="hidden md:flex items-center gap-10">
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">Plataforma</a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">Planos</a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">Sobre</a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide">Blog</a>
            </nav>

            {/* Get Started Button */}
            <button className="bg-[#9FE870] text-black font-bold px-6 py-2 rounded-full hover:bg-[#8DD760] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Container Principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1496px]">
        {/* Header da Página */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-Vindo, {empresa?.nome || 'Empresa'}
            </h1>
            <div className="flex items-center bg-[#B7E9C1] rounded-lg p-1">
              <button
                onClick={() => setPeriodo('1D')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  periodo === '1D' ? 'bg-white text-gray-900' : 'text-gray-600'
                }`}
              >
                1D
              </button>
              <button
                onClick={() => setPeriodo('1M')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  periodo === '1M' ? 'bg-white text-gray-900' : 'text-gray-600'
                }`}
              >
                1M
              </button>
              <button
                onClick={() => setPeriodo('1Y')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  periodo === '1Y' ? 'bg-white text-gray-900' : 'text-gray-600'
                }`}
              >
                1Y
              </button>
              <button
                onClick={() => setPeriodo('Max')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  periodo === 'Max' ? 'bg-white text-gray-900' : 'text-gray-600'
                }`}
              >
                Max
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Acompanhe o resumo do impacto das suas atividades recentes
          </p>
        </div>

        {/* KPI Cards - 4 em linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-lg font-bold text-[#00395E] mb-1">Métrica 1</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis?.totalHoras || 0} Texto
                    </div>
                    <div className="text-sm text-gray-900">Texto</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">Texto</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <Clock className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-lg font-bold text-[#00395E] mb-1">Métrica 1</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis?.totalVoluntarios || 0} Texto
                    </div>
                    <div className="text-sm text-gray-900">Texto</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">Texto</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <Users className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-lg font-bold text-[#00395E] mb-1">Métrica 1</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis?.iniciativasAtivas || 0} Texto
                    </div>
                    <div className="text-sm text-gray-900">Texto</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">Texto</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <Briefcase className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-lg font-bold text-[#00395E] mb-1">Métrica 1</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[32px] font-bold text-gray-900 leading-tight">
                      {kpis?.propostasPendentes || 0} Texto
                    </div>
                    <div className="text-sm text-gray-900">Texto</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#007104]" />
                    <span className="font-semibold text-[#007104]">Texto</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 text-gray-400">
                <FileText className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos Principais - 2 Cards Grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico 1 - Métrica 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Métrica 1</h3>
            </div>
            <div className="h-[373px] border border-gray-200 rounded-lg p-4 bg-white">
              {/* Placeholder para gráfico de linha */}
              <div className="h-full flex flex-col justify-between">
                <div className="flex justify-end gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Label</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    <span className="text-gray-600">Label</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                    <span className="text-gray-600">Label</span>
                  </div>
                </div>
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-sm">Gráfico de linha em desenvolvimento</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico 2 - Métrica 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Métrica 2</h3>
            </div>
            <div className="h-[373px] border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-center gap-8 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Label</span>
                </div>
              </div>
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-sm">Gráfico de barras em desenvolvimento</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos Secundários - 2 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico 3 - Métrica 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Métrica 3</h3>
            </div>
            <div className="h-[300px] border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-center gap-8 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                  <span className="text-gray-600">Label</span>
                </div>
              </div>
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-sm">Gráfico circular em desenvolvimento</span>
              </div>
            </div>
          </div>

          {/* Gráfico 4 - Métrica 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Métrica 4</h3>
            </div>
            <div className="h-[300px] border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-center gap-8 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                  <span className="text-gray-600">Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-400"></div>
                  <span className="text-gray-600">Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-200"></div>
                  <span className="text-gray-600">Label</span>
                </div>
              </div>
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-sm">Gráfico em desenvolvimento</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seções Inferiores - 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Coluna Esquerda: Metas + ODS */}
          <div className="space-y-8">
            {/* Metas para 2026 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Metas para 2026</h2>
              <div className="space-y-4">
                {/* Meta 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Doações</span>
                    <span className="text-xs font-bold text-gray-900">100€ doados</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg"
                      style={{
                        width: '40%',
                        background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Meta 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Número de Horas</span>
                    <span className="text-xs font-bold text-gray-900">1000 Horas</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg"
                      style={{
                        width: '75%',
                        background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Meta 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Voluntariados Feitos</span>
                    <span className="text-xs font-bold text-gray-900">50 participações</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg"
                      style={{
                        width: '30%',
                        background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Meta 4 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Mentorias</span>
                    <span className="text-xs font-bold text-gray-900">5 Mentorandos</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg"
                      style={{
                        width: '25%',
                        background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Meta 5 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Apoio a Causas Humanitárias</span>
                    <span className="text-xs font-bold text-gray-900">15 Colaborações</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg"
                      style={{
                        width: '60%',
                        background: 'linear-gradient(90deg, #7EC2FF 2%, #4A9EFF 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ODS Que queremos trabalhar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ODS Que queremos trabalhar</h2>
              <div className="flex flex-wrap gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((num) => (
                  <div key={num} className="relative w-20 h-20">
                    <Image
                      src={getOdsImage(num)}
                      alt={`ODS ${num}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Causas + ONGs Favoritas */}
          <div className="space-y-8">
            {/* Minhas Causas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Minhas Causas</h2>
              <div className="space-y-4">
                {/* Humanitárias */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Humanitárias</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Violência Sexual', 'Violência Doméstica', 'Infância e Juventude', 'Combate as Drogas'].map((causa) => (
                      <span key={causa} className="bg-[#EDF5FF] text-[#193CC8] px-3 py-1.5 rounded text-sm font-medium">
                        {causa}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bem-estar Animal */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Bem-estar Animal</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Vegetarianismo', 'Violência Animal', 'Adoção', 'Castração'].map((causa) => (
                      <span key={causa} className="bg-[#EDF5FF] text-[#193CC8] px-3 py-1.5 rounded text-sm font-medium">
                        {causa}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Igualdade e Direitos Humanos */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Igualdade e Direitos Humanos</h3>
                  <div className="flex flex-wrap gap-4">
                    {['LGBTQIA+', 'Racismo', 'Imigração'].map((causa) => (
                      <span key={causa} className="bg-[#EDF5FF] text-[#193CC8] px-3 py-1.5 rounded text-sm font-medium">
                        {causa}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ONGs Favoritas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ONGs Favoritas</h2>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">Organização favorita</h4>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-[#EDF5FF] text-[#193CC8] px-2 py-1 rounded text-xs font-medium">
                          Objetivos Desenvolvimento sustentável
                        </span>
                        <span className="bg-[#EDF5FF] text-[#193CC8] px-2 py-1 rounded text-xs font-medium">
                          Objetivos Desenvolvimento sustentável
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                      ❤️
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seções Finais - 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas oportunidades para Si */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Próximas oportunidades para Si
            </h2>
            <div className="space-y-4">
              {[
                { titulo: 'Doações de Cestas Básicas', tempo: '2 semanas atrás' },
                { titulo: 'Refeições para refugiados', tempo: '1 Mês atrás' },
                { titulo: 'Distribuição de refeições na Batalha', tempo: '2 Meses atrás' }
              ].map((oportunidade, i) => (
                <div key={i} className="flex gap-8 p-4 border border-gray-100 rounded-lg">
                  <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {oportunidade.titulo}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Porto, Portugal
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Help provide nutritious food and a warm environment for those in need.
                    </p>
                    <p className="text-sm text-gray-600">{oportunidade.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meus Certificados */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meus Certificados</h2>
            <div className="space-y-4">
              {[
                'Participação na distribuição de refeições na Batalha',
                'Horas de colaboração com o Centro Comunitário do Porto',
                'Formação Curta de Desenvolvimento e Sustentabilidade'
              ].map((certificado, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900">{certificado}</h4>
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      📄
                    </div>
                  </div>
                  <div className="w-full h-px bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
