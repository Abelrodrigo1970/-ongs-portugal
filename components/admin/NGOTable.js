'use client';

import Image from 'next/image';
import { Edit2, Trash2, Eye, EyeOff, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const getOdsImage = (numero) => `/ods/ods-${numero.toString().padStart(2, '0')}.png`;

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <div className="animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  </Card>
);

export default function NGOTable({ ngos, onEdit, onDelete, onToggleVisibility, loading }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!ngos || ngos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Nenhuma ONG encontrada</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {ngos.map((ngo) => {
        const odsList = ngo.ods?.map((ngoods) => ngoods.ods) || [];
        const areasList = ngo.areaAtuacao?.map((area) => area.tipo.nome) || [];

        return (
          <Card key={ngo.id} className="overflow-hidden border-gray-200 shadow-sm">
            <div className="relative h-48 bg-gray-100">
              {ngo.imagem ? (
                <Image
                  src={ngo.imagem}
                  alt={ngo.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  {ngo.logo ? (
                    <Image src={ngo.logo} alt={ngo.nome} width={96} height={96} className="object-contain" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
                      {ngo.nome?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              <Badge
                variant={ngo.visivel ? 'success' : 'secondary'}
                className="absolute top-4 left-4 shadow"
              >
                {ngo.visivel ? 'Visível' : 'Oculta'}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm border border-white/40 text-gray-700"
                onClick={() => onToggleVisibility(ngo)}
                title={ngo.visivel ? 'Ocultar ONG' : 'Mostrar ONG'}
              >
                {ngo.visivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{ngo.nome}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{ngo.descricao}</p>
              </div>

              {odsList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {odsList.slice(0, 4).map((ods) => (
                    <div key={ods.id} className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={getOdsImage(ods.numero)}
                        alt={`ODS ${ods.numero}`}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ))}
                  {odsList.length > 4 && (
                    <Badge variant="primary" size="sm">
                      +{odsList.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {areasList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {areasList.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="primary" size="sm">
                      {area}
                    </Badge>
                  ))}
                  {areasList.length > 2 && (
                    <Badge variant="secondary" size="sm">
                      +{areasList.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{ngo.localizacao}</span>
              </div>
            </div>

            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onEdit(ngo)}
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </Button>

              <Button
                variant="danger"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => onDelete(ngo)}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

