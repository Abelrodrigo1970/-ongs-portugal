'use client';

import Image from 'next/image';
import { Edit2, Trash2, Mail, MapPin, Building2, Eye, EyeOff } from 'lucide-react';
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

export default function EmpresaTable({ empresas, onEdit, onDelete, onToggleVisibility, loading }) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (!empresas || empresas.length === 0) {
    return (
      <Card className="p-8 text-center border-gray-200 shadow-sm">
        <p className="text-gray-600">Nenhuma empresa encontrada</p>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-emerald-600 text-white text-xs uppercase tracking-wide">
              <th className="px-6 py-4 text-left font-semibold">Empresa</th>
              <th className="px-6 py-4 text-left font-semibold">Contacto</th>
              <th className="px-6 py-4 text-left font-semibold">Localização</th>
              <th className="px-6 py-4 text-left font-semibold">Setor</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {empresas.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {empresa.logo ? (
                        <Image
                          src={empresa.logo}
                          alt={empresa.nome}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-emerald-100">
                          <Building2 className="w-6 h-6 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{empresa.nome}</div>
                      {empresa.numColaboradores && (
                        <div className="text-xs text-gray-500">{empresa.numColaboradores} colaboradores</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-xs">{empresa.email}</span>
                  </div>
                  {empresa.telefone && (
                    <div className="text-xs text-gray-500">{empresa.telefone}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {empresa.localizacao ? (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-xs">{empresa.localizacao}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {empresa.setor || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      empresa.visivel
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {empresa.visivel ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Visível
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Oculto
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => onEdit(empresa)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => onDelete(empresa)}
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

