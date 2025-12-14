'use client';

import Image from 'next/image';
import { Edit2, Trash2, Mail, Building2, User } from 'lucide-react';
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

export default function ColaboradorTable({ colaboradores, onEdit, onDelete, onToggleStatus, loading }) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (!colaboradores || colaboradores.length === 0) {
    return (
      <Card className="p-8 text-center border-gray-200 shadow-sm">
        <p className="text-gray-600">Nenhum colaborador encontrado</p>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-emerald-600 text-white text-xs uppercase tracking-wide">
              <th className="px-6 py-4 text-left font-semibold">Colaborador</th>
              <th className="px-6 py-4 text-left font-semibold">Contacto</th>
              <th className="px-6 py-4 text-left font-semibold">Empresa</th>
              <th className="px-6 py-4 text-left font-semibold">Departamento / Cargo</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {colaboradores.map((colaborador) => (
              <tr key={colaborador.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {colaborador.avatar ? (
                        <Image
                          src={colaborador.avatar}
                          alt={colaborador.nome}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-emerald-100">
                          <User className="w-6 h-6 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{colaborador.nome}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{colaborador.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>{colaborador.empresa?.nome || '—'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <div>
                    {colaborador.departamento && (
                      <div className="font-medium">{colaborador.departamento}</div>
                    )}
                    {colaborador.cargo && (
                      <div className="text-xs text-gray-500">{colaborador.cargo}</div>
                    )}
                    {!colaborador.departamento && !colaborador.cargo && (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      colaborador.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {colaborador.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => onEdit(colaborador)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => onDelete(colaborador)}
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

