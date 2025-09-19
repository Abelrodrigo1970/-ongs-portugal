-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "localizacao" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "tipo" TEXT NOT NULL DEFAULT 'PRESENCIAL',
    "maxParticipantes" INTEGER,
    "inscricoesAbertas" BOOLEAN NOT NULL DEFAULT true,
    "linkInscricao" TEXT,
    "linkEvento" TEXT,
    "imagem" TEXT,
    "ngoId" TEXT NOT NULL,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventArea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "areaAtuacaoTipoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventArea_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventArea_areaAtuacaoTipoId_fkey" FOREIGN KEY ("areaAtuacaoTipoId") REFERENCES "AreaAtuacaoTipo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventODS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "odsId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventODS_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventODS_odsId_fkey" FOREIGN KEY ("odsId") REFERENCES "ODS" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EventArea_eventId_areaAtuacaoTipoId_key" ON "EventArea"("eventId", "areaAtuacaoTipoId");

-- CreateIndex
CREATE UNIQUE INDEX "EventODS_eventId_odsId_key" ON "EventODS"("eventId", "odsId");
