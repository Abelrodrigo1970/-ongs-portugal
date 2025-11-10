'use client';

import { Calendar, Edit2, Eye, EyeOff, MapPin, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

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

export default function EventTable({ events, onEdit, onDelete, onToggleVisibility, loading }) {
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
            <tr className="bg-slate-900 text-white text-xs uppercase tracking-wide">
              <th className="px-6 py-4 text-left font-semibold">Nome</th>
              <th className="px-6 py-4 text-left font-semibold">ONG</th>
              <th className="px-6 py-4 text-left font-semibold">Data</th>
              <th className="px-6 py-4 text-left font-semibold">Local</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {events.map((event) => {
              const isVisible = event.visivel !== false;

              return (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 space-y-1">
                    <div className="font-semibold text-gray-900">{event.nome}</div>
                    <span className="text-xs uppercase tracking-wide text-gray-500">{event.tipo}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{event.ngo?.nome || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(event.dataInicio)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="truncate max-w-xs">{event.localizacao}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-fit">
                      <Badge variant={isVisible ? 'success' : 'secondary'} size="sm">
                        {isVisible ? 'Visível' : 'Oculto'}
                      </Badge>
                      <Badge
                        variant={event.inscricoesAbertas ? 'primary' : 'warning'}
                        size="sm"
                      >
                        {event.inscricoesAbertas ? 'Abertas' : 'Fechadas'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900"
                        onClick={() => onToggleVisibility(event)}
                        title={isVisible ? 'Ocultar evento' : 'Mostrar evento'}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900"
                        onClick={() => onEdit(event)}
                        title="Editar evento"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 rounded-full border border-gray-200 bg-white text-red-500 hover:text-red-600"
                        onClick={() => onDelete(event)}
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

