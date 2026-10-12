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
  const conv = db.getConversationById(id);
  if (!conv) {
    return NextResponse.json(
      { error: "Message ou conversation introuvable." },
      { status: 404 }
    );
  }

  const notes = db.getInternalNotes(id);

  return NextResponse.json({
    conversation: conv,
    notes,
    currentAdmin: {
      id: session.userId,
      name: session.adminDisplayName || session.pseudonym,
    },
  });
}
