import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATI = [
  "PRE_CHECKIN",
  "ACCETTATO",
  "IN_ATTESA_RICAMBI",
  "IN_LAVORAZIONE",
  "IN_VERNICIATURA",
  "CONTROLLO_QUALITA",
  "PRONTO",
  "CONSEGNATO",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stato, note, dataConsegnaPrevista } = body;

    // Validate stato
    if (!stato || !VALID_STATI.includes(stato)) {
      return NextResponse.json(
        { success: false, error: "Stato non valido" },
        { status: 400 }
      );
    }

    // Check pratica exists
    const pratica = await prisma.pratica.findUnique({
      where: { id },
    });

    if (!pratica) {
      return NextResponse.json(
        { success: false, error: "Pratica non trovata" },
        { status: 404 }
      );
    }

    // Update pratica and create history entry in transaction
    await prisma.$transaction([
      // Update pratica status
      prisma.pratica.update({
        where: { id },
        data: {
          statoCorrente: stato,
          dataConsegnaPrevista: dataConsegnaPrevista
            ? new Date(dataConsegnaPrevista)
            : pratica.dataConsegnaPrevista,
          dataConsegnaEffettiva:
            stato === "CONSEGNATO" ? new Date() : pratica.dataConsegnaEffettiva,
        },
      }),
      // Create history entry
      prisma.storicoStato.create({
        data: {
          stato,
          note: note || null,
          praticaId: id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Stato aggiornato con successo",
    });
  } catch (error) {
    console.error("Stato update error:", error);
    return NextResponse.json(
      { success: false, error: "Errore nell'aggiornamento dello stato" },
      { status: 500 }
    );
  }
}
