/**
 * Remove acentos e normaliza texto para pesquisa
 */
export function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Cria condições de pesquisa que ignoram acentos
 */
export function createSearchConditions(fields, query) {
  const normalizedQuery = normalizeText(query);
  
  if (!normalizedQuery) return [];
  
  return fields.map(field => ({
    [field]: {
      contains: normalizedQuery,
      mode: 'insensitive'
    }
  }));
}
