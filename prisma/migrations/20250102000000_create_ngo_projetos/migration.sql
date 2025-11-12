CREATE TABLE "NGOProjeto" (
    "id" TEXT PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT,
    "ordem" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NGOProjeto_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NGOProjeto_ordem_check" CHECK ("ordem" >= 1 AND "ordem" <= 3)
);

CREATE UNIQUE INDEX "NGOProjeto_ngoId_ordem_key" ON "NGOProjeto" ("ngoId", "ordem");
