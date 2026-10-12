import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "RESPONDER" && session.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const onlyAssignedToMe = searchParams.get("assignedToMe") === "true";
  const onlyUnassigned = searchParams.get("unassigned") === "true";
  const onlySensitive = searchParams.get("sensitive") === "true";

  const queue = db.getAdminQueue(session.userId, {
    status,
    category,
    onlyAssignedToMe,
    onlyUnassigned,
    onlySensitive,
  });

  return NextResponse.json({ queue });
}
