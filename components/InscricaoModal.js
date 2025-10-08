'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

const InscricaoModal = ({ isOpen, onClose, eventoId, iniciativaId, tipo = 'evento' }) => {
  const [formData, setFormData] = useState({
    nomeColaborador: '',
    emailColaborador: '',
    telefone: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load colaborador data from localStorage if available
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedColaborador = localStorage.getItem('colaborador');
      if (savedColaborador) {
        try {
          const colaborador = JSON.parse(savedColaborador);
          setFormData(prev => ({
            ...prev,
            nomeColaborador: colaborador.nome || '',
            emailColaborador: colaborador.email || ''
          }));
        } catch (e) {
          console.error('Error loading colaborador:', e);
        }
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inscricoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          eventoId: eventoId || null,
          iniciativaId: iniciativaId || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar inscrição');
      }

      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error submitting inscription:', err);
      setError(err.message || 'Erro ao enviar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nomeColaborador: '',
      emailColaborador: '',
      telefone: '',
      mensagem: ''
    });
    setSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Inscrição Realizada! 🎉
              </h3>
              <p className="text-gray-600">
                Entraremos em contacto em breve.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Inscrever-me {tipo === 'evento' ? 'no Evento' : 'na Iniciativa'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome Completo"
                  type="text"
                  value={formData.nomeColaborador}
                  onChange={(e) => setFormData({ ...formData, nomeColaborador: e.target.value })}
                  required
                  placeholder="João Silva"
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.emailColaborador}
                  onChange={(e) => setFormData({ ...formData, emailColaborador: e.target.value })}
                  required
                  placeholder="joao.silva@exemplo.com"
                />

                <Input
                  label="Telefone (opcional)"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="+351 912 345 678"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Gostaria de saber mais sobre..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    Confirmar Inscrição
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InscricaoModal;
