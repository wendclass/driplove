import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { id } = await params;
    const ok = db.revokeInvitation(
      id,
      session.userId,
      session.adminDisplayName || session.pseudonym
    );

    if (!ok) {
      return NextResponse.json(
        { error: "Invitation introuvable ou déjà utilisée." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur révocation invitation :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
