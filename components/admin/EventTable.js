'use client';

import Image from 'next/image';
import { Calendar, Edit2, MapPin, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const TableSkeleton = () => (
  <Card className="border-gray-200 shadow-sm overflow-hidden">
    <div className="divide-y divide-gray-200 animate-pulse">
      <div className="h-12 bg-slate-100" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 bg-white" />
      ))}
    </div>
  </Card>
);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function EventTable({ events, onEdit, onDelete, loading }) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (!events || events.length === 0) {
    return (
      <Card className="p-8 text-center border-gray-200 shadow-sm">
        <p className="text-gray-600">Nenhum evento encontrado</p>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-emerald-600 text-white text-xs uppercase tracking-wide">
              <th className="px-6 py-4 text-left font-semibold">Evento</th>
              <th className="px-6 py-4 text-left font-semibold">Informações</th>
              <th className="px-6 py-4 text-left font-semibold">ONG</th>
              <th className="px-6 py-4 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {event.imagem ? (
                        <Image
                          src={event.imagem}
                          alt={event.nome}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 line-clamp-2">{event.nome}</div>
                      <span className="text-xs uppercase tracking-wide text-gray-500">{event.tipo}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(event.dataInicio)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="truncate max-w-sm">{event.morada}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{event.ngo?.nome || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => onEdit(event)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => onDelete(event)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

