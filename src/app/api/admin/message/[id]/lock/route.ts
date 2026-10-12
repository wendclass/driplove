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
  const adminName = session.adminDisplayName || session.pseudonym;

  const result = db.acquireLock(id, session.userId, adminName);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: result.message,
        lock: result.lock,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    success: true,
    lock: result.lock,
  });
}

export async function DELETE(
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
  const released = db.releaseLock(id, session.userId);

  return NextResponse.json({ success: released });
}
