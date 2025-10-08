-- ================================================================
-- 🚀 SETUP COMPLETO - ONGs Portugal
-- ================================================================
-- Este ficheiro contém TODOS os comandos SQL necessários
-- Execute no SQL Editor do Supabase em ORDEM
-- ================================================================

-- ================================================================
-- PARTE 1: ENUMS PARA EMPRESAS
-- ================================================================

-- Status de iniciativa
CREATE TYPE status_iniciativa AS ENUM (
  'RASCUNHO',
  'ATIVA',
  'PAUSADA',
  'CONCLUIDA',
  'CANCELADA'
);

-- Tipo de apoio
CREATE TYPE tipo_apoio AS ENUM (
  'TEMPO_VOLUNTARIADO',
  'CONHECIMENTO_CAPACITACAO',
  'RECURSOS_SERVICOS',
  'PRODUTOS_BENS'
);

-- Status de proposta
CREATE TYPE status_proposta AS ENUM (
  'RASCUNHO',
  'ENVIADA',
  'EM_ANALISE',
  'APROVADA',
  'REJEITADA',
  'CANCELADA'
);

-- Status de reunião
CREATE TYPE status_reuniao AS ENUM (
  'AGENDADA',
  'CONFIRMADA',
  'CONCLUIDA',
  'CANCELADA'
);

-- Tipo de reunião
CREATE TYPE tipo_reuniao AS ENUM (
  'ONLINE',
  'PRESENCIAL',
  'HIBRIDA'
);

-- Formato de relatório
CREATE TYPE formato_relatorio AS ENUM (
  'PDF',
  'CSV',
  'EXCEL'
);

-- ================================================================
-- PARTE 2: ENUM PARA INSCRIÇÕES (NOVO!)
-- ================================================================

CREATE TYPE status_inscricao AS ENUM (
  'PENDENTE',
  'APROVADA',
  'REJEITADA',
  'CANCELADA'
);

-- ================================================================
-- PARTE 3: TABELA DE INSCRIÇÕES (NOVO!)
-- ================================================================

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

-- ================================================================
-- PARTE 4: ÍNDICES PARA INSCRIÇÕES
-- ================================================================

CREATE INDEX idx_inscricoes_evento ON inscricoes(evento_id);
CREATE INDEX idx_inscricoes_iniciativa ON inscricoes(iniciativa_id);
CREATE INDEX idx_inscricoes_email ON inscricoes(email_colaborador);
CREATE INDEX idx_inscricoes_status ON inscricoes(status);
CREATE INDEX idx_inscricoes_created ON inscricoes(created_at DESC);

-- ================================================================
-- PARTE 5: TRIGGERS PARA INSCRIÇÕES
-- ================================================================

-- Trigger para atualizar updated_at
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

-- ================================================================
-- PARTE 6: COMENTÁRIOS NA TABELA
-- ================================================================

COMMENT ON TABLE inscricoes IS 'Inscrições de colaboradores externos em eventos e iniciativas';
COMMENT ON COLUMN inscricoes.evento_id IS 'Referência ao evento (se aplicável)';
COMMENT ON COLUMN inscricoes.iniciativa_id IS 'Referência à iniciativa (se aplicável)';
COMMENT ON COLUMN inscricoes.nome_colaborador IS 'Nome do voluntário que se inscreveu';
COMMENT ON COLUMN inscricoes.email_colaborador IS 'Email do voluntário';
COMMENT ON COLUMN inscricoes.telefone IS 'Telefone de contacto (opcional)';
COMMENT ON COLUMN inscricoes.mensagem IS 'Mensagem do voluntário (opcional)';
COMMENT ON COLUMN inscricoes.status IS 'Status da inscrição (PENDENTE por padrão)';

-- ================================================================
-- PARTE 7: LIMPEZA (OPCIONAL)
-- ================================================================

-- Remover tabela antiga inscricoes_iniciativa se existir
DROP TABLE IF EXISTS inscricoes_iniciativa CASCADE;

-- ================================================================
-- PARTE 8: VERIFICAÇÃO
-- ================================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE tablename IN (
  'inscricoes',
  'empresas',
  'iniciativas',
  'propostas',
  'reunioes'
)
ORDER BY tablename;

-- Verificar se todos os ENUMs foram criados
SELECT 
  typname as enum_name,
  array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN (
  'status_inscricao',
  'status_iniciativa',
  'tipo_apoio',
  'status_proposta',
  'status_reuniao',
  'tipo_reuniao',
  'formato_relatorio'
)
GROUP BY typname
ORDER BY typname;

-- ================================================================
-- ✅ SETUP COMPLETO!
-- ================================================================
-- 
-- Após executar este script:
-- 1. Execute: npx prisma generate
-- 2. Inicie o servidor: npm run dev
-- 3. Teste o login: http://localhost:3000/colaborador/login
-- 
-- Documentação completa em:
-- - docs/VOLUNTARIADO-SETUP.md
-- - docs/ACESSO-RAPIDO.md
-- - GUIA-COMPLETO.md
-- 
-- ================================================================
