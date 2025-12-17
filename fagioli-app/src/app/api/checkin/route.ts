import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTrackingCode } from "@/lib/tracking-code";
import { checkinFormSchema } from "@/lib/validations/checkin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const dataJson = formData.get("data") as string;

    if (!dataJson) {
      return NextResponse.json(
        { success: false, error: "Dati mancanti" },
        { status: 400 }
      );
    }

    const rawData = JSON.parse(dataJson);

    // Validate form data
    const validationResult = checkinFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dati non validi",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Generate unique tracking code
    let trackingCode = generateTrackingCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existing = await prisma.pratica.findUnique({
        where: { trackingCode },
      });
      if (!existing) break;
      trackingCode = generateTrackingCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { success: false, error: "Errore nella generazione del codice" },
        { status: 500 }
      );
    }

    // Start transaction to create cliente, veicolo, pratica
    const pratica = await prisma.$transaction(async (tx) => {
      // Create or find cliente by phone
      let cliente = await tx.cliente.findFirst({
        where: { telefono: data.telefono },
      });

      if (!cliente) {
        cliente = await tx.cliente.create({
          data: {
            nome: data.nome,
            cognome: data.cognome,
            telefono: data.telefono,
            email: data.email || null,
          },
        });
      }

      // Create or find veicolo by targa
      let veicolo = await tx.veicolo.findUnique({
        where: { targa: data.targa },
      });

      if (!veicolo) {
        veicolo = await tx.veicolo.create({
          data: {
            targa: data.targa,
            marca: data.marca,
            modello: data.modello,
            anno: data.anno || null,
            colore: data.colore || null,
            clienteId: cliente.id,
          },
        });
      }

      // Create pratica
      const newPratica = await tx.pratica.create({
        data: {
          trackingCode,
          tipo: data.tipo,
          descrizione: data.descrizione || null,
          dataIncidente: data.dataIncidente ? new Date(data.dataIncidente) : null,
          luogoIncidente: data.luogoIncidente || null,
          caiCompilato: data.caiCompilato || false,
          controparteNome: data.controparteNome || null,
          controparteTarga: data.controparteTarga || null,
          assicurazione: data.assicurazione || null,
          numeroPolizza: data.numeroPolizza || null,
          dataAppuntamento: data.dataAppuntamento
            ? new Date(data.dataAppuntamento)
            : null,
          oraPreferita: data.oraPreferita || null,
          note: data.note || null,
          statoCorrente: "PRE_CHECKIN",
          clienteId: cliente.id,
          veicoloId: veicolo.id,
        },
      });

      // Create initial status entry
      await tx.storicoStato.create({
        data: {
          stato: "PRE_CHECKIN",
          praticaId: newPratica.id,
          note: "Pre-check-in completato dal cliente",
        },
      });

      return newPratica;
    });

    // Handle photo uploads (save paths to database)
    const photoEntries: { tipo: string; key: string }[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("photo_") && key.endsWith("_tipo")) {
        photoEntries.push({ tipo: value as string, key: key.replace("_tipo", "") });
      }
    }

    // For MVP, we'll store photos in the public/uploads folder
    // In production, you'd use cloud storage (S3, Cloudinary, etc.)
    for (const entry of photoEntries) {
      const file = formData.get(entry.key) as File | null;
      if (file && file.size > 0) {
        // For now, just create a reference (actual file storage would be implemented)
        await prisma.foto.create({
          data: {
            url: `/uploads/${pratica.id}/${entry.tipo}_${Date.now()}.jpg`,
            tipo: entry.tipo,
            praticaId: pratica.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      trackingCode: pratica.trackingCode,
    });
  } catch (error) {
    console.error("Checkin error:", error);
    return NextResponse.json(
      { success: false, error: "Errore durante il salvataggio" },
      { status: 500 }
    );
  }
}
