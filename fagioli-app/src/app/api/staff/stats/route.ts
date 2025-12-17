import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get counts by status
    const [preCheckin, inLavorazione, pronte, totale] = await Promise.all([
      prisma.pratica.count({
        where: { statoCorrente: "PRE_CHECKIN" },
      }),
      prisma.pratica.count({
        where: {
          statoCorrente: {
            in: ["ACCETTATO", "IN_ATTESA_RICAMBI", "IN_LAVORAZIONE", "IN_VERNICIATURA", "CONTROLLO_QUALITA"],
          },
        },
      }),
      prisma.pratica.count({
        where: { statoCorrente: "PRONTO" },
      }),
      prisma.pratica.count({
        where: {
          statoCorrente: {
            not: "CONSEGNATO",
          },
        },
      }),
    ]);

    // Get recent pratiche
    const recentPratiche = await prisma.pratica.findMany({
      where: {
        statoCorrente: {
          not: "CONSEGNATO",
        },
      },
      include: {
        veicolo: {
          select: {
            targa: true,
            marca: true,
            modello: true,
          },
        },
        cliente: {
          select: {
            nome: true,
            cognome: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        preCheckin,
        inLavorazione,
        pronte,
        totale,
        recentPratiche: recentPratiche.map((p) => ({
          id: p.id,
          trackingCode: p.trackingCode,
          statoCorrente: p.statoCorrente,
          veicolo: p.veicolo,
          cliente: p.cliente,
          createdAt: p.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "Errore nel recupero delle statistiche" },
      { status: 500 }
    );
  }
}
