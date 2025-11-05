-- ========================================
-- SQL para adicionar imagens às ONGs
-- Execute no Supabase > SQL Editor
-- ========================================

-- 1️⃣ Adicionar imagem padrão a TODAS as ONGs que não têm imagem
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE ("imagem" IS NULL OR "imagem" = '');

-- ========================================
-- OU, se preferir imagens diferentes por categoria:
-- ========================================

-- ONGs de Ambiente/Conservação
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE ("imagem" IS NULL OR "imagem" = '')
AND id IN (
  SELECT DISTINCT n.id
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n.id
  INNER JOIN "AreaAtuacaoTipo" aat ON aat.id = aa."areaAtuacaoTipoId"
  WHERE aat.nome IN ('Ambiente', 'Conservação')
);

-- ONGs de Saúde
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE ("imagem" IS NULL OR "imagem" = '')
AND id IN (
  SELECT DISTINCT n.id
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n.id
  INNER JOIN "AreaAtuacaoTipo" aat ON aat.id = aa."areaAtuacaoTipoId"
  WHERE aat.nome = 'Saúde'
);

-- ONGs de Educação
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE ("imagem" IS NULL OR "imagem" = '')
AND id IN (
  SELECT DISTINCT n.id
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n.id
  INNER JOIN "AreaAtuacaoTipo" aat ON aat.id = aa."areaAtuacaoTipoId"
  WHERE aat.nome IN ('Educação', 'Formação')
);

-- ONGs de Inclusão Social
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE ("imagem" IS NULL OR "imagem" = '')
AND id IN (
  SELECT DISTINCT n.id
  FROM "NGO" n
  INNER JOIN "AreaAtuacao" aa ON aa."ngoId" = n.id
  INNER JOIN "AreaAtuacaoTipo" aat ON aat.id = aa."areaAtuacaoTipoId"
  WHERE aat.nome IN ('Inclusão social', 'Sem Abrigo', 'Ação Social')
);

-- Qualquer ONG restante sem imagem (fallback)
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE ("imagem" IS NULL OR "imagem" = '');

-- ========================================
-- Verificar resultado
-- ========================================
SELECT 
  nome,
  CASE 
    WHEN imagem IS NOT NULL THEN '✅ Tem imagem'
    ELSE '❌ Sem imagem'
  END as status,
  imagem
FROM "NGO"
ORDER BY nome;

