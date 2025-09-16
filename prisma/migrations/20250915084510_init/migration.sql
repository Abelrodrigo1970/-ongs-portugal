-- CreateTable
CREATE TABLE "NGO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "missao" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "impacto" TEXT NOT NULL,
    "imagem" TEXT,
    "logo" TEXT,
    "instagramUrl" TEXT,
    "videoUrl" TEXT,
    "websiteUrl" TEXT,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ODS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NGOODS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "odsId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NGOODS_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NGOODS_odsId_fkey" FOREIGN KEY ("odsId") REFERENCES "ODS" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ColaboracaoTipo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Colaboracao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "colaboracaoTipoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Colaboracao_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Colaboracao_colaboracaoTipoId_fkey" FOREIGN KEY ("colaboracaoTipoId") REFERENCES "ColaboracaoTipo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AreaAtuacaoTipo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AreaAtuacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "areaAtuacaoTipoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AreaAtuacao_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AreaAtuacao_areaAtuacaoTipoId_fkey" FOREIGN KEY ("areaAtuacaoTipoId") REFERENCES "AreaAtuacaoTipo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ODS_numero_key" ON "ODS"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "NGOODS_ngoId_odsId_key" ON "NGOODS"("ngoId", "odsId");

-- CreateIndex
CREATE UNIQUE INDEX "ColaboracaoTipo_nome_key" ON "ColaboracaoTipo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Colaboracao_ngoId_colaboracaoTipoId_key" ON "Colaboracao"("ngoId", "colaboracaoTipoId");

-- CreateIndex
CREATE UNIQUE INDEX "AreaAtuacaoTipo_nome_key" ON "AreaAtuacaoTipo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "AreaAtuacao_ngoId_areaAtuacaoTipoId_key" ON "AreaAtuacao"("ngoId", "areaAtuacaoTipoId");
