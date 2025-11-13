'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import MultiSelect from '@/components/ui/MultiSelect';

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
  ods: [],
  projetos: [],
  impactos: [
    { valor: '', descricao: '' },
    { valor: '', descricao: '' },
    { valor: '', descricao: '' }
  ]
};

const pickAllowedFields = (data) => {
  return Object.keys(defaultValues).reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

const maxProjects = 3;
const maxImpacts = 3;

export default function NGOForm({ initialData, areasOptions = [], odsOptions = [], onSubmit, onCancel, loading }) {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      const sanitized = pickAllowedFields({
        ...initialData,
        areas: (initialData.areaAtuacao || []).map((area) => area.areaAtuacaoTipoId || area.tipo?.id).filter(Boolean),
        ods: (initialData.ods || []).map((odsItem) => odsItem.odsId || odsItem.ods?.id).filter(Boolean),
        projetos: (initialData.projetos || [])
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
          .map((project) => ({
            titulo: project.titulo || '',
            descricao: project.descricao || '',
            imagem: project.imagem || ''
          })),
        impactos: (initialData.impactos || [])
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
          .map((impact) => ({
            valor: impact.valor || '',
            descricao: impact.descricao || ''
          }))
      });

      const paddedImpacts = sanitized.impactos && sanitized.impactos.length > 0 ? [...sanitized.impactos] : [];
      while (paddedImpacts.length < maxImpacts) {
        paddedImpacts.push({ valor: '', descricao: '' });
      }

      setFormValues({
        ...defaultValues,
        ...sanitized,
        areas: sanitized.areas || [],
        ods: sanitized.ods || [],
        projetos: sanitized.projetos || [],
        impactos: paddedImpacts.length > 0 ? paddedImpacts : defaultValues.impactos
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

  const handleProjectChange = (index, field, value) => {
    setFormValues((prev) => {
      const projetos = [...prev.projetos];
      projetos[index] = {
        ...projetos[index],
        [field]: value
      };
      return {
        ...prev,
        projetos
      };
    });
  };

  const handleImpactChange = (index, field, value) => {
    setFormValues((prev) => {
      const impactos = [...prev.impactos];
      impactos[index] = {
        ...impactos[index],
        [field]: value
      };
      return {
        ...prev,
        impactos
      };
    });
  };

  const handleAddProject = () => {
    setFormValues((prev) => {
      if (prev.projetos.length >= maxProjects) return prev;
      return {
        ...prev,
        projetos: [...prev.projetos, { titulo: '', descricao: '', imagem: '' }]
      };
    });
  };

  const handleRemoveProject = (index) => {
    setFormValues((prev) => {
      const projetos = prev.projetos.filter((_, i) => i !== index);
      return {
        ...prev,
        projetos
      };
    });
  };

  const handleAreasChange = (selectedAreas) => {
    setFormValues((prev) => ({
      ...prev,
      areas: selectedAreas
    }));
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

    const sanitizedProjects = Array.isArray(formValues.projetos)
      ? formValues.projetos
          .map((project) => ({
            titulo: project.titulo?.trim() || '',
            descricao: project.descricao?.trim() || '',
            imagem: project.imagem?.trim() || ''
          }))
          .filter((project) => project.titulo && project.descricao)
      : [];

    const sanitizedImpacts = Array.isArray(formValues.impactos)
      ? formValues.impactos
          .map((impact) => ({
            valor: impact.valor?.trim() || '',
            descricao: impact.descricao?.trim() || ''
          }))
      : [];

    if (sanitizedImpacts.length !== maxImpacts || sanitizedImpacts.some((impact) => !impact.valor || !impact.descricao)) {
      alert('Preencha os 3 indicadores de impacto.');
      return;
    }

    const payload = {
      ...pickAllowedFields(formValues),
      areas: formValues.areas,
      ods: formValues.ods,
      projetos: sanitizedProjects,
      impactos: sanitizedImpacts
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
        <label className="text-sm font-medium text-gray-700">Título Missão</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={3}
          value={formValues.missao}
          onChange={(e) => handleChange('missao', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Missão</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={4}
          value={formValues.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Impacto (3 indicadores obrigatórios)</label>
        <div className="space-y-4">
          {formValues.impactos.map((impact, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
              <span className="text-sm font-semibold text-gray-700">Indicador #{index + 1}</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Valor"
                  value={impact.valor}
                  maxLength={10}
                  onChange={(e) => handleImpactChange(index, 'valor', e.target.value)}
                  placeholder="ex: 755"
                  required
                />
                <div className="md:col-span-3">
                  <Input
                    label="Descrição"
                    value={impact.descricao}
                    maxLength={60}
                    onChange={(e) => handleImpactChange(index, 'descricao', e.target.value)}
                    placeholder="ex: Famílias apoiadas"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {areasOptions.length === 0 ? (
          <>
            <label className="text-sm font-medium text-gray-700">Áreas de Atuação</label>
            <p className="text-sm text-gray-500">Nenhuma área cadastrada.</p>
          </>
        ) : (
          <MultiSelect
            label="Áreas de Atuação"
            options={areasOptions.map((area) => ({ value: area.id, label: area.nome }))}
            value={formValues.areas}
            onChange={handleAreasChange}
            placeholder="Selecionar áreas"
          />
        )}
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Projetos (até 3)</label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddProject}
            disabled={formValues.projetos.length >= maxProjects}
          >
            Adicionar projeto
          </Button>
        </div>
        {formValues.projetos.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum projeto adicionado. Clique em "Adicionar projeto" para incluir até 3 iniciativas.
          </p>
        )}
        <div className="space-y-4">
          {formValues.projetos.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Projeto #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleRemoveProject(index)}
                >
                  Remover
                </Button>
              </div>
              <Input
                label="Título do projeto"
                value={project.titulo}
                onChange={(e) => handleProjectChange(index, 'titulo', e.target.value)}
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={3}
                  value={project.descricao}
                  onChange={(e) => handleProjectChange(index, 'descricao', e.target.value)}
                  required
                />
              </div>
              <Input
                label="URL da imagem (opcional)"
                placeholder="https://"
                value={project.imagem}
                onChange={(e) => handleProjectChange(index, 'imagem', e.target.value)}
              />
            </div>
          ))}
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
