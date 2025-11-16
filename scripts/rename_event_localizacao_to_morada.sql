-- Script para renomear a coluna localizacao para morada na tabela Event
-- Execute este script no Supabase SQL Editor

ALTER TABLE "Event" RENAME COLUMN "localizacao" TO "morada";

