import { prisma } from '../lib/db.js';

async function createEmpresasTables() {
  try {
    console.log('🔧 Criando tabelas de Empresas...');
    
    // Executar SQL bruto para criar as tabelas
    await prisma.$executeRawUnsafe(`
      -- ENUMS
      DO $$ BEGIN
        CREATE TYPE status_iniciativa AS ENUM ('RASCUNHO', 'ATIVA', 'PAUSADA', 'CONCLUIDA', 'CANCELADA');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE status_proposta AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'ARQUIVADA');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE status_reuniao AS ENUM ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA', 'REMARCADA');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE status_inscricao AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE tipo_apoio_enum AS ENUM ('TEMPO_VOLUNTARIADO', 'CONHECIMENTO_CAPACITACAO', 'RECURSOS_SERVICOS', 'PRODUTOS_BENS');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE formato_relatorio AS ENUM ('PDF', 'EXCEL', 'CSV', 'JSON');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE tipo_reuniao_enum AS ENUM ('PRESENCIAL', 'ONLINE', 'HIBRIDA');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('✅ Enums criados');

    // Criar tabela Empresa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Empresa" (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        missao TEXT NOT NULL,
        descricao TEXT,
        setor TEXT,
        "numColaboradores" INTEGER,
        logo TEXT,
        website TEXT,
        email TEXT NOT NULL,
        telefone TEXT,
        localizacao TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        visivel BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela Empresa criada');

    // Criar tabela Causa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Causa" (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL UNIQUE,
        descricao TEXT,
        icone TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela Causa criada');

    // Criar tabela TipoApoioEmpresa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TipoApoioEmpresa" (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL UNIQUE,
        descricao TEXT,
        tipo tipo_apoio_enum NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela TipoApoioEmpresa criada');

    // Criar tabelas de relação
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "EmpresaTipoApoio" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "tipoApoioId" TEXT NOT NULL REFERENCES "TipoApoioEmpresa"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("empresaId", "tipoApoioId")
      );

      CREATE TABLE IF NOT EXISTS "EmpresaODS" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "odsId" TEXT NOT NULL REFERENCES "ODS"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("empresaId", "odsId")
      );

      CREATE TABLE IF NOT EXISTS "EmpresaCausa" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "causaId" TEXT NOT NULL REFERENCES "Causa"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("empresaId", "causaId")
      );
    `);

    console.log('✅ Tabelas de relação M:N criadas');

    // Criar tabela EstatisticaImpactoEmpresa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "EstatisticaImpactoEmpresa" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "periodoAno" INTEGER NOT NULL,
        "periodoMes" INTEGER NOT NULL CHECK ("periodoMes" BETWEEN 1 AND 12),
        "horasVoluntariado" DOUBLE PRECISION DEFAULT 0,
        "numProjetos" INTEGER DEFAULT 0,
        "numVoluntarios" INTEGER DEFAULT 0,
        "valorDoacoes" DOUBLE PRECISION DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("empresaId", "periodoAno", "periodoMes")
      );
    `);

    console.log('✅ Tabela EstatisticaImpactoEmpresa criada');

    // Criar tabela ColaboradorEmpresa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ColaboradorEmpresa" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        departamento TEXT,
        cargo TEXT,
        avatar TEXT,
        ativo BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("empresaId", email)
      );
    `);

    console.log('✅ Tabela ColaboradorEmpresa criada');

    // Criar tabela Iniciativa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Iniciativa" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "causaId" TEXT REFERENCES "Causa"(id),
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        "dataInicio" TIMESTAMP NOT NULL,
        "dataFim" TIMESTAMP,
        "tipoApoio" tipo_apoio_enum NOT NULL,
        vagas INTEGER,
        "vagasPreenchidas" INTEGER DEFAULT 0,
        status status_iniciativa NOT NULL DEFAULT 'RASCUNHO',
        localizacao TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        imagem TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela Iniciativa criada');

    // Criar tabela InscricaoIniciativa
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "InscricaoIniciativa" (
        id TEXT PRIMARY KEY,
        "iniciativaId" TEXT NOT NULL REFERENCES "Iniciativa"(id) ON DELETE CASCADE,
        "colaboradorId" TEXT NOT NULL REFERENCES "ColaboradorEmpresa"(id) ON DELETE CASCADE,
        status status_inscricao NOT NULL DEFAULT 'PENDENTE',
        "horasContribuidas" DOUBLE PRECISION DEFAULT 0,
        feedback TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("iniciativaId", "colaboradorId")
      );
    `);

    console.log('✅ Tabela InscricaoIniciativa criada');

    // Criar tabela Favorito
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Favorito" (
        id TEXT PRIMARY KEY,
        "ongId" TEXT NOT NULL REFERENCES "NGO"(id) ON DELETE CASCADE,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("ongId", "empresaId")
      );
    `);

    console.log('✅ Tabela Favorito criada');

    // Criar tabela Proposta
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Proposta" (
        id TEXT PRIMARY KEY,
        "ongId" TEXT NOT NULL REFERENCES "NGO"(id) ON DELETE CASCADE,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "iniciativaId" TEXT REFERENCES "Iniciativa"(id) ON DELETE SET NULL,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        "odsRelacionados" TEXT[],
        "anexosMeta" JSONB,
        status status_proposta NOT NULL DEFAULT 'PENDENTE',
        "respostaEmpresa" TEXT,
        "respondidoEm" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela Proposta criada');

    // Criar tabela Reuniao
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Reuniao" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "ongId" TEXT NOT NULL REFERENCES "NGO"(id) ON DELETE CASCADE,
        "propostaId" TEXT REFERENCES "Proposta"(id) ON DELETE SET NULL,
        titulo TEXT NOT NULL,
        descricao TEXT,
        "startAt" TIMESTAMP NOT NULL,
        "endAt" TIMESTAMP NOT NULL,
        status status_reuniao NOT NULL DEFAULT 'AGENDADA',
        "localOuLink" TEXT,
        "tipoReuniao" tipo_reuniao_enum,
        "criadoPorEmpresa" BOOLEAN DEFAULT true,
        notas TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela Reuniao criada');

    // Criar tabela ExportacaoRelatorio
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ExportacaoRelatorio" (
        id TEXT PRIMARY KEY,
        "empresaId" TEXT NOT NULL REFERENCES "Empresa"(id) ON DELETE CASCADE,
        "colaboradorId" TEXT REFERENCES "ColaboradorEmpresa"(id) ON DELETE SET NULL,
        titulo TEXT NOT NULL,
        "filtrosJson" JSONB,
        formato formato_relatorio NOT NULL,
        "caminhoFicheiro" TEXT,
        "tamanhoBytes" BIGINT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabela ExportacaoRelatorio criada');

    console.log('\n🎉 Todas as tabelas de Empresas foram criadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createEmpresasTables();
