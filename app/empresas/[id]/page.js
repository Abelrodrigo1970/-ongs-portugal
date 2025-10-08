import { getEmpresaById } from '@/lib/repositories/empresas';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Globe, Building2, Users, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function EmpresaPage({ params }) {
  const empresa = await getEmpresaById(params.id);

  if (!empresa) {
    notFound();
  }

  const odsList = empresa.ods?.map(eo => eo.ods) || [];
  const causasList = empresa.causas?.map(ec => ec.causa) || [];
  const tiposApoioList = empresa.tiposApoio?.map(eta => eta.tipoApoio) || [];

  // Calcular total de horas (últimos 12 meses)
  const totalHoras = empresa.estatisticas?.reduce((sum, stat) => sum + (stat.horasVoluntariado || 0), 0) || 0;
  const totalProjetos = empresa.estatisticas?.reduce((sum, stat) => sum + (stat.numProjetos || 0), 0) || 0;
  const totalVoluntarios = empresa.estatisticas?.reduce((sum, stat) => sum + (stat.numVoluntarios || 0), 0) || 0;

  // Função para obter imagem ODS
  const getOdsImage = (numero) => `/ods/ods-${numero.toString().padStart(2, '0')}.png`;

  // Função para formatar tipo de apoio
  const formatTipoApoio = (tipo) => {
    const tipos = {
      'TEMPO_VOLUNTARIADO': 'Tempo/Voluntariado',
      'CONHECIMENTO_CAPACITACAO': 'Conhecimento/Capacitação',
      'RECURSOS_SERVICOS': 'Recursos/Serviços',
      'PRODUTOS_BENS': 'Produtos/Bens'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="relative w-24 h-24 bg-white rounded-lg p-2 flex-shrink-0">
              {empresa.logo ? (
                <Image
                  src={empresa.logo}
                  alt={`Logo ${empresa.nome}`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-primary-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{empresa.nome}</h1>
              {empresa.setor && (
                <p className="text-lg text-green-100">{empresa.setor}</p>
              )}
            </div>

            {/* Dashboard Link */}
            <div>
              <Link href={`/empresas/dashboard/${empresa.id}`}>
                <Button variant="secondary" size="lg">
                  Ver Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Missão */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Missão</h2>
              <p className="text-gray-700 leading-relaxed">{empresa.missao}</p>
              {empresa.descricao && (
                <p className="text-gray-700 leading-relaxed mt-4">{empresa.descricao}</p>
              )}
            </section>

            {/* Estatísticas de Impacto */}
            {(totalHoras > 0 || totalProjetos > 0) && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Impacto Gerado</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-700">{Math.round(totalHoras)}h</div>
                    <div className="text-sm text-gray-600 mt-1">Horas de Voluntariado</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-700">{totalProjetos}</div>
                    <div className="text-sm text-gray-600 mt-1">Projetos Apoiados</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-700">{totalVoluntarios}</div>
                    <div className="text-sm text-gray-600 mt-1">Voluntários Ativos</div>
                  </div>
                </div>
              </section>
            )}

            {/* Iniciativas Ativas */}
            {empresa.iniciativas && empresa.iniciativas.length > 0 && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Iniciativas Ativas</h2>
                <div className="space-y-4">
                  {empresa.iniciativas.map((iniciativa) => (
                    <div key={iniciativa.id} className="border-l-4 border-primary-600 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900">{iniciativa.titulo}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{iniciativa.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{new Date(iniciativa.dataInicio).toLocaleDateString('pt-PT')}</span>
                        <span className="text-primary-600">{formatTipoApoio(iniciativa.tipoApoio)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ODS Trabalhados */}
            {odsList.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">ODS Trabalhados</h3>
                <div className="grid grid-cols-3 gap-2">
                  {odsList.map(ods => (
                    <div key={ods.id} className="relative w-full aspect-square">
                      <Image
                        src={getOdsImage(ods.numero)}
                        alt={`ODS ${ods.numero}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tipos de Apoio */}
            {tiposApoioList.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tipos de Apoio</h3>
                <div className="space-y-2">
                  {tiposApoioList.map((tipoApoio) => (
                    <div key={tipoApoio.id} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-gray-900">{tipoApoio.nome}</div>
                        {tipoApoio.descricao && (
                          <div className="text-sm text-gray-600">{tipoApoio.descricao}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Causas Apoiadas */}
            {causasList.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Causas Apoiadas</h3>
                <div className="flex flex-wrap gap-2">
                  {causasList.map((causa) => (
                    <span
                      key={causa.id}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {causa.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contactos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contacto</h3>
              <div className="space-y-3">
                {empresa.email && (
                  <a href={`mailto:${empresa.email}`} className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm truncate">{empresa.email}</span>
                  </a>
                )}
                {empresa.telefone && (
                  <a href={`tel:${empresa.telefone}`} className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors">
                    <Phone className="h-5 w-5" />
                    <span className="text-sm">{empresa.telefone}</span>
                  </a>
                )}
                {empresa.website && (
                  <a href={empresa.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors">
                    <Globe className="h-5 w-5" />
                    <span className="text-sm truncate">Website</span>
                  </a>
                )}
                {empresa.localizacao && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm">{empresa.localizacao}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-sm p-6 text-center text-white">
              <h3 className="text-xl font-bold mb-2">Interessado em colaborar?</h3>
              <p className="text-green-100 mb-4">Entre em contacto para conhecer oportunidades de parceria.</p>
              <Button variant="secondary" size="lg">
                Enviar Proposta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
