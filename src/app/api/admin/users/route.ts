import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const admins = db.getAllAdminUsers();
    return NextResponse.json({ success: true, admins });
  } catch (err) {
    console.error("Erreur liste admins :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { userId, isActive } = await request.json();
    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    const result = db.setAdminUserStatus(
      userId,
      isActive,
      session.userId,
      session.adminDisplayName || session.pseudonym
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Action impossible." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur modification statut admin :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Identifiant utilisateur requis." }, { status: 400 });
    }

    const result = db.deleteAdminUser(
      userId,
      session.userId,
      session.adminDisplayName || session.pseudonym
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Suppression impossible." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur suppression admin :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
