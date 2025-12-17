import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stato = searchParams.get("stato");
    const search = searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (stato) {
      where.statoCorrente = stato;
    }

    if (search) {
      where.OR = [
        { trackingCode: { contains: search } },
        { veicolo: { targa: { contains: search } } },
        { cliente: { nome: { contains: search } } },
        { cliente: { cognome: { contains: search } } },
        { cliente: { telefono: { contains: search } } },
      ];
    }

    const pratiche = await prisma.pratica.findMany({
      where,
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
            telefono: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: pratiche.map((p) => ({
        id: p.id,
        trackingCode: p.trackingCode,
        tipo: p.tipo,
        statoCorrente: p.statoCorrente,
        dataConsegnaPrevista: p.dataConsegnaPrevista?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
        veicolo: p.veicolo,
        cliente: p.cliente,
      })),
    });
  } catch (error) {
    console.error("Pratiche list error:", error);
    return NextResponse.json(
      { success: false, error: "Errore nel recupero delle pratiche" },
      { status: 500 }
    );
  }
}
