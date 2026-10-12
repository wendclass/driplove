import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Le pass d'accès est requis." },
        { status: 400 }
      );
    }

    const isValid = db.verifyClubPass(code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Pass invalide ou expiré. Rapproche-toi de l'équipe d'écoute de l'IPERMIC." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur technique lors de la vérification." },
      { status: 500 }
    );
  }
}
