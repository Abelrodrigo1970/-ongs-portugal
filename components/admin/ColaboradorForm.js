'use client';

import { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const defaultValues = {
  nome: '',
  email: '',
  empresaId: '',
  departamento: '',
  cargo: '',
  avatar: '',
  ativo: true
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

export default function ColaboradorForm({ initialData, empresas, onSubmit, onCancel, loading }) {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (initialData) {
      const filtered = filterAllowed(initialData);
      setFormValues({
        ...defaultValues,
        ...filtered
      });
    } else {
      setFormValues(defaultValues);
    }
  }, [initialData]);

  const empresaOptions = useMemo(() => {
    return (empresas || []).map((empresa) => ({ label: empresa.nome, value: empresa.id }));
  }, [empresas]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = filterAllowed(formValues);

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome Completo"
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
        <Select
          label="Empresa"
          options={empresaOptions}
          placeholder="Selecione uma empresa"
          value={formValues.empresaId}
          onChange={(e) => handleChange('empresaId', e.target.value)}
          required
        />
        <Input
          label="Departamento"
          value={formValues.departamento}
          onChange={(e) => handleChange('departamento', e.target.value)}
          placeholder="ex: Tecnologia, Marketing, RH"
        />
        <Input
          label="Cargo"
          value={formValues.cargo}
          onChange={(e) => handleChange('cargo', e.target.value)}
          placeholder="ex: Desenvolvedor, Gestor, Analista"
        />
        <Input
          label="Avatar (URL)"
          placeholder="https://"
          value={formValues.avatar}
          onChange={(e) => handleChange('avatar', e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Checkbox
          label="Colaborador ativo"
          checked={formValues.ativo}
          onChange={(e) => handleChange('ativo', e.target.checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Atualizar Colaborador' : 'Criar Colaborador'}
        </Button>
      </div>
    </form>
  );
}

