'use client';

import { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import MultiSelect from '@/components/ui/MultiSelect';
import Button from '@/components/ui/Button';

const defaultValues = {
  nome: '',
  missao: '',
  descricao: '',
  setor: '',
  numColaboradores: '',
  email: '',
  telefone: '',
  localizacao: '',
  website: '',
  logo: '',
  visivel: true,
  ods: [],
  causas: [],
  tiposApoio: []
};

// allowedKeys não inclui ods, causas e tiposApoio porque são tratados separadamente
const allowedKeys = ['nome', 'missao', 'descricao', 'setor', 'numColaboradores', 'email', 'telefone', 'localizacao', 'website', 'logo', 'visivel'];

const filterAllowed = (data) => {
  return allowedKeys.reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

export default function EmpresaForm({ initialData, odsOptions = [], causasOptions = [], tiposApoioOptions = [], onSubmit, onCancel, loading }) {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      const filtered = filterAllowed(initialData);
      // Extrair ODS, causas e tipos de apoio das relações
      const ods = (initialData.ods || []).map((empresaOds) => empresaOds.odsId || empresaOds.ods?.id).filter(Boolean);
      const causas = (initialData.causas || []).map((empresaCausa) => empresaCausa.causaId || empresaCausa.causa?.id).filter(Boolean);
      const tiposApoio = (initialData.tiposApoio || []).map((empresaTipo) => empresaTipo.tipoApoioId || empresaTipo.tipoApoio?.id).filter(Boolean);
      
      setFormValues({
        ...defaultValues,
        ...filtered,
        numColaboradores: initialData.numColaboradores || '',
        ods: ods,
        causas: causas,
        tiposApoio: tiposApoio
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

  const handleODSChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      ods: Array.isArray(value) ? value : []
    }));
  };

  const handleCausasChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      causas: Array.isArray(value) ? value : []
    }));
  };

  const handleTiposApoioChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      tiposApoio: Array.isArray(value) ? value : []
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const basePayload = filterAllowed(formValues);
    const payload = {
      ...basePayload,
      numColaboradores: formValues.numColaboradores
        ? Number(formValues.numColaboradores)
        : null,
      ods: formValues.ods || [],
      causas: formValues.causas || [],
      tiposApoio: formValues.tiposApoio || []
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome da Empresa"
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
        <div className="md:col-span-2">
          <Input
            label="Missão"
            value={formValues.missao}
            onChange={(e) => handleChange('missao', e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows={4}
            value={formValues.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
          />
        </div>
        <Input
          label="Setor"
          value={formValues.setor}
          onChange={(e) => handleChange('setor', e.target.value)}
          placeholder="ex: Tecnologia, Consultoria, Saúde"
        />
        <Input
          label="Número de Colaboradores"
          type="number"
          min="0"
          value={formValues.numColaboradores}
          onChange={(e) => handleChange('numColaboradores', e.target.value)}
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
          placeholder="ex: Lisboa, Portugal"
        />
        <Input
          label="Website"
          placeholder="https://"
          value={formValues.website}
          onChange={(e) => handleChange('website', e.target.value)}
        />
        <Input
          label="Logo (URL)"
          placeholder="https://"
          value={formValues.logo}
          onChange={(e) => handleChange('logo', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {odsOptions.length === 0 ? (
          <>
            <label className="text-sm font-medium text-gray-700">ODS Relacionados</label>
            <p className="text-sm text-gray-500">Nenhum ODS cadastrado.</p>
          </>
        ) : (
          <MultiSelect
            label="ODS Relacionados"
            options={odsOptions.map((ods) => ({ value: ods.id, label: `ODS ${ods.numero} - ${ods.nome}` }))}
            value={formValues.ods}
            onChange={handleODSChange}
            placeholder="Selecionar ODS"
          />
        )}
      </div>

      <div className="space-y-3">
        {causasOptions.length === 0 ? (
          <>
            <label className="text-sm font-medium text-gray-700">Causas Relacionadas</label>
            <p className="text-sm text-gray-500">Nenhuma causa cadastrada.</p>
          </>
        ) : (
          <MultiSelect
            label="Causas Relacionadas"
            options={causasOptions.map((causa) => ({ value: causa.id, label: causa.nome }))}
            value={formValues.causas}
            onChange={handleCausasChange}
            placeholder="Selecionar causas"
          />
        )}
      </div>

      <div className="space-y-3">
        {tiposApoioOptions.length === 0 ? (
          <>
            <label className="text-sm font-medium text-gray-700">Tipos de Apoio</label>
            <p className="text-sm text-gray-500">Nenhum tipo de apoio cadastrado.</p>
          </>
        ) : (
          <MultiSelect
            label="Tipos de Apoio"
            options={tiposApoioOptions.map((tipo) => ({ value: tipo.id, label: tipo.nome }))}
            value={formValues.tiposApoio}
            onChange={handleTiposApoioChange}
            placeholder="Selecionar tipos de apoio"
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Checkbox
          label="Empresa visível no site"
          checked={formValues.visivel}
          onChange={(e) => handleChange('visivel', e.target.checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Atualizar Empresa' : 'Criar Empresa'}
        </Button>
      </div>
    </form>
  );
}

