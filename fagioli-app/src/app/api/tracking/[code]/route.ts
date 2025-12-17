import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidTrackingCode, normalizeTrackingCode } from "@/lib/tracking-code";
import type { TrackingResponse, TipoIntervento, StatoPratica } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse<TrackingResponse>> {
  try {
    const resolvedParams = await params;
    const code = normalizeTrackingCode(resolvedParams.code);

    // Validate tracking code format
    if (!isValidTrackingCode(code)) {
      return NextResponse.json(
        { success: false, error: "Codice tracking non valido" },
        { status: 400 }
      );
    }

    // Fetch pratica with related data
    const pratica = await prisma.pratica.findUnique({
      where: { trackingCode: code },
      include: {
        veicolo: {
          select: {
            targa: true,
            marca: true,
            modello: true,
            colore: true,
          },
        },
        storicoStati: {
          orderBy: { timestamp: "asc" },
          select: {
            stato: true,
            timestamp: true,
            note: true,
          },
        },
      },
    });

    if (!pratica) {
      return NextResponse.json(
        { success: false, error: "Pratica non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        trackingCode: pratica.trackingCode,
        veicolo: {
          targa: pratica.veicolo.targa,
          marca: pratica.veicolo.marca,
          modello: pratica.veicolo.modello,
          colore: pratica.veicolo.colore || undefined,
        },
        tipo: pratica.tipo as TipoIntervento,
        statoCorrente: pratica.statoCorrente as StatoPratica,
        dataConsegnaPrevista: pratica.dataConsegnaPrevista?.toISOString(),
        storicoStati: pratica.storicoStati.map((s) => ({
          stato: s.stato as StatoPratica,
          timestamp: s.timestamp.toISOString(),
          note: s.note || undefined,
        })),
      },
    });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Errore durante il recupero dei dati" },
      { status: 500 }
    );
  }
}
