import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  const { id } = await params;
  const conv = db.getConversationById(id);

  if (!conv) {
    return NextResponse.json(
      { error: "Conversation introuvable." },
      { status: 404 }
    );
  }

  // Vérification de propriété de la conversation
  const rawConv = db.getStudentConversations(session.userId).find((c) => c.id === id);
  if (!rawConv && session.role === "STUDENT") {
    return NextResponse.json(
      { error: "Accès non autorisé à cette conversation." },
      { status: 403 }
    );
  }

  return NextResponse.json({ conversation: conv });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { message } = await request.json();
    if (!message || message.trim().length < 2) {
      return NextResponse.json(
        { error: "Message trop court." },
        { status: 400 }
      );
    }

    const added = db.addStudentMessage(id, session.userId, message.trim());
    if (!added) {
      return NextResponse.json(
        { error: "Impossible d'ajouter le message à ce fil." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur ajout message :", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = db.deleteConversation(id, session.userId);

  if (!deleted) {
    return NextResponse.json(
      { error: "Conversation introuvable ou non supprimable." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
