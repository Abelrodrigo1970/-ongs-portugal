-- Criar enums necessários para Empresas
DO $$ BEGIN
    CREATE TYPE "StatusIniciativa" AS ENUM ('RASCUNHO', 'ATIVA', 'PAUSADA', 'CONCLUIDA', 'CANCELADA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "StatusProposta" AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'ARQUIVADA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "StatusReuniao" AS ENUM ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA', 'REMARCADA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "StatusInscricao" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TipoApoio" AS ENUM ('TEMPO_VOLUNTARIADO', 'CONHECIMENTO_CAPACITACAO', 'RECURSOS_SERVICOS', 'PRODUTOS_BENS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "FormatoRelatorio" AS ENUM ('PDF', 'EXCEL', 'CSV', 'JSON');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TipoReuniao" AS ENUM ('PRESENCIAL', 'ONLINE', 'HIBRIDA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
