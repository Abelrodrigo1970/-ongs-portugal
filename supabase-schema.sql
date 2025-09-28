-- Primeira migração (20250915084510_init)
CREATE TABLE "ColaboracaoTipo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColaboracaoTipo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AreaAtuacaoTipo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaAtuacaoTipo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ODS" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ODS_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NGO" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "missao" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "impacto" TEXT NOT NULL,
    "imagem" TEXT,
    "logo" TEXT,
    "instagramUrl" TEXT,
    "videoUrl" TEXT,
    "websiteUrl" TEXT,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Colaboracao" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "colaboracaoTipoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Colaboracao_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AreaAtuacao" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "areaAtuacaoTipoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AreaAtuacao_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NGOODS" (
    "id" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "odsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NGOODS_pkey" PRIMARY KEY ("id")
);

-- Segunda migração (20250918212023_add_events_system)
CREATE TYPE "EventTipo" AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');

CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "localizacao" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "tipo" "EventTipo" NOT NULL DEFAULT 'PRESENCIAL',
    "maxParticipantes" INTEGER,
    "inscricoesAbertas" BOOLEAN NOT NULL DEFAULT true,
    "linkInscricao" TEXT,
    "linkEvento" TEXT,
    "imagem" TEXT,
    "ngoId" TEXT NOT NULL,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventArea" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "areaAtuacaoTipoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventArea_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EventODS" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "odsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventODS_pkey" PRIMARY KEY ("id")
);

-- Índices únicos
CREATE UNIQUE INDEX "ColaboracaoTipo_nome_key" ON "ColaboracaoTipo"("nome");
CREATE UNIQUE INDEX "AreaAtuacaoTipo_nome_key" ON "AreaAtuacaoTipo"("nome");
CREATE UNIQUE INDEX "ODS_numero_key" ON "ODS"("numero");
CREATE UNIQUE INDEX "Colaboracao_ngoId_colaboracaoTipoId_key" ON "Colaboracao"("ngoId", "colaboracaoTipoId");
CREATE UNIQUE INDEX "AreaAtuacao_ngoId_areaAtuacaoTipoId_key" ON "AreaAtuacao"("ngoId", "areaAtuacaoTipoId");
CREATE UNIQUE INDEX "NGOODS_ngoId_odsId_key" ON "NGOODS"("ngoId", "odsId");
CREATE UNIQUE INDEX "EventArea_eventId_areaAtuacaoTipoId_key" ON "EventArea"("eventId", "areaAtuacaoTipoId");
CREATE UNIQUE INDEX "EventODS_eventId_odsId_key" ON "EventODS"("eventId", "odsId");

-- Chaves estrangeiras
ALTER TABLE "Colaboracao" ADD CONSTRAINT "Colaboracao_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Colaboracao" ADD CONSTRAINT "Colaboracao_colaboracaoTipoId_fkey" FOREIGN KEY ("colaboracaoTipoId") REFERENCES "ColaboracaoTipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AreaAtuacao" ADD CONSTRAINT "AreaAtuacao_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AreaAtuacao" ADD CONSTRAINT "AreaAtuacao_areaAtuacaoTipoId_fkey" FOREIGN KEY ("areaAtuacaoTipoId") REFERENCES "AreaAtuacaoTipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NGOODS" ADD CONSTRAINT "NGOODS_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NGOODS" ADD CONSTRAINT "NGOODS_odsId_fkey" FOREIGN KEY ("odsId") REFERENCES "ODS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventArea" ADD CONSTRAINT "EventArea_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventArea" ADD CONSTRAINT "EventArea_areaAtuacaoTipoId_fkey" FOREIGN KEY ("areaAtuacaoTipoId") REFERENCES "AreaAtuacaoTipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventODS" ADD CONSTRAINT "EventODS_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventODS" ADD CONSTRAINT "EventODS_odsId_fkey" FOREIGN KEY ("odsId") REFERENCES "ODS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
