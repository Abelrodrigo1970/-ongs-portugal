CREATE TABLE "NGOImpacto" (
    "id" TEXT PRIMARY KEY,
    "ngoId" TEXT NOT NULL,
    "valor" VARCHAR(10) NOT NULL,
    "descricao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NGOImpacto_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NGO"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NGOImpacto_ordem_check" CHECK ("ordem" >= 1 AND "ordem" <= 3)
);

CREATE UNIQUE INDEX "NGOImpacto_ngoId_ordem_key" ON "NGOImpacto" ("ngoId", "ordem");
