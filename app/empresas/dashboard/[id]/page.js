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

      <div className="container mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Métricas Principais</h2>
          {kpis && <KPICards kpis={kpis} />}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ImpactoChart data={evolucaoHoras} />
          <ProjetosChart data={projetosPorCausa} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VoluntariadoChart data={distribuicaoTipoApoio} />
          
          {/* Resumo Rápido */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Anual {currentYear}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Horas Totais</span>
                <span className="text-xl font-bold text-green-600">
                  {Math.round(kpis?.totalHoras || 0)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projetos</span>
                <span className="text-xl font-bold text-blue-600">
                  {kpis?.totalProjetos || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Voluntários</span>
                <span className="text-xl font-bold text-purple-600">
                  {kpis?.totalVoluntarios || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Iniciativas e Propostas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Iniciativas Ativas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Iniciativas Ativas</h2>
            {iniciativasResult.iniciativas.length > 0 ? (
              <div className="space-y-4">
                {iniciativasResult.iniciativas.map((iniciativa) => (
                  <IniciativaCard key={iniciativa.id} iniciativa={iniciativa} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                Nenhuma iniciativa ativa
              </div>
            )}
          </div>

          {/* Propostas Pendentes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propostas Pendentes</h2>
            {propostasResult.propostas.length > 0 ? (
              <div className="space-y-4">
                {propostasResult.propostas.map((proposta) => (
                  <PropostaCard key={proposta.id} proposta={proposta} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                Nenhuma proposta pendente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
