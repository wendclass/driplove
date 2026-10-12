import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const invitations = db.getAdminInvitations();
    return NextResponse.json({ success: true, invitations });
  } catch (err) {
    console.error("Erreur liste invitations :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const role = body.role === "SUPERADMIN" ? "SUPERADMIN" : "RESPONDER";

    const inv = db.createAdminInvitation(
      session.userId,
      session.adminDisplayName || session.pseudonym,
      role
    );

    return NextResponse.json({
      success: true,
      invitation: inv,
    });
  } catch (err) {
    console.error("Erreur création invitation :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
