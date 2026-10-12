import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ConversationCategory } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée ou non autorisée." }, { status: 401 });
  }

  const conversations = db.getStudentConversations(session.userId);
  return NextResponse.json({ conversations });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  try {
    const { category, message, title } = await request.json();

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Ton message doit comporter au moins 5 caractères." },
        { status: 400 }
      );
    }

    const validCategories: ConversationCategory[] = [
      "COUPLE",
      "FRIENDSHIP",
      "FAMILY",
      "SELF_ESTEEM",
      "OTHER",
    ];

    const cat: ConversationCategory = validCategories.includes(category)
      ? category
      : "OTHER";

    const { conversation } = db.createConversation(
      session.userId,
      cat,
      message.trim(),
      title?.trim()
    );

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
    });
  } catch (err) {
    console.error("Erreur création conversation :", err);
    return NextResponse.json(
      { error: "Impossible d'enregistrer ta question." },
      { status: 500 }
    );
  }
}
