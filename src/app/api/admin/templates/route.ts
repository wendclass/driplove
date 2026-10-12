import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "RESPONDER" && session.role !== "SUPERADMIN")
  ) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const templates = db.getResponseTemplates();
  return NextResponse.json({ templates });
}
