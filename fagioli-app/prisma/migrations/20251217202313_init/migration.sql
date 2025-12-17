-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "codiceFiscale" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Veicolo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modello" TEXT NOT NULL,
    "anno" INTEGER,
    "colore" TEXT,
    "clienteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Veicolo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pratica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackingCode" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descrizione" TEXT,
    "dataIncidente" DATETIME,
    "luogoIncidente" TEXT,
    "caiCompilato" BOOLEAN NOT NULL DEFAULT false,
    "controparteNome" TEXT,
    "controparteTarga" TEXT,
    "assicurazione" TEXT,
    "numeroPolizza" TEXT,
    "statoCorrente" TEXT NOT NULL DEFAULT 'PRE_CHECKIN',
    "dataConsegnaPrevista" DATETIME,
    "dataConsegnaEffettiva" DATETIME,
    "dataAppuntamento" DATETIME,
    "oraPreferita" TEXT,
    "note" TEXT,
    "clienteId" TEXT NOT NULL,
    "veicoloId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pratica_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pratica_veicoloId_fkey" FOREIGN KEY ("veicoloId") REFERENCES "Veicolo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoricoStato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stato" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "praticaId" TEXT NOT NULL,
    CONSTRAINT "StoricoStato_praticaId_fkey" FOREIGN KEY ("praticaId") REFERENCES "Pratica" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "praticaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Foto_praticaId_fkey" FOREIGN KEY ("praticaId") REFERENCES "Pratica" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Cliente_telefono_idx" ON "Cliente"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Veicolo_targa_key" ON "Veicolo"("targa");

-- CreateIndex
CREATE INDEX "Veicolo_targa_idx" ON "Veicolo"("targa");

-- CreateIndex
CREATE UNIQUE INDEX "Pratica_trackingCode_key" ON "Pratica"("trackingCode");

-- CreateIndex
CREATE INDEX "Pratica_trackingCode_idx" ON "Pratica"("trackingCode");

-- CreateIndex
CREATE INDEX "Pratica_statoCorrente_idx" ON "Pratica"("statoCorrente");

-- CreateIndex
CREATE INDEX "StoricoStato_praticaId_timestamp_idx" ON "StoricoStato"("praticaId", "timestamp");

-- CreateIndex
CREATE INDEX "Foto_praticaId_idx" ON "Foto"("praticaId");
