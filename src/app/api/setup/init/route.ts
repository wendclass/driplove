import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTotpSecret, generateTotpUri, generateBackupCodes } from "@/lib/totp";

export async function GET(request: Request) {
  try {
    // Si un superadmin existe déjà, la page répond comme inexistante (404)
    if (db.hasSuperadmin()) {
      return NextResponse.json({ error: "Page introuvable." }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || request.headers.get("x-setup-token");

    if (!token || !db.verifySetupToken(token)) {
      return NextResponse.json(
        { error: "Jeton de configuration invalide ou expiré." },
        { status: 403 }
      );
    }

    const { secretBase32 } = generateTotpSecret();
    const uri = generateTotpUri("SuperAdmin", secretBase32);
    const backupCodes = generateBackupCodes(8);

    return NextResponse.json({
      success: true,
      totpSecret: secretBase32,
      totpUri: uri,
      backupCodes,
    });
  } catch (err) {
    console.error("Erreur setup init :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
