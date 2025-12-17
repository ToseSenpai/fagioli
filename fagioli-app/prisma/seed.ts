import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a test cliente
  const cliente = await prisma.cliente.create({
    data: {
      nome: "Mario",
      cognome: "Rossi",
      telefono: "333 1234567",
      email: "mario.rossi@email.com",
    },
  });

  console.log("Created cliente:", cliente.nome, cliente.cognome);

  // Create a test veicolo
  const veicolo = await prisma.veicolo.create({
    data: {
      targa: "AB123CD",
      marca: "Fiat",
      modello: "Panda",
      anno: 2020,
      colore: "Bianco",
      clienteId: cliente.id,
    },
  });

  console.log("Created veicolo:", veicolo.targa);

  // Create a test pratica
  const pratica = await prisma.pratica.create({
    data: {
      trackingCode: "FAG-ABC234",
      tipo: "SINISTRO",
      descrizione: "Danno al paraurti anteriore dopo tamponamento",
      dataIncidente: new Date("2025-12-10"),
      luogoIncidente: "Via Roma 45, Milano",
      caiCompilato: true,
      assicurazione: "Generali",
      numeroPolizza: "123456789",
      statoCorrente: "IN_LAVORAZIONE",
      dataConsegnaPrevista: new Date("2025-12-20"),
      clienteId: cliente.id,
      veicoloId: veicolo.id,
    },
  });

  console.log("Created pratica:", pratica.trackingCode);

  // Create status history
  const stati = [
    { stato: "PRE_CHECKIN", offset: -5, note: "Pre-check-in completato dal cliente" },
    { stato: "ACCETTATO", offset: -4, note: "Veicolo consegnato in carrozzeria" },
    { stato: "IN_LAVORAZIONE", offset: -2, note: "Iniziati lavori di riparazione" },
  ] as const;

  for (const s of stati) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() + s.offset);

    await prisma.storicoStato.create({
      data: {
        stato: s.stato,
        timestamp,
        note: s.note,
        praticaId: pratica.id,
      },
    });
  }

  console.log("Created status history");

  // Create another pratica that is ready
  const cliente2 = await prisma.cliente.create({
    data: {
      nome: "Luigi",
      cognome: "Verdi",
      telefono: "333 9876543",
    },
  });

  const veicolo2 = await prisma.veicolo.create({
    data: {
      targa: "EF456GH",
      marca: "Volkswagen",
      modello: "Golf",
      anno: 2019,
      colore: "Grigio metallizzato",
      clienteId: cliente2.id,
    },
  });

  const pratica2 = await prisma.pratica.create({
    data: {
      trackingCode: "FAG-XYZ789",
      tipo: "ESTETICO",
      descrizione: "Graffi sulla portiera destra",
      statoCorrente: "PRONTO",
      clienteId: cliente2.id,
      veicoloId: veicolo2.id,
    },
  });

  // Full history for pratica2
  const stati2 = [
    { stato: "PRE_CHECKIN", offset: -10 },
    { stato: "ACCETTATO", offset: -9 },
    { stato: "IN_LAVORAZIONE", offset: -7 },
    { stato: "IN_VERNICIATURA", offset: -5 },
    { stato: "CONTROLLO_QUALITA", offset: -2 },
    { stato: "PRONTO", offset: 0 },
  ] as const;

  for (const s of stati2) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() + s.offset);

    await prisma.storicoStato.create({
      data: {
        stato: s.stato,
        timestamp,
        praticaId: pratica2.id,
      },
    });
  }

  console.log("Created second pratica:", pratica2.trackingCode);

  console.log("Seeding complete!");
  console.log("\nTest tracking codes:");
  console.log("  - FAG-ABC234 (In lavorazione)");
  console.log("  - FAG-XYZ789 (Pronto per ritiro)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
