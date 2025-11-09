'use client';

import { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const defaultValues = {
  nome: '',
  descricao: '',
  ngoId: '',
  dataInicio: '',
  dataFim: '',
  localizacao: '',
  tipo: 'PRESENCIAL',
  maxParticipantes: '',
  inscricoesAbertas: true,
  linkInscricao: '',
  linkEvento: '',
  imagem: '',
  visivel: true
};

const allowedKeys = Object.keys(defaultValues);

const filterAllowed = (data) => {
  return allowedKeys.reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

const eventTypeOptions = [
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Remoto', value: 'REMOTO' },
  { label: 'Híbrido', value: 'HIBRIDO' }
];

export default function EventForm({ initialData, ngos, onSubmit, onCancel, loading }) {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      const filtered = filterAllowed(initialData);
      setFormValues({
        ...defaultValues,
        ...filtered,
        dataInicio: initialData.dataInicio
          ? new Date(initialData.dataInicio).toISOString().slice(0, 16)
          : '',
        dataFim: initialData.dataFim
          ? new Date(initialData.dataFim).toISOString().slice(0, 16)
          : '',
        maxParticipantes: initialData.maxParticipantes || ''
      });
    } else {
      setFormValues(defaultValues);
    }
  }, [initialData]);

  const ngoOptions = useMemo(() => {
    return (ngos || []).map((ngo) => ({ label: ngo.nome, value: ngo.id }));
  }, [ngos]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const basePayload = filterAllowed(formValues);
    const payload = {
      ...basePayload,
      dataInicio: formValues.dataInicio ? new Date(formValues.dataInicio).toISOString() : null,
      dataFim: formValues.dataFim ? new Date(formValues.dataFim).toISOString() : null,
      maxParticipantes: formValues.maxParticipantes
        ? Number(formValues.maxParticipantes)
        : null
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Evento"
          value={formValues.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          required
        />
        <Select
          label="ONG Organizadora"
          options={ngoOptions}
          placeholder="Selecione uma ONG"
          value={formValues.ngoId}
          onChange={(e) => handleChange('ngoId', e.target.value)}
          required
        />
        <Input
          label="Data de Início"
          type="datetime-local"
          value={formValues.dataInicio}
          onChange={(e) => handleChange('dataInicio', e.target.value)}
          required
        />
        <Input
          label="Data de Fim"
          type="datetime-local"
          value={formValues.dataFim}
          onChange={(e) => handleChange('dataFim', e.target.value)}
        />
        <Input
          label="Localização"
          value={formValues.localizacao}
          onChange={(e) => handleChange('localizacao', e.target.value)}
          required
        />
        <Select
          label="Tipo de Evento"
          options={eventTypeOptions}
          value={formValues.tipo}
          onChange={(e) => handleChange('tipo', e.target.value)}
        />
        <Input
          label="Máximo de Participantes"
          type="number"
          min="0"
          value={formValues.maxParticipantes}
          onChange={(e) => handleChange('maxParticipantes', e.target.value)}
        />
        <Input
          label="Imagem"
          placeholder="https://"
          value={formValues.imagem}
          onChange={(e) => handleChange('imagem', e.target.value)}
        />
        <Input
          label="Link de Inscrição"
          placeholder="https://"
          value={formValues.linkInscricao}
          onChange={(e) => handleChange('linkInscricao', e.target.value)}
        />
        <Input
          label="Link do Evento"
          placeholder="https://"
          value={formValues.linkEvento}
          onChange={(e) => handleChange('linkEvento', e.target.value)}
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

      <div className="flex flex-col sm:flex-row gap-3">
        <Checkbox
          label="Evento visível no site"
          checked={formValues.visivel}
          onChange={(e) => handleChange('visivel', e.target.checked)}
        />
        <Checkbox
          label="Inscrições abertas"
          checked={formValues.inscricoesAbertas}
          onChange={(e) => handleChange('inscricoesAbertas', e.target.checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Atualizar Evento' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  );
}
