import { withAdminAuth } from '@/lib/auth/adminAuth';
import { getAllAreas, updateArea } from '@/lib/repositories/areas';

// Mapeamento de nomes de áreas para ícones
const iconMap = {
  'Ambiente': '/images/areas/ambiente.svg',
  'Conservação': '/images/areas/ambiente.svg',
  'Comunidade': '/images/areas/comunidade.svg',
  'Desenvolvimento comunitário': '/images/areas/comunidade.svg',
  'Cultura e património': '/images/areas/cultura.svg',
  'Cultura': '/images/areas/cultura.svg',
  'Desporto': '/images/areas/desporto.svg',
  'Educação': '/images/areas/educacao.svg',
  'Empregabilidade': '/images/areas/empregabilidade.svg',
  'Formação': '/images/areas/formacao.svg',
  'Inclusão social': '/images/areas/inclusao-social.svg',
  'Ação Social': '/images/areas/inclusao-social.svg',
  'Pobreza e exclusão': '/images/areas/inclusao-social.svg',
  'Direitos humanos': '/images/areas/inclusao-social.svg',
  'Igualdade de género': '/images/areas/inclusao-social.svg',
  'Reinserção': '/images/areas/reinsercao.svg',
  'Segurança alimentar': '/images/areas/seguranca-alimentar.svg',
  'Saúde': '/images/areas/educacao.svg',
  'Proteção Animal': '/images/areas/ambiente.svg',
  'Ornitologia': '/images/areas/ambiente.svg',
  'Bem-estar animal': '/images/areas/ambiente.svg',
};

function getIconForArea(nome) {
  // Buscar correspondência exata
  if (iconMap[nome]) {
    return iconMap[nome];
  }

  // Buscar correspondência parcial (case-insensitive)
  const nomeLower = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [key, icon] of Object.entries(iconMap)) {
    const keyLower = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (nomeLower.includes(keyLower) || keyLower.includes(nomeLower)) {
      return icon;
    }
  }

  // Fallback padrão
  return '/images/areas/comunidade.svg';
}

export async function POST(request) {
  return withAdminAuth(async () => {
    try {
      const areas = await getAllAreas();
      
      let updated = 0;
      let skipped = 0;
      const results = [];

      for (const area of areas) {
        // Se já tem ícone, pular
        if (area.icone) {
          skipped++;
          results.push({
            area: area.nome,
            status: 'skipped',
            message: `Já tem ícone: ${area.icone}`
          });
          continue;
        }

        // Encontrar ícone apropriado
        const icon = getIconForArea(area.nome);

        // Atualizar área com o ícone
        await updateArea(area.id, { icone: icon });

        updated++;
        results.push({
          area: area.nome,
          status: 'updated',
          icon: icon
        });
      }

      return Response.json({
        success: true,
        message: `Ícones adicionados com sucesso! ${updated} áreas atualizadas, ${skipped} já tinham ícone.`,
        updated,
        skipped,
        total: areas.length,
        results
      });
    } catch (error) {
      console.error('Erro ao adicionar ícones:', error);
      return Response.json(
        { success: false, error: 'Erro ao adicionar ícones às áreas' },
        { status: 500 }
      );
    }
  })(request);
}

