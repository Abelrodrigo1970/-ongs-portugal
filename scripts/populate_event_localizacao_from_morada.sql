-- Script para extrair a localização do final do campo morada e inserir no campo localizacao
-- Execute este script no Supabase SQL Editor

-- Estratégia: Extrair a parte após a última vírgula do campo morada
-- Exemplos:
-- "Rua da Ribeira Negra 55, 4050-321 Porto" -> "Porto"
-- "Centro de Saúde de Aveiro, Aveiro" -> "Aveiro"
-- "Parque Florestal de Sintra, Sintra" -> "Sintra"

-- Extrair tudo após a última vírgula (limitado a 25 caracteres)
UPDATE "Event"
SET "localizacao" = SUBSTRING(TRIM(SPLIT_PART("morada", ',', -1)) FROM 1 FOR 25)
WHERE "morada" IS NOT NULL 
  AND "morada" != '' 
  AND position(',' in "morada") > 0;

-- Se não houver vírgula, usar os últimos 25 caracteres da morada
UPDATE "Event"
SET "localizacao" = SUBSTRING("morada" FROM GREATEST(1, LENGTH("morada") - 24) FOR 25)
WHERE "morada" IS NOT NULL 
  AND "morada" != ''
  AND position(',' in "morada") = 0
  AND (LENGTH("morada") <= 25 OR "localizacao" IS NULL);

