import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "RESPONDER" && session.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const { responseText } = await request.json();
    if (!responseText || responseText.trim().length < 5) {
      return NextResponse.json(
        { error: "La réponse doit comporter au moins 5 caractères." },
        { status: 400 }
      );
    }

    const adminName = session.adminDisplayName || session.pseudonym;
    const msg = db.sendAdminResponse(
      id,
      session.userId,
      adminName,
      responseText.trim()
    );

    if (!msg) {
      return NextResponse.json(
        { error: "Impossible d'envoyer la réponse à ce fil." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      signature: "Dr IPLOVE",
      sentAt: msg.createdAt,
    });
  } catch (err) {
    console.error("Erreur réponse admin :", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi." },
      { status: 500 }
    );
  }
}
