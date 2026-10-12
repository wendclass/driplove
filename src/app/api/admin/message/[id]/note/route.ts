import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(
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
  const notes = db.getInternalNotes(id);
  return NextResponse.json({ notes });
}

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
    const { note } = await request.json();
    if (!note || note.trim().length < 2) {
      return NextResponse.json(
        { error: "La note est trop courte." },
        { status: 400 }
      );
    }

    const adminName = session.adminDisplayName || session.pseudonym;
    const created = db.addInternalNote(id, session.userId, adminName, note.trim());

    return NextResponse.json({
      success: true,
      note: {
        id: created.id,
        authorName: adminName,
        createdAt: created.createdAt,
      },
    });
  } catch (err) {
    console.error("Erreur ajout note :", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'enregistrement de la note." },
      { status: 500 }
    );
  }
}
