-- ========================================
-- SCRIPT PARA CRIAR TABELA INSCRIÇÕES E ADICIONAR CONSTRAINT ÚNICA
-- ========================================
-- Este script:
-- 1. Cria o enum status_inscricao (se não existir)
-- 2. Cria a tabela inscricoes (se não existir)
-- 3. Adiciona constraint única para prevenir colaboradores repetidos

-- Passo 1: Criar enum status_inscricao se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_inscricao') THEN
    CREATE TYPE status_inscricao AS ENUM (
      'PENDENTE',
      'APROVADA',
      'REJEITADA',
      'CANCELADA'
    );
    RAISE NOTICE 'Enum status_inscricao criado';
  ELSE
    RAISE NOTICE 'Enum status_inscricao já existe';
  END IF;
END $$;

-- Passo 2: Criar tabela inscricoes se não existir
CREATE TABLE IF NOT EXISTS inscricoes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  evento_id TEXT REFERENCES "Event"(id) ON DELETE CASCADE,
  iniciativa_id TEXT REFERENCES iniciativas(id) ON DELETE CASCADE,
  nome_colaborador TEXT NOT NULL,
  email_colaborador TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  status status_inscricao DEFAULT 'PENDENTE' NOT NULL,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Validação: deve ter pelo menos um evento ou iniciativa
  CONSTRAINT check_evento_ou_iniciativa CHECK (
    (evento_id IS NOT NULL AND iniciativa_id IS NULL) OR
    (evento_id IS NULL AND iniciativa_id IS NOT NULL)
  )
);

-- Passo 3: Criar índices básicos se não existirem
CREATE INDEX IF NOT EXISTS idx_inscricoes_evento ON inscricoes(evento_id) WHERE evento_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inscricoes_iniciativa ON inscricoes(iniciativa_id) WHERE iniciativa_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inscricoes_email ON inscricoes(email_colaborador);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes(status);

-- Passo 4: Criar trigger para updated_at se não existir
CREATE OR REPLACE FUNCTION update_inscricoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS inscricoes_updated_at ON inscricoes;
CREATE TRIGGER inscricoes_updated_at
BEFORE UPDATE ON inscricoes
FOR EACH ROW
EXECUTE FUNCTION update_inscricoes_updated_at();

-- Passo 5: Remover duplicatas existentes (se houver)
-- IMPORTANTE: Execute este passo antes de adicionar a constraint única
DELETE FROM inscricoes a
WHERE a.ctid <> (
  SELECT MIN(b.ctid)
  FROM inscricoes b
  WHERE b.evento_id = a.evento_id 
    AND LOWER(TRIM(b.email_colaborador)) = LOWER(TRIM(a.email_colaborador))
    AND b.evento_id IS NOT NULL
);

-- Passo 6: Adicionar constraint única para prevenir colaboradores repetidos no mesmo evento
-- IMPORTANTE: Execute os passos anteriores primeiro para garantir que não há duplicatas

DO $$
BEGIN
  -- Verificar se o índice único já existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_inscricoes_evento_email_unique'
  ) THEN
    -- Criar índice único
    CREATE UNIQUE INDEX idx_inscricoes_evento_email_unique 
    ON inscricoes(evento_id, LOWER(TRIM(email_colaborador)))
    WHERE evento_id IS NOT NULL;
    
    RAISE NOTICE '✅ Índice único criado com sucesso: idx_inscricoes_evento_email_unique';
  ELSE
    RAISE NOTICE '⚠️ Índice único já existe: idx_inscricoes_evento_email_unique';
  END IF;
END $$;

-- Comentários
COMMENT ON TABLE inscricoes IS 'Inscrições de colaboradores externos em eventos e iniciativas';
COMMENT ON INDEX idx_inscricoes_evento_email_unique IS 
'Garante que um mesmo email não pode se inscrever duas vezes no mesmo evento';

-- Verificação final
SELECT 
  'Tabela inscricoes criada com sucesso!' as resultado,
  COUNT(*) as total_registros
FROM inscricoes;

SELECT 
  'Constraint única aplicada!' as resultado,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'inscricoes' 
AND indexname = 'idx_inscricoes_evento_email_unique';

