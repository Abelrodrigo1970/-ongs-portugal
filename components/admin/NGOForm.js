'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';

const defaultValues = {
  nome: '',
  descricao: '',
  missao: '',
  email: '',
  telefone: '',
  localizacao: '',
  morada: '',
  codigoPostalNumero: '',
  codigoPostalLocalidade: '',
  impacto: '',
  instagramUrl: '',
  videoUrl: '',
  websiteUrl: '',
  imagem: '',
  logo: '',
  visivel: true,
  areas: [],
  ods: []
};

const pickAllowedFields = (data) => {
  return Object.keys(defaultValues).reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

export default function NGOForm({ initialData, areasOptions = [], odsOptions = [], onSubmit, onCancel, loading }) {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      const sanitized = pickAllowedFields({
        ...initialData,
        areas: (initialData.areaAtuacao || []).map((area) => area.areaAtuacaoTipoId || area.tipo?.id).filter(Boolean),
        ods: (initialData.ods || []).map((odsItem) => odsItem.odsId || odsItem.ods?.id).filter(Boolean)
      });

      setFormValues({
        ...defaultValues,
        ...sanitized,
        impacto: (() => {
          if (Array.isArray(initialData.impacto)) {
            return initialData.impacto.join('\n');
          }
          try {
            const parsed = JSON.parse(initialData.impacto || '[]');
            return Array.isArray(parsed) ? parsed.join('\n') : '';
          } catch {
            return initialData.impacto || '';
          }
        })(),
        areas: sanitized.areas || [],
        ods: sanitized.ods || []
      });
    } else {
      setFormValues(defaultValues);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleArea = (areaId) => {
    setFormValues((prev) => {
      const { areas } = prev;
      const exists = areas.includes(areaId);
      return {
        ...prev,
        areas: exists ? areas.filter((id) => id !== areaId) : [...areas, areaId]
      };
    });
  };

  const handleToggleODS = (odsId) => {
    setFormValues((prev) => {
      const { ods } = prev;
      const exists = ods.includes(odsId);
      return {
        ...prev,
        ods: exists ? ods.filter((id) => id !== odsId) : [...ods, odsId]
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const impactoArray = formValues.impacto
      ? formValues.impacto
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...pickAllowedFields(formValues),
      impacto: impactoArray,
      areas: formValues.areas,
      ods: formValues.ods
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome da ONG"
          value={formValues.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formValues.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        <Input
          label="Telefone"
          value={formValues.telefone}
          onChange={(e) => handleChange('telefone', e.target.value)}
        />
        <Input
          label="Morada"
          value={formValues.morada}
          onChange={(e) => handleChange('morada', e.target.value)}
        />
        <Input
          label="Código Postal (Número)"
          value={formValues.codigoPostalNumero}
          onChange={(e) => handleChange('codigoPostalNumero', e.target.value)}
        />
        <Input
          label="Localização (Cidade / País)"
          value={formValues.localizacao}
          onChange={(e) => handleChange('localizacao', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={4}
          value={formValues.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Missão</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={3}
          value={formValues.missao}
          onChange={(e) => handleChange('missao', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Impacto (uma linha por item)</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={3}
          placeholder="Exemplo:\nAtendimento a 5.000 pessoas\nDistribuição de alimentos"
          value={formValues.impacto}
          onChange={(e) => handleChange('impacto', e.target.value)}
        />
        <p className="text-xs text-gray-500">Utilize uma linha por impacto para facilitar a leitura.</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Áreas de Atuação</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 p-3">
          {areasOptions.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma área cadastrada.</p>
          ) : (
            areasOptions.map((area) => (
              <label key={area.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formValues.areas.includes(area.id)}
                  onChange={() => handleToggleArea(area.id)}
                />
                <span>{area.nome}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">ODS Relacionados</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 p-3">
          {odsOptions.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum ODS cadastrado.</p>
          ) : (
            odsOptions.map((ods) => (
              <label key={ods.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formValues.ods.includes(ods.id)}
                  onChange={() => handleToggleODS(ods.id)}
                />
                <span>{`ODS ${ods.numero} - ${ods.nome}`}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Instagram"
          placeholder="https://instagram.com"
          value={formValues.instagramUrl}
          onChange={(e) => handleChange('instagramUrl', e.target.value)}
        />
        <Input
          label="Website"
          placeholder="https://"
          value={formValues.websiteUrl}
          onChange={(e) => handleChange('websiteUrl', e.target.value)}
        />
        <Input
          label="Vídeo"
          placeholder="https://youtube.com/..."
          value={formValues.videoUrl}
          onChange={(e) => handleChange('videoUrl', e.target.value)}
        />
        <Input
          label="Imagem de Capa"
          placeholder="https://"
          value={formValues.imagem}
          onChange={(e) => handleChange('imagem', e.target.value)}
        />
        <Input
          label="Logo"
          placeholder="https://"
          value={formValues.logo}
          onChange={(e) => handleChange('logo', e.target.value)}
        />
      </div>

      <Checkbox
        label="ONG visível no site"
        checked={formValues.visivel}
        onChange={(e) => handleChange('visivel', e.target.checked)}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Atualizar ONG' : 'Criar ONG'}
        </Button>
      </div>
    </form>
  );
}
