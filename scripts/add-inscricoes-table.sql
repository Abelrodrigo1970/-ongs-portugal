-- ========================================
-- SQL PARA ADICIONAR TABELA DE INSCRIÇÕES
-- ========================================

-- Criar enum para status de inscrição
CREATE TYPE status_inscricao AS ENUM (
  'PENDENTE',
  'APROVADA',
  'REJEITADA',
  'CANCELADA'
);

-- Criar tabela de inscrições
CREATE TABLE inscricoes (
  id TEXT PRIMARY KEY,
  evento_id TEXT REFERENCES "Event"(id) ON DELETE CASCADE,
  iniciativa_id TEXT REFERENCES iniciativas(id) ON DELETE CASCADE,
  nome_colaborador TEXT NOT NULL,
  email_colaborador TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  status status_inscricao DEFAULT 'PENDENTE' NOT NULL,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL,
  
  -- Validação: deve ter pelo menos um evento ou iniciativa
  CONSTRAINT check_evento_ou_iniciativa CHECK (
    (evento_id IS NOT NULL AND iniciativa_id IS NULL) OR
    (evento_id IS NULL AND iniciativa_id IS NOT NULL)
  )
);

-- Criar índices para melhorar performance
CREATE INDEX idx_inscricoes_evento ON inscricoes(evento_id);
CREATE INDEX idx_inscricoes_iniciativa ON inscricoes(iniciativa_id);
CREATE INDEX idx_inscricoes_email ON inscricoes(email_colaborador);
CREATE INDEX idx_inscricoes_status ON inscricoes(status);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_inscricoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inscricoes_updated_at
BEFORE UPDATE ON inscricoes
FOR EACH ROW
EXECUTE FUNCTION update_inscricoes_updated_at();

-- Remover tabela antiga inscricoes_iniciativa se existir
DROP TABLE IF EXISTS inscricoes_iniciativa CASCADE;

COMMENT ON TABLE inscricoes IS 'Inscrições de colaboradores externos em eventos e iniciativas';
COMMENT ON COLUMN inscricoes.evento_id IS 'Referência ao evento (se aplicável)';
COMMENT ON COLUMN inscricoes.iniciativa_id IS 'Referência à iniciativa (se aplicável)';
COMMENT ON COLUMN inscricoes.nome_colaborador IS 'Nome do voluntário que se inscreveu';
COMMENT ON COLUMN inscricoes.email_colaborador IS 'Email do voluntário';
COMMENT ON COLUMN inscricoes.status IS 'Status da inscrição';
