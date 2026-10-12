import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPERADMIN") {
    return NextResponse.json(
      { error: "Accès restreint au Super-Administrateur." },
      { status: 403 }
    );
  }

  const logs = db.getAuditLogs();
  return NextResponse.json({ logs });
}
