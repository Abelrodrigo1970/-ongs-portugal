import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getNGOById, getRelatedNGOs } from '@/lib/repositories/ngos';
import OdsBadge from '@/components/OdsBadge';
import NgoCard from '@/components/NgoCard';
import LeafletMap from '@/components/LeafletMap';
import ResponsiveVideo from '@/components/ResponsiveVideo';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  MapPin, 
  Mail, 
  Phone,
  Globe,
  Video,
  Instagram
} from 'lucide-react';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const ngo = await getNGOById(params.id);
  
  if (!ngo) {
    return {
      title: 'ONG não encontrada',
    };
  }

  return {
    title: `${ngo.nome} - ONGs Portugal`,
    description: ngo.descricao,
  };
}

export default async function NGODetailPage({ params }) {
  const [ngo, relatedNGOs] = await Promise.all([
    getNGOById(params.id),
    getRelatedNGOs(params.id, 4)
  ]);

  if (!ngo) {
    notFound();
  }

  const odsList = ngo.ods?.map(ngoods => ngoods.ods) || [];
  const areasList = ngo.areaAtuacao?.map(area => area.tipo.nome) || [];
  const colaboracaoList = ngo.colaboracao?.map(colab => colab.tipo.nome) || [];

  const mapCenter = ngo.latitude && ngo.longitude 
    ? [ngo.latitude, ngo.longitude] 
    : [38.7223, -9.1393]; // Default to Lisbon

  const mapMarkers = ngo.latitude && ngo.longitude 
    ? [{
        position: [ngo.latitude, ngo.longitude],
        popup: {
          title: ngo.nome,
          description: ngo.localizacao
        }
      }]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        {ngo.imagem && (
          <Image
            src={ngo.imagem}
            alt={`${ngo.nome} - Imagem de capa`}
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="container-custom relative h-full flex items-end">
          <div className="pb-8">
            <div className="flex items-center space-x-4 mb-4">
              {ngo.logo && (
                <div className="w-16 h-16 bg-white rounded-full p-2">
                  <Image
                    src={ngo.logo}
                    alt={`Logo ${ngo.nome}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {ngo.nome}
                </h1>
                <p className="text-primary-200 text-lg">
                  {ngo.localizacao}
                </p>
              </div>
            </div>
            
            {odsList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {odsList.map(ods => (
                  <OdsBadge
                    key={ods.id}
                    numero={ods.numero}
                    nome={ods.nome}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Missão */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Missão</h2>
              <p className="text-gray-700 leading-relaxed">{ngo.missao}</p>
            </Card>

            {/* Descrição */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre</h2>
              <p className="text-gray-700 leading-relaxed">{ngo.descricao}</p>
            </Card>

            {/* Impacto */}
            {ngo.impacto && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Impacto</h2>
                <ul className="space-y-3">
                  {JSON.parse(ngo.impacto).map((impacto, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700">{impacto}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Áreas de Atuação */}
            {areasList.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Áreas de Atuação</h2>
                <div className="flex flex-wrap gap-2">
                  {areasList.map((area, index) => (
                    <Badge key={index} variant="primary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Tipos de Colaboração */}
            {colaboracaoList.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Pode Colaborar</h2>
                <div className="flex flex-wrap gap-2">
                  {colaboracaoList.map((colab, index) => (
                    <Badge key={index} variant="secondary">
                      {colab}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Localização */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Localização</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{ngo.localizacao}</span>
                </div>
                <LeafletMap
                  center={mapCenter}
                  zoom={ngo.latitude && ngo.longitude ? 12 : 6}
                  markers={mapMarkers}
                  className="h-64 w-full rounded-lg"
                />
              </div>
            </Card>

            {/* Vídeo */}
            {ngo.videoUrl && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vídeo</h2>
                <ResponsiveVideo
                  url={ngo.videoUrl}
                  title={`Vídeo da ${ngo.nome}`}
                  className="aspect-video w-full rounded-lg overflow-hidden"
                />
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <a 
                    href={`mailto:${ngo.email}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {ngo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <a 
                    href={`tel:${ngo.telefone}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {ngo.telefone}
                  </a>
                </div>
              </div>
            </Card>

            {/* Links */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Links</h3>
              <div className="space-y-3">
                {ngo.websiteUrl && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <a 
                      href={ngo.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Website
                    </a>
                  </div>
                )}
                {ngo.instagramUrl && (
                  <div className="flex items-center space-x-3">
                    <Instagram className="h-5 w-5 text-gray-500" />
                    <a 
                      href={ngo.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Instagram
                    </a>
                  </div>
                )}
                {ngo.videoUrl && (
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-gray-500" />
                    <a 
                      href={ngo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Vídeo
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Related ONGs */}
            {relatedNGOs.length > 0 && (
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4">ONGs Relacionadas</h3>
                <div className="space-y-4">
                  {relatedNGOs.map((relatedNGO) => (
                    <NgoCard key={relatedNGO.id} ngo={relatedNGO} />
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

