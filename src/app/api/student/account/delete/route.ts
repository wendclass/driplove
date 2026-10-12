import { NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Session non authentifiée." }, { status: 401 });
  }

  // Seuls les étudiants peuvent supprimer leur compte directement ici
  if (session.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Action réservée aux comptes étudiants." },
      { status: 403 }
    );
  }

  db.deleteStudentAccount(session.userId);
  await clearSession();

  return NextResponse.json({
    success: true,
    message: "Toutes tes données ont été définitivement purgées.",
  });
}
