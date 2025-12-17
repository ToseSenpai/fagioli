import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pratica = await prisma.pratica.findUnique({
      where: { id },
      include: {
        veicolo: {
          select: {
            targa: true,
            marca: true,
            modello: true,
            anno: true,
            colore: true,
          },
        },
        cliente: {
          select: {
            nome: true,
            cognome: true,
            telefono: true,
            email: true,
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
        foto: {
          select: {
            id: true,
            url: true,
            tipo: true,
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
        ...pratica,
        dataIncidente: pratica.dataIncidente?.toISOString() || null,
        dataConsegnaPrevista: pratica.dataConsegnaPrevista?.toISOString() || null,
        dataConsegnaEffettiva: pratica.dataConsegnaEffettiva?.toISOString() || null,
        dataAppuntamento: pratica.dataAppuntamento?.toISOString() || null,
        createdAt: pratica.createdAt.toISOString(),
        updatedAt: pratica.updatedAt.toISOString(),
        storicoStati: pratica.storicoStati.map((s) => ({
          ...s,
          timestamp: s.timestamp.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Pratica detail error:", error);
    return NextResponse.json(
      { success: false, error: "Errore nel recupero della pratica" },
      { status: 500 }
    );
  }
}
