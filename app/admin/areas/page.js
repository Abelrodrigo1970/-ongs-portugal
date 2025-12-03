'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/context/AdminContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AdminModal from '@/components/admin/AdminModal';
import { Edit, Plus, Trash2, Search } from 'lucide-react';

// Mapeamento automático de nomes de áreas para ícones
const getSuggestedIcon = (nome) => {
  const nomeLower = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  const iconMap = {
    'ambiente': '/images/areas/ambiente.svg',
    'ambiental': '/images/areas/ambiente.svg',
    'conservacao': '/images/areas/ambiente.svg',
    'comunidade': '/images/areas/comunidade.svg',
    'desenvolvimento comunitario': '/images/areas/comunidade.svg',
    'cultura': '/images/areas/cultura.svg',
    'patrimonio': '/images/areas/cultura.svg',
    'desporto': '/images/areas/desporto.svg',
    'esporte': '/images/areas/desporto.svg',
    'educacao': '/images/areas/educacao.svg',
    'ensino': '/images/areas/educacao.svg',
    'empregabilidade': '/images/areas/empregabilidade.svg',
    'emprego': '/images/areas/empregabilidade.svg',
    'formacao': '/images/areas/formacao.svg',
    'capacitacao': '/images/areas/formacao.svg',
    'inclusao social': '/images/areas/inclusao-social.svg',
    'inclusao': '/images/areas/inclusao-social.svg',
    'acao social': '/images/areas/inclusao-social.svg',
    'pobreza': '/images/areas/inclusao-social.svg',
    'exclusao': '/images/areas/inclusao-social.svg',
    'direitos humanos': '/images/areas/inclusao-social.svg',
    'reinsercao': '/images/areas/reinsercao.svg',
    'reinsercao social': '/images/areas/reinsercao.svg',
    'seguranca alimentar': '/images/areas/seguranca-alimentar.svg',
    'alimentar': '/images/areas/seguranca-alimentar.svg',
    'fome': '/images/areas/seguranca-alimentar.svg',
    'saude': '/images/areas/educacao.svg', // Usar educação como fallback
    'protecao animal': '/images/areas/ambiente.svg', // Usar ambiente como fallback
    'ornitologia': '/images/areas/ambiente.svg', // Usar ambiente como fallback
    'bem-estar animal': '/images/areas/ambiente.svg', // Usar ambiente como fallback
    'igualdade de genero': '/images/areas/inclusao-social.svg', // Usar inclusão como fallback
  };

  // Buscar correspondência exata ou parcial
  for (const [key, icon] of Object.entries(iconMap)) {
    if (nomeLower.includes(key) || key.includes(nomeLower)) {
      return icon;
    }
  }

  return null;
};

export default function AdminAreasPage() {
  const { getAuthHeaders } = useAdmin();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', icone: '' });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/areas', { headers });
      const data = await response.json();

      if (data.success) {
        setAreas(data.areas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArea(null);
    setFormData({ nome: '', icone: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (area) => {
    setSelectedArea(area);
    setFormData({ 
      nome: area.nome, 
      icone: area.icone || getSuggestedIcon(area.nome) || '' 
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (areaId) => {
    if (!confirm('Tem certeza que deseja eliminar esta área?')) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/areas/${areaId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        loadAreas();
      } else {
        alert('Erro ao eliminar área');
      }
    } catch (error) {
      console.error('Erro ao eliminar área:', error);
      alert('Erro ao eliminar área');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const headers = getAuthHeaders();
      const url = selectedArea
        ? `/api/admin/areas/${selectedArea.id}`
        : '/api/admin/areas';
      const method = selectedArea ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsFormOpen(false);
        loadAreas();
        setFormData({ nome: '', icone: '' });
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao salvar área');
      }
    } catch (error) {
      console.error('Erro ao salvar área:', error);
      alert('Erro ao salvar área');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gerir Áreas de Atuação
        </h2>
        <p className="text-gray-600">
          Criar, editar e gerir áreas de atuação das ONGs
        </p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Pesquisar áreas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              if (!confirm('Deseja adicionar ícones automaticamente a todas as áreas que não têm ícone?')) {
                return;
              }
              try {
                const headers = getAuthHeaders();
                const response = await fetch('/api/admin/areas/add-icons', {
                  method: 'POST',
                  headers,
                });
                const data = await response.json();
                if (data.success) {
                  alert(`✅ ${data.message}`);
                  loadAreas();
                } else {
                  alert('Erro ao adicionar ícones');
                }
              } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao adicionar ícones');
              }
            }}
            variant="outline"
            className="text-sm"
          >
            🎨 Adicionar Ícones
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-5 w-5 mr-2" />
            Nova Área
          </Button>
        </div>
      </div>

      {/* Areas List */}
      {loading ? (
        <Card>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </Card>
      ) : (
        <Card>
          {filteredAreas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'Nenhuma área encontrada' : 'Nenhuma área cadastrada'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {area.icone && (
                      <img 
                        src={area.icone} 
                        alt={area.nome}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-gray-900 font-medium">{area.nome}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(area)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Form Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setFormData({ nome: '', icone: '' });
          setSelectedArea(null);
        }}
        title={selectedArea ? 'Editar Área' : 'Nova Área'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Área
            </label>
            <Input
              type="text"
              value={formData.nome}
              onChange={(e) => {
                const newNome = e.target.value;
                const suggestedIcon = getSuggestedIcon(newNome);
                setFormData({ 
                  ...formData, 
                  nome: newNome,
                  icone: formData.icone || suggestedIcon || ''
                });
              }}
              placeholder="Ex: Ação Social"
              required
            />
            {formData.nome && !formData.icone && getSuggestedIcon(formData.nome) && (
              <p className="mt-1 text-xs text-blue-600">
                💡 Sugestão: Um ícone foi sugerido automaticamente baseado no nome
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ícone
            </label>
            
            {/* Ícones disponíveis */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-2">Ícones disponíveis (clique para selecionar):</p>
              <div className="grid grid-cols-5 gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                {[
                  { name: 'ambiente', path: '/images/areas/ambiente.svg', label: 'Ambiente' },
                  { name: 'comunidade', path: '/images/areas/comunidade.svg', label: 'Comunidade' },
                  { name: 'cultura', path: '/images/areas/cultura.svg', label: 'Cultura' },
                  { name: 'desporto', path: '/images/areas/desporto.svg', label: 'Desporto' },
                  { name: 'educacao', path: '/images/areas/educacao.svg', label: 'Educação' },
                  { name: 'empregabilidade', path: '/images/areas/empregabilidade.svg', label: 'Empregabilidade' },
                  { name: 'formacao', path: '/images/areas/formacao.svg', label: 'Formação' },
                  { name: 'inclusao-social', path: '/images/areas/inclusao-social.svg', label: 'Inclusão Social' },
                  { name: 'reinsercao', path: '/images/areas/reinsercao.svg', label: 'Reinserção' },
                  { name: 'seguranca-alimentar', path: '/images/areas/seguranca-alimentar.svg', label: 'Segurança Alimentar' },
                ].map((icon) => (
                  <button
                    key={icon.path}
                    type="button"
                    onClick={() => setFormData({ ...formData, icone: icon.path })}
                    className={`p-2 rounded border-2 transition-all hover:border-primary-500 flex flex-col items-center gap-1 ${
                      formData.icone === icon.path
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                    title={icon.label || icon.name}
                  >
                    <img 
                      src={icon.path} 
                      alt={icon.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-[10px] text-gray-600 text-center leading-tight">{icon.label || icon.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de texto para URL personalizada */}
            <div>
              <p className="text-xs text-gray-600 mb-1">Ou digite uma URL personalizada:</p>
              <Input
                type="text"
                value={formData.icone}
                onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                placeholder="Ex: /images/areas/custom.svg ou https://exemplo.com/icone.png"
              />
            </div>
            
            {/* Preview do ícone */}
            {formData.icone && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-medium">Preview do ícone:</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded border border-gray-200">
                    <img 
                      src={formData.icone} 
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden items-center justify-center text-gray-400 text-xs">
                      Erro
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 break-all">{formData.icone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.icone.startsWith('http') ? 'URL externa' : 'Caminho local'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormOpen(false);
                setFormData({ nome: '', icone: '' });
                setSelectedArea(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Salvando...' : selectedArea ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

