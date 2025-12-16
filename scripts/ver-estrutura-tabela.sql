-- ========================================
-- SCRIPT PARA VER ESTRUTURA DE TABELAS
-- ========================================

-- Opção 1: Ver estrutura da tabela inscricoes
SELECT 
  column_name as "Nome da Coluna",
  data_type as "Tipo de Dados",
  is_nullable as "Permite NULL",
  column_default as "Valor Padrão",
  character_maximum_length as "Tamanho Máximo"
FROM information_schema.columns
WHERE table_name = 'inscricoes'
ORDER BY ordinal_position;

-- Opção 2: Ver todas as informações detalhadas
SELECT 
  c.column_name,
  c.data_type,
  c.character_maximum_length,
  c.is_nullable,
  c.column_default,
  c.ordinal_position,
  tc.constraint_type,
  kcu.constraint_name
FROM information_schema.columns c
LEFT JOIN information_schema.key_column_usage kcu 
  ON c.table_name = kcu.table_name 
  AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc 
  ON kcu.constraint_name = tc.constraint_name
WHERE c.table_name = 'inscricoes'
ORDER BY c.ordinal_position;

-- Opção 3: Ver estrutura no formato PostgreSQL (psql \d)
SELECT 
  a.attname AS "Coluna",
  pg_catalog.format_type(a.atttypid, a.atttypmod) AS "Tipo",
  CASE 
    WHEN a.attnotnull THEN 'NOT NULL' 
    ELSE 'NULL' 
  END AS "Null?",
  COALESCE(pg_get_expr(d.adbin, d.adrelid), '') AS "Padrão"
FROM pg_catalog.pg_attribute a
LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid, d.adnum)
WHERE a.attrelid = 'inscricoes'::regclass
  AND a.attnum > 0 
  AND NOT a.attisdropped
ORDER BY a.attnum;

-- Opção 4: Ver constraints e índices da tabela
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  tc.table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'inscricoes'
ORDER BY tc.constraint_type, tc.constraint_name;

-- Opção 5: Ver índices da tabela
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'inscricoes'
ORDER BY indexname;

-- Opção 6: Ver se a tabela existe e informações básicas
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%inscric%';

