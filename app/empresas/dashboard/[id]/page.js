import { getEmpresaById } from '@/lib/repositories/empresas';
import { getEmpresaKPIs, getEvolucaoHoras, getProjetosPorCausa, getDistribuicaoTipoApoio } from '@/lib/repositories/dashboard';
import { getIniciativas } from '@/lib/repositories/iniciativas';
import { getPropostas } from '@/lib/repositories/propostas';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import KPICards from '@/components/empresa/Dashboard/KPICards';
import ImpactoChart from '@/components/empresa/Dashboard/ImpactoChart';
import ProjetosChart from '@/components/empresa/Dashboard/ProjetosChart';
import VoluntariadoChart from '@/components/empresa/Dashboard/VoluntariadoChart';
import IniciativaCard from '@/components/IniciativaCard';
import PropostaCard from '@/components/PropostaCard';

export const dynamic = 'force-dynamic';

export default async function EmpresaDashboardPage({ params }) {
  const empresa = await getEmpresaById(params.id);

  if (!empresa) {
    notFound();
  }

  const currentYear = new Date().getFullYear();

  const [
    kpis,
    evolucaoHoras,
    projetosPorCausa,
    distribuicaoTipoApoio,
    iniciativasResult,
    propostasResult
  ] = await Promise.all([
    getEmpresaKPIs(params.id),
    getEvolucaoHoras(params.id, currentYear - 1),
    getProjetosPorCausa(params.id),
    getDistribuicaoTipoApoio(params.id),
    getIniciativas({ empresaId: params.id, status: 'ATIVA', limit: 6 }),
    getPropostas({ empresaId: params.id, status: 'PENDENTE', limit: 6 })
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/empresas/${params.id}`}
            className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Perfil
          </Link>
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">{empresa.nome}</h1>
              <p className="text-green-100">Dashboard de Impacto</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* KPIs - Cards de Métricas */}
        <div className="mb-8">
          {kpis && <KPICards kpis={kpis} />}
        </div>

        {/* Gráficos - Layout 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evolução de Horas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Evolução de Horas</h3>
              <p className="text-sm text-gray-500">Últimos 12 meses</p>
            </div>
            <ImpactoChart data={evolucaoHoras} />
          </div>

          {/* Projetos por Causa */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Projetos por Causa</h3>
              <p className="text-sm text-gray-500">Distribuição total</p>
            </div>
            <ProjetosChart data={projetosPorCausa} />
          </div>

          {/* Voluntariado por Tipo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tipo de Apoio</h3>
              <p className="text-sm text-gray-500">Distribuição de voluntariado</p>
            </div>
            <VoluntariadoChart data={distribuicaoTipoApoio} />
          </div>
          
          {/* Resumo Rápido */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-sm p-6 text-white">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Resumo {currentYear}</h3>
              <p className="text-sm text-primary-100">Impacto acumulado</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-primary-500/30">
                <div>
                  <p className="text-sm text-primary-100">Horas Totais</p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.round(kpis?.totalHoras || 0)}h
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-primary-500/30">
                <div>
                  <p className="text-sm text-primary-100">Projetos Ativos</p>
                  <p className="text-3xl font-bold mt-1">
                    {kpis?.totalProjetos || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm text-primary-100">Voluntários</p>
                  <p className="text-3xl font-bold mt-1">
                    {kpis?.totalVoluntarios || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Iniciativas e Propostas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Iniciativas Ativas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Iniciativas Ativas</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {iniciativasResult.iniciativas.length} em progresso
                </p>
              </div>
              <span className="text-2xl">🚀</span>
            </div>
            {iniciativasResult.iniciativas.length > 0 ? (
              <div className="space-y-4">
                {iniciativasResult.iniciativas.map((iniciativa) => (
                  <IniciativaCard key={iniciativa.id} iniciativa={iniciativa} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <span className="text-4xl mb-3 block">📝</span>
                <p className="text-sm">Nenhuma iniciativa ativa</p>
              </div>
            )}
          </div>

          {/* Propostas Pendentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Propostas Pendentes</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {propostasResult.propostas.length} aguardando resposta
                </p>
              </div>
              <span className="text-2xl">📩</span>
            </div>
            {propostasResult.propostas.length > 0 ? (
              <div className="space-y-4">
                {propostasResult.propostas.map((proposta) => (
                  <PropostaCard key={proposta.id} proposta={proposta} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <span className="text-4xl mb-3 block">✅</span>
                <p className="text-sm">Nenhuma proposta pendente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
