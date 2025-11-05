-- Script para adicionar imagens a todas as ONGs que não têm imagem
-- Execute este script no Prisma Studio > Query ou direto no PostgreSQL

-- Atualizar ONGs com base na primeira área de atuação

-- ONGs de Ambiente/Conservação
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" IN ('Ambiente', 'Conservação')
);

-- ONGs de Saúde
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" = 'Saúde'
);

-- ONGs de Educação/Formação
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=entropy&auto=format'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" IN ('Educação', 'Formação')
);

-- ONGs de Inclusão Social / Sem Abrigo / Ação Social
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" IN ('Inclusão social', 'Sem Abrigo', 'Ação Social')
);

-- ONGs de Direitos Humanos
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&crop=entropy&auto=format'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" = 'Direitos Humanos'
);

-- ONGs de Igualdade de Género
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" = 'Igualdade de Género'
);

-- ONGs de Segurança Alimentar
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" = 'Segurança Alimentar'
);

-- ONGs de Cultura
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" = 'Cultura'
);

-- ONGs de Desenvolvimento Comunitário
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '')
AND "id" IN (
  SELECT DISTINCT n."id"
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n."id"
  INNER JOIN "AreaAtuacaoTipo" aat ON aat."id" = aa."areaAtuacaoTipoId"
  WHERE aat."nome" = 'Desenvolvimento Comunitário'
);

-- Para qualquer ONG que ainda não tenha imagem (default)
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '');

-- Verificar quantas ONGs foram atualizadas
SELECT COUNT(*) as "Total de ONGs com imagem"
FROM "NGO"
WHERE "imagem" IS NOT NULL AND "imagem" != '';

