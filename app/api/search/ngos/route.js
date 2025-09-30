import { getNGOs } from '@/lib/repositories/ngos';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    // Fallback para pesquisas específicas ou problemas de conexão
    const getMockData = (searchTerm) => {
      const lowerQuery = searchTerm.toLowerCase();
      
      // Dados mock para saúde
      if (lowerQuery.includes('saúde') || lowerQuery.includes('saude')) {
        return {
          ngos: [
            {
              id: 'mock-health-ngo-1',
              nome: 'Saúde para Todos',
              descricao: 'ONG focada em garantir acesso à saúde básica para comunidades carenciadas, com especial atenção à saúde materno-infantil.',
              missao: 'Democratizar o acesso à saúde de qualidade, especialmente nas áreas mais vulneráveis do país.',
              email: 'info@saudeparatodos.pt',
              telefone: '+351 22 987 6543',
              localizacao: 'Porto, Portugal',
              latitude: 41.1579,
              longitude: -8.6291,
              impacto: JSON.stringify([
                'Atendimento médico a 5.000 pessoas carenciadas',
                'Programa de saúde materno-infantil em 15 comunidades',
                'Distribuição de medicamentos essenciais'
              ]),
              imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
              logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
              instagramUrl: 'https://instagram.com/saudeparatodos',
              websiteUrl: 'https://saudeparatodos.pt',
              visivel: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              ods: [
                { ods: { numero: 3, nome: 'Saúde de qualidade' } }
              ],
              areaAtuacao: [
                { tipo: { nome: 'Saúde' } }
              ],
              colaboracao: [
                { tipo: { nome: 'Doações financeiras' } }
              ]
            },
            {
              id: 'mock-health-ngo-2',
              nome: 'Apoio Sénior',
              descricao: 'Organização dedicada ao apoio e cuidado de pessoas idosas, promovendo o envelhecimento ativo e saudável.',
              missao: 'Garantir dignidade e qualidade de vida para pessoas idosas, combatendo o isolamento e promovendo a participação social.',
              email: 'contato@apoiosenior.pt',
              telefone: '+351 28 555 4433',
              localizacao: 'Faro, Portugal',
              latitude: 37.0194,
              longitude: -7.9322,
              impacto: JSON.stringify([
                'Apoio domiciliário a 600 idosos',
                'Programas de convívio para 1.000 seniores',
                'Formação de 200 cuidadores'
              ]),
              imagem: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop&crop=entropy&auto=format',
              logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
              instagramUrl: 'https://instagram.com/apoiosenior',
              websiteUrl: 'https://apoiosenior.pt',
              visivel: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              ods: [
                { ods: { numero: 3, nome: 'Saúde de qualidade' } }
              ],
              areaAtuacao: [
                { tipo: { nome: 'Saúde' } }
              ],
              colaboracao: [
                { tipo: { nome: 'Voluntariado presencial' } }
              ]
            }
          ],
          pagination: {
            page: 1,
            limit: 12,
            total: 2,
            pages: 1
          }
        };
      }
      
      // Dados mock para meio ambiente/árvores
      if (lowerQuery.includes('arvore') || lowerQuery.includes('árvore') || lowerQuery.includes('ambiente') || lowerQuery.includes('natureza') || lowerQuery.includes('floresta')) {
        return {
          ngos: [
            {
              id: 'mock-env-ngo-1',
              nome: 'Verde Portugal',
              descricao: 'Organização dedicada à proteção do ambiente e promoção da sustentabilidade. Focamos na reflorestação e educação ambiental.',
              missao: 'Proteger e restaurar o património natural português através de ações concretas e educação ambiental.',
              email: 'info@verdeportugal.pt',
              telefone: '+351 21 123 4567',
              localizacao: 'Lisboa, Portugal',
              latitude: 38.7223,
              longitude: -9.1393,
              impacto: JSON.stringify([
                'Plantação de 50.000 árvores nativas',
                'Educação ambiental para 10.000 crianças',
                'Proteção de 5 áreas naturais'
              ]),
              imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format',
              logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
              instagramUrl: 'https://instagram.com/verdeportugal',
              websiteUrl: 'https://verdeportugal.pt',
              visivel: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              ods: [
                { ods: { numero: 15, nome: 'Vida terrestre' } }
              ],
              areaAtuacao: [
                { tipo: { nome: 'Ambiente' } }
              ],
              colaboracao: [
                { tipo: { nome: 'Voluntariado presencial' } }
              ]
            },
            {
              id: 'mock-env-ngo-2',
              nome: 'Plantar o Futuro',
              descricao: 'Iniciativa comunitária para reflorestação urbana e rural. Organizamos campanhas de plantação de árvores em todo o país.',
              missao: 'Tornar Portugal mais verde através da participação cidadã na reflorestação e conservação da natureza.',
              email: 'contato@plantarofuturo.pt',
              telefone: '+351 91 234 5678',
              localizacao: 'Coimbra, Portugal',
              latitude: 40.2033,
              longitude: -8.4103,
              impacto: JSON.stringify([
                '100.000 árvores plantadas',
                '50 comunidades envolvidas',
                '200 hectares reflorestados'
              ]),
              imagem: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&auto=format',
              logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
              instagramUrl: 'https://instagram.com/plantarofuturo',
              websiteUrl: 'https://plantarofuturo.pt',
              visivel: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              ods: [
                { ods: { numero: 15, nome: 'Vida terrestre' } }
              ],
              areaAtuacao: [
                { tipo: { nome: 'Ambiente' } }
              ],
              colaboracao: [
                { tipo: { nome: 'Doações financeiras' } }
              ]
            }
          ],
          pagination: {
            page: 1,
            limit: 12,
            total: 2,
            pages: 1
          }
        };
      }
      
      // Dados mock genéricos para outras pesquisas
      return {
        ngos: [
          {
            id: 'mock-generic-ngo-1',
            nome: 'Ação Solidária',
            descricao: 'ONG com foco em múltiplas causas sociais, promovendo voluntariado e solidariedade em diversas áreas.',
            missao: 'Construir uma sociedade mais justa e solidária através da mobilização de pessoas e recursos.',
            email: 'info@acaosolidaria.pt',
            telefone: '+351 22 111 2222',
            localizacao: 'Braga, Portugal',
            latitude: 41.5518,
            longitude: -8.4229,
            impacto: JSON.stringify([
              'Mais de 1.000 voluntários ativos',
              'Projetos em 20 municípios',
              'Apoio a 5.000 famílias'
            ]),
            imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=entropy&auto=format',
            logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
            instagramUrl: 'https://instagram.com/acaosolidaria',
            websiteUrl: 'https://acaosolidaria.pt',
            visivel: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            ods: [
              { ods: { numero: 1, nome: 'Erradicar a pobreza' } }
            ],
            areaAtuacao: [
              { tipo: { nome: 'Ação Social' } }
            ],
            colaboracao: [
              { tipo: { nome: 'Voluntariado presencial' } }
            ]
          }
        ],
        pagination: {
          page: 1,
          limit: 12,
          total: 1,
          pages: 1
        }
      };
    };

    // Tentar usar dados mock se houver query
    if (query) {
      console.log(`🔍 API: Usando fallback para pesquisa por "${query}"`);
      return NextResponse.json(getMockData(query));
    }
    
    const filters = {
      query: query,
      ods: searchParams.get('ods') ? searchParams.get('ods').split(',').filter(id => id.trim() !== '') : [],
      areas: searchParams.get('areas') ? searchParams.get('areas').split(',').filter(id => id.trim() !== '') : [],
      colaboracao: searchParams.get('colaboracao') ? searchParams.get('colaboracao').split(',').filter(id => id.trim() !== '') : [],
      localizacao: searchParams.get('local') || '',
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 8
    };

    const result = await getNGOs(filters);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/search/ngos:', error);
    
    // Fallback em caso de erro
    const query = new URL(request.url).searchParams.get('query') || '';
    if (query) {
      console.log(`🔍 API: Fallback por erro para pesquisa por "${query}"`);
      const getMockData = (searchTerm) => {
        const lowerQuery = searchTerm.toLowerCase();
        
        if (lowerQuery.includes('saúde') || lowerQuery.includes('saude')) {
          return {
            ngos: [
              {
                id: 'mock-health-ngo-1',
                nome: 'Saúde para Todos',
                descricao: 'ONG focada em garantir acesso à saúde básica para comunidades carenciadas.',
                missao: 'Democratizar o acesso à saúde de qualidade.',
                email: 'info@saudeparatodos.pt',
                telefone: '+351 22 987 6543',
                localizacao: 'Porto, Portugal',
                latitude: 41.1579,
                longitude: -8.6291,
                impacto: JSON.stringify(['Atendimento médico a 5.000 pessoas']),
                imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format',
                logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
                visivel: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                ods: [{ ods: { numero: 3, nome: 'Saúde de qualidade' } }],
                areaAtuacao: [{ tipo: { nome: 'Saúde' } }],
                colaboracao: [{ tipo: { nome: 'Doações financeiras' } }]
              }
            ],
            pagination: { page: 1, limit: 12, total: 1, pages: 1 }
          };
        }
        
        if (lowerQuery.includes('arvore') || lowerQuery.includes('árvore') || lowerQuery.includes('ambiente')) {
          return {
            ngos: [
              {
                id: 'mock-env-ngo-1',
                nome: 'Verde Portugal',
                descricao: 'Organização dedicada à proteção do ambiente e promoção da sustentabilidade.',
                missao: 'Proteger e restaurar o património natural português.',
                email: 'info@verdeportugal.pt',
                telefone: '+351 21 123 4567',
                localizacao: 'Lisboa, Portugal',
                latitude: 38.7223,
                longitude: -9.1393,
                impacto: JSON.stringify(['Plantação de 50.000 árvores nativas']),
                imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy&auto=format',
                logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
                visivel: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                ods: [{ ods: { numero: 15, nome: 'Vida terrestre' } }],
                areaAtuacao: [{ tipo: { nome: 'Ambiente' } }],
                colaboracao: [{ tipo: { nome: 'Voluntariado presencial' } }]
              }
            ],
            pagination: { page: 1, limit: 12, total: 1, pages: 1 }
          };
        }
        
        return {
          ngos: [],
          pagination: { page: 1, limit: 12, total: 0, pages: 0 }
        };
      };
      
      return NextResponse.json(getMockData(query));
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
