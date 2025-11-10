'use client';

import Image from 'next/image';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <div className="animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="h-12 bg-gray-100" />
    </div>
  </Card>
);

export default function NGOTable({ ngos, onEdit, onDelete, loading }) {
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
      {ngos.map((ngo) => (
        <Card key={ngo.id} className="overflow-hidden border-gray-200 shadow-sm">
          <div className="relative h-36 bg-gray-100">
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
                  <Image src={ngo.logo} alt={ngo.nome} width={80} height={80} className="object-contain" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                    {ngo.nome?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{ngo.nome}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{ngo.localizacao}</span>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 flex items-center gap-2 border-t border-gray-100">
            <Button
              variant="primary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => onEdit(ngo)}
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </Button>

            <Button
              variant="danger"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => onDelete(ngo)}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

