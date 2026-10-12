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
    const { draftText } = await request.json();
    if (!draftText || draftText.trim().length < 5) {
      return NextResponse.json(
        { error: "Le projet de réponse est trop court pour relecture." },
        { status: 400 }
      );
    }

    const adminName = session.adminDisplayName || session.pseudonym;
    const req = db.requestReview(id, session.userId, adminName, draftText.trim());

    return NextResponse.json({
      success: true,
      requestId: req.id,
      status: "UNDER_REVIEW",
    });
  } catch (err) {
    console.error("Erreur demande relecture :", err);
    return NextResponse.json(
      { error: "Impossible de soumettre pour relecture." },
      { status: 500 }
    );
  }
}
