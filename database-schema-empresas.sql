-- ========================================
-- SCHEMA: Empresas e Colaboração com ONGs
-- PostgreSQL DDL
-- ========================================

-- ENUMS
CREATE TYPE status_iniciativa AS ENUM ('RASCUNHO', 'ATIVA', 'PAUSADA', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE status_proposta AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'ARQUIVADA');
CREATE TYPE status_reuniao AS ENUM ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA', 'REMARCADA');
CREATE TYPE status_inscricao AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA');
CREATE TYPE tipo_apoio_enum AS ENUM ('TEMPO_VOLUNTARIADO', 'CONHECIMENTO_CAPACITACAO', 'RECURSOS_SERVICOS', 'PRODUTOS_BENS');
CREATE TYPE formato_relatorio AS ENUM ('PDF', 'EXCEL', 'CSV', 'JSON');

-- TABELA: empresas
CREATE TABLE empresas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nome TEXT NOT NULL,
    missao TEXT NOT NULL,
    descricao TEXT,
    setor TEXT,
    num_colaboradores INTEGER,
    logo TEXT,
    website TEXT,
    email TEXT NOT NULL,
    telefone TEXT,
    localizacao TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    visivel BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: tipos_apoio_empresa (tipos de apoio que a empresa oferece)
CREATE TABLE tipos_apoio_empresa (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    tipo tipo_apoio_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: empresa_tipos_apoio (m:n empresa <-> tipos de apoio)
CREATE TABLE empresa_tipos_apoio (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    tipo_apoio_id TEXT NOT NULL REFERENCES tipos_apoio_empresa(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, tipo_apoio_id)
);

-- TABELA: empresa_ods (m:n empresa <-> ODS) - reutiliza tabela ODS existente
CREATE TABLE empresa_ods (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    ods_id TEXT NOT NULL REFERENCES "ODS"(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, ods_id)
);

-- TABELA: causas (áreas temáticas)
CREATE TABLE causas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    icone TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: empresa_causas (m:n empresa <-> causas)
CREATE TABLE empresa_causas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    causa_id TEXT NOT NULL REFERENCES causas(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, causa_id)
);

-- TABELA: estatisticas_impacto_empresa (métricas de impacto agregadas)
CREATE TABLE estatisticas_impacto_empresa (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    periodo_ano INTEGER NOT NULL,
    periodo_mes INTEGER NOT NULL CHECK (periodo_mes BETWEEN 1 AND 12),
    horas_voluntariado DECIMAL(10,2) DEFAULT 0,
    num_projetos INTEGER DEFAULT 0,
    num_voluntarios INTEGER DEFAULT 0,
    valor_doacoes DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, periodo_ano, periodo_mes)
);

-- TABELA: colaboradores (funcionários da empresa)
CREATE TABLE colaboradores (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    departamento TEXT,
    cargo TEXT,
    avatar TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, email)
);

-- TABELA: iniciativas (oportunidades de voluntariado/apoio da empresa)
CREATE TABLE iniciativas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    causa_id TEXT REFERENCES causas(id),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP,
    tipo_apoio tipo_apoio_enum NOT NULL,
    vagas INTEGER,
    vagas_preenchidas INTEGER DEFAULT 0,
    status status_iniciativa NOT NULL DEFAULT 'RASCUNHO',
    localizacao TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    imagem TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: inscricoes_iniciativa (colaboradores inscritos em iniciativas)
CREATE TABLE inscricoes_iniciativa (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    iniciativa_id TEXT NOT NULL REFERENCES iniciativas(id) ON DELETE CASCADE,
    colaborador_id TEXT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
    status status_inscricao NOT NULL DEFAULT 'PENDENTE',
    horas_contribuidas DECIMAL(8,2) DEFAULT 0,
    feedback TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(iniciativa_id, colaborador_id)
);

-- TABELA: favoritos (ONGs marcam empresas como favoritas)
CREATE TABLE favoritos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ong_id TEXT NOT NULL REFERENCES "NGO"(id) ON DELETE CASCADE,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ong_id, empresa_id)
);

-- TABELA: propostas (ONGs enviam propostas para empresas/iniciativas)
CREATE TABLE propostas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ong_id TEXT NOT NULL REFERENCES "NGO"(id) ON DELETE CASCADE,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    iniciativa_id TEXT REFERENCES iniciativas(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    ods_relacionados TEXT[], -- Array de IDs de ODS
    anexos_meta JSONB, -- Metadados de anexos
    status status_proposta NOT NULL DEFAULT 'PENDENTE',
    resposta_empresa TEXT,
    respondido_em TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: reunioes (agendamento entre empresa e ONG)
CREATE TABLE reunioes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    ong_id TEXT NOT NULL REFERENCES "NGO"(id) ON DELETE CASCADE,
    proposta_id TEXT REFERENCES propostas(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL,
    status status_reuniao NOT NULL DEFAULT 'AGENDADA',
    local_ou_link TEXT,
    tipo_reuniao TEXT CHECK (tipo_reuniao IN ('PRESENCIAL', 'ONLINE', 'HIBRIDA')),
    criado_por_empresa BOOLEAN DEFAULT true,
    notas TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: exportacoes_relatorios (histórico de relatórios exportados)
CREATE TABLE exportacoes_relatorios (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    empresa_id TEXT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    colaborador_id TEXT REFERENCES colaboradores(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    filtros_json JSONB,
    formato formato_relatorio NOT NULL,
    caminho_ficheiro TEXT,
    tamanho_bytes BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES E OTIMIZAÇÕES
-- ========================================

-- Índices para consultas de dashboard
CREATE INDEX idx_estatisticas_empresa_periodo ON estatisticas_impacto_empresa(empresa_id, periodo_ano DESC, periodo_mes DESC);
CREATE INDEX idx_iniciativas_empresa_status ON iniciativas(empresa_id, status, data_inicio DESC);
CREATE INDEX idx_inscricoes_iniciativa ON inscricoes_iniciativa(iniciativa_id, status);
CREATE INDEX idx_propostas_empresa_status ON propostas(empresa_id, status, created_at DESC);
CREATE INDEX idx_reunioes_empresa_data ON reunioes(empresa_id, start_at);
CREATE INDEX idx_colaboradores_empresa_ativo ON colaboradores(empresa_id, ativo);
CREATE INDEX idx_favoritos_lookup ON favoritos(empresa_id, ong_id);

-- ========================================
-- VIEWS MATERIALIZADAS
-- ========================================

-- View: Resumo de impacto mensal da empresa
CREATE MATERIALIZED VIEW vista_impacto_mensal_empresa AS
SELECT 
    empresa_id,
    periodo_ano,
    periodo_mes,
    SUM(horas_voluntariado) as total_horas,
    SUM(num_projetos) as total_projetos,
    SUM(num_voluntarios) as total_voluntarios,
    SUM(valor_doacoes) as total_doacoes
FROM estatisticas_impacto_empresa
GROUP BY empresa_id, periodo_ano, periodo_mes;

CREATE UNIQUE INDEX idx_vista_impacto_pk ON vista_impacto_mensal_empresa(empresa_id, periodo_ano, periodo_mes);

-- View: Dashboard resumo empresa
CREATE MATERIALIZED VIEW resumo_dashboard_empresa AS
SELECT 
    e.id as empresa_id,
    e.nome,
    COUNT(DISTINCT i.id) as total_iniciativas,
    COUNT(DISTINCT c.id) as total_colaboradores,
    COUNT(DISTINCT ins.id) as total_inscricoes,
    COUNT(DISTINCT p.id) as total_propostas,
    COALESCE(SUM(est.horas_voluntariado), 0) as total_horas_acumuladas
FROM empresas e
LEFT JOIN iniciativas i ON e.id = i.empresa_id
LEFT JOIN colaboradores c ON e.id = c.empresa_id AND c.ativo = true
LEFT JOIN inscricoes_iniciativa ins ON i.id = ins.iniciativa_id
LEFT JOIN propostas p ON e.id = p.empresa_id
LEFT JOIN estatisticas_impacto_empresa est ON e.id = est.empresa_id
GROUP BY e.id, e.nome;

CREATE UNIQUE INDEX idx_resumo_dashboard_pk ON resumo_dashboard_empresa(empresa_id);

-- ========================================
-- QUERIES EXEMPLO PARA GRÁFICOS
-- ========================================

-- GRÁFICO 1: Evolução de horas de voluntariado (linha)
-- SELECT periodo_ano, periodo_mes, SUM(horas_voluntariado) as horas FROM estatisticas_impacto_empresa WHERE empresa_id = $1 AND periodo_ano >= $2 GROUP BY periodo_ano, periodo_mes ORDER BY periodo_ano, periodo_mes;

-- GRÁFICO 2: Projetos por causa (barras)
-- SELECT c.nome, COUNT(i.id) as total FROM iniciativas i JOIN empresa_causas ec ON i.empresa_id = ec.empresa_id JOIN causas c ON ec.causa_id = c.id WHERE i.empresa_id = $1 GROUP BY c.nome ORDER BY total DESC;

-- GRÁFICO 3: Distribuição de voluntariado por tipo de apoio (pizza)
-- SELECT tipo_apoio, COUNT(*) as total FROM iniciativas WHERE empresa_id = $1 AND status = 'CONCLUIDA' GROUP BY tipo_apoio;

-- GRÁFICO 4: Comparação de impacto por área ODS (área)
-- SELECT o.numero, o.nome, SUM(est.horas_voluntariado) as horas FROM empresa_ods eo JOIN "ODS" o ON eo.ods_id = o.id LEFT JOIN estatisticas_impacto_empresa est ON eo.empresa_id = est.empresa_id WHERE eo.empresa_id = $1 GROUP BY o.numero, o.nome ORDER BY o.numero;

-- ========================================
-- TRIGGERS PARA UPDATED_AT
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estatisticas_updated_at BEFORE UPDATE ON estatisticas_impacto_empresa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colaboradores_updated_at BEFORE UPDATE ON colaboradores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_iniciativas_updated_at BEFORE UPDATE ON iniciativas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inscricoes_updated_at BEFORE UPDATE ON inscricoes_iniciativa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_propostas_updated_at BEFORE UPDATE ON propostas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reunioes_updated_at BEFORE UPDATE ON reunioes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_causas_updated_at BEFORE UPDATE ON causas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DADOS SEED EXEMPLO
-- ========================================

-- Inserir tipos de apoio padrão
INSERT INTO tipos_apoio_empresa (nome, descricao, tipo) VALUES
('Voluntariado Presencial', 'Colaboradores dedicam tempo presencialmente', 'TEMPO_VOLUNTARIADO'),
('Voluntariado Online', 'Colaboradores apoiam remotamente', 'TEMPO_VOLUNTARIADO'),
('Formação e Capacitação', 'Workshops e formações para ONGs', 'CONHECIMENTO_CAPACITACAO'),
('Mentoria Empresarial', 'Mentoria de gestores para ONGs', 'CONHECIMENTO_CAPACITACAO'),
('Consultoria Pro Bono', 'Consultoria gratuita especializada', 'RECURSOS_SERVICOS'),
('Espaço Físico', 'Cedência de salas e espaços', 'RECURSOS_SERVICOS'),
('Produtos e Equipamentos', 'Doação de produtos da empresa', 'PRODUTOS_BENS'),
('Material de Escritório', 'Doação de materiais', 'PRODUTOS_BENS');

-- Inserir causas exemplo
INSERT INTO causas (nome, descricao) VALUES
('Educação', 'Projetos de educação e formação'),
('Ambiente', 'Sustentabilidade e conservação'),
('Saúde', 'Saúde e bem-estar'),
('Inclusão Social', 'Igualdade e inclusão'),
('Combate à Pobreza', 'Apoio a comunidades carenciadas'),
('Direitos Humanos', 'Defesa de direitos fundamentais'),
('Tecnologia Social', 'Inovação para impacto social'),
('Alimentação', 'Segurança alimentar');

-- ========================================
-- COMENTÁRIOS ADICIONAIS
-- ========================================

-- NOTA: Reutiliza tabela "NGO" existente para ONGs
-- NOTA: Reutiliza tabela "ODS" existente para Objetivos de Desenvolvimento Sustentável
-- NOTA: Views materializadas devem ser atualizadas periodicamente (REFRESH MATERIALIZED VIEW)
-- NOTA: Para soft delete, adicionar coluna 'deleted_at' onde necessário
-- NOTA: Para auditoria completa, considerar tabela audit_log separada
