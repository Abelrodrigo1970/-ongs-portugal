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
  impacto: '',
  instagramUrl: '',
  videoUrl: '',
  websiteUrl: '',
  imagem: '',
  logo: '',
  visivel: true
};

const pickAllowedFields = (data) => {
  return Object.keys(defaultValues).reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

export default function NGOForm({ initialData, onSubmit, onCancel, loading }) {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      const sanitized = pickAllowedFields(initialData);

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
        })()
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
      impacto: impactoArray
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
          label="Localização"
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
