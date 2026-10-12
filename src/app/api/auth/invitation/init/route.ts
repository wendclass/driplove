import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTotpSecret, generateTotpUri, generateBackupCodes } from "@/lib/totp";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Jeton d'invitation manquant." }, { status: 400 });
    }

    const inv = db.getInvitationByToken(token);
    if (!inv) {
      return NextResponse.json(
        { error: "Ce lien d'invitation est invalide, a expiré (délai de 48h dépassé) ou a déjà été utilisé." },
        { status: 400 }
      );
    }

    const { secretBase32 } = generateTotpSecret();
    const uri = generateTotpUri("DrIPLOVE_Admin", secretBase32);
    const backupCodes = generateBackupCodes(8);

    return NextResponse.json({
      success: true,
      role: inv.role,
      expiresAt: inv.expiresAt,
      totpSecret: secretBase32,
      totpUri: uri,
      backupCodes,
    });
  } catch (err) {
    console.error("Erreur invitation init :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
