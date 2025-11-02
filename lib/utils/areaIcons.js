// Mapping area names to icon filenames
export const getAreaIcon = (areaName) => {
  const iconMap = {
    'Inclusão social': '/images/areas/inclusao-social.svg',
    'Empregabilidade': '/images/areas/empregabilidade.svg',
    'Formação': '/images/areas/formacao.svg',
    'Desporto': '/images/areas/desporto.svg',
    'Cultura': '/images/areas/cultura.svg',
    'Comunidade': '/images/areas/comunidade.svg',
    'Reinserção': '/images/areas/reinsercao.svg',
    'Educação': '/images/areas/educacao.svg',
    'Ação Social': '/images/areas/acao-social.svg',
    'Proteção Animal': '/images/areas/protecao-animal.svg',
    'Conservação': '/images/areas/conservacao.svg',
    'Segurança alimentar': '/images/areas/seguranca-alimentar.svg',
    'Bem-estar animal': '/images/areas/bem-estar-animal.svg',
    'Cultura e património': '/images/areas/cultura-patrimonio.svg',
    'Desenvolvimento comunitário': '/images/areas/desenvolvimento-comunitario.svg',
    'Pobreza e exclusão': '/images/areas/pobreza-exclusao.svg',
    'Direitos humanos': '/images/areas/direitos-humanos.svg',
    'Igualdade de género': '/images/areas/igualdade-genero.svg',
    'Ambiente': '/images/areas/ambiente.svg',
    'Saúde': '/images/areas/saude.svg',
    'Ornitologia': '/images/areas/ornitologia.svg',
  };

  return iconMap[areaName] || null;
};

