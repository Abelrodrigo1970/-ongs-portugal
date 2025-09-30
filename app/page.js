import { getFeaturedNGOs } from '@/lib/repositories/ngos';
import { getFeaturedEvents, getEventTypes } from '@/lib/repositories/events';
import { getAllODS as getAllODSData } from '@/lib/repositories/ods';
import { getAllAreas } from '@/lib/repositories/areas';
import { getAllColaboracaoTipos } from '@/lib/repositories/colaboracao';
import SearchableHomePage from '@/components/SearchableHomePage';

// Force dynamic rendering to avoid SSG issues with database
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    const [featuredNGOs, featuredEvents, allODS, allAreas, colaboracaoTipos] = await Promise.all([
      getFeaturedNGOs(6),
      getFeaturedEvents(6),
      getAllODSData(),
      getAllAreas(),
      getAllColaboracaoTipos()
    ]);

    const odsOptions = allODS.map(ods => ({
      value: ods.id,
      label: `ODS ${ods.numero} - ${ods.nome}`,
      numero: ods.numero
    }));

    const areasOptions = allAreas.map(area => ({
      value: area.id,
      label: area.nome
    }));

    const colaboracaoOptions = colaboracaoTipos.map(tipo => ({
      value: tipo.id,
      label: tipo.nome
    }));

    const tipoOptions = getEventTypes();

    return (
      <SearchableHomePage 
        featuredNGOs={featuredNGOs}
        featuredEvents={featuredEvents}
        allODS={allODS}
        odsOptions={odsOptions}
        areasOptions={areasOptions}
        colaboracaoOptions={colaboracaoOptions}
        tipoOptions={tipoOptions}
      />
    );
  } catch (error) {
    console.error('Error loading homepage data:', error);
    
    // Fallback data para quando há problemas de conexão
    const fallbackODS = [
      { id: 'ods-1', numero: 1, nome: 'Erradicar a pobreza' },
      { id: 'ods-3', numero: 3, nome: 'Saúde de qualidade' },
      { id: 'ods-15', numero: 15, nome: 'Vida terrestre' }
    ];

    const fallbackAreas = [
      { id: 'area-1', nome: 'Saúde' },
      { id: 'area-2', nome: 'Ambiente' },
      { id: 'area-3', nome: 'Ação Social' }
    ];

    const fallbackColaboracao = [
      { id: 'colab-1', nome: 'Voluntariado presencial' },
      { id: 'colab-2', nome: 'Doações financeiras' }
    ];

    const fallbackNGOs = [
      {
        id: 'mock-health-ngo-1',
        nome: 'Saúde para Todos',
        descricao: 'ONG focada em garantir acesso à saúde básica para comunidades carenciadas.',
        imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
        logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
        localizacao: 'Porto, Portugal',
        ods: [{ ods: { numero: 3, nome: 'Saúde de qualidade' } }],
        areaAtuacao: [{ tipo: { nome: 'Saúde' } }]
      },
      {
        id: 'mock-env-ngo-1',
        nome: 'Verde Portugal',
        descricao: 'Organização dedicada à proteção do ambiente e promoção da sustentabilidade.',
        imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format',
        logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
        localizacao: 'Lisboa, Portugal',
        ods: [{ ods: { numero: 15, nome: 'Vida terrestre' } }],
        areaAtuacao: [{ tipo: { nome: 'Ambiente' } }]
      }
    ];

    const fallbackEvents = [
      {
        id: 'mock-health-event-1',
        nome: 'Formação em Primeiros Socorros',
        descricao: 'Formação gratuita em primeiros socorros aberta à comunidade.',
        dataInicio: new Date('2024-11-30T09:00:00Z'),
        localizacao: 'Centro de Saúde de Aveiro, Aveiro',
        imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
        ngo: {
          nome: 'Saúde para Todos',
          logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'
        },
        ods: [{ ods: { numero: 3, nome: 'Saúde de qualidade' } }],
        areas: [{ tipo: { nome: 'Saúde' } }]
      },
      {
        id: 'mock-env-event-1',
        nome: 'Plantação de Árvores Nativas',
        descricao: 'Junte-se a nós para plantar árvores nativas portuguesas.',
        dataInicio: new Date('2024-12-15T09:00:00Z'),
        localizacao: 'Parque Florestal de Sintra, Sintra',
        imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format',
        ngo: {
          nome: 'Verde Portugal',
          logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop'
        },
        ods: [{ ods: { numero: 15, nome: 'Vida terrestre' } }],
        areas: [{ tipo: { nome: 'Ambiente' } }]
      }
    ];

    const odsOptions = fallbackODS.map(ods => ({
      value: ods.id,
      label: `ODS ${ods.numero} - ${ods.nome}`,
      numero: ods.numero
    }));

    const areasOptions = fallbackAreas.map(area => ({
      value: area.id,
      label: area.nome
    }));

    const colaboracaoOptions = fallbackColaboracao.map(tipo => ({
      value: tipo.id,
      label: tipo.nome
    }));

    const tipoOptions = getEventTypes();

    return (
      <SearchableHomePage 
        featuredNGOs={fallbackNGOs}
        featuredEvents={fallbackEvents}
        allODS={fallbackODS}
        odsOptions={odsOptions}
        areasOptions={areasOptions}
        colaboracaoOptions={colaboracaoOptions}
        tipoOptions={tipoOptions}
      />
    );
  }
}
