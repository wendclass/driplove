import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { pseudonym, password, totpCode } = await request.json();

    if (!pseudonym || !password) {
      return NextResponse.json(
        { error: "Pseudonyme et mot de passe requis." },
        { status: 400 }
      );
    }

    const cleanPseudo = pseudonym.trim();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const ipSubnet = ip.split(".").slice(0, 3).join(".") + ".0";

    // 1. Protection Brute-Force & Verrouillage Temporaire (5 tentatives / 15 min)
    if (db.isLoginLocked(cleanPseudo, ipSubnet)) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives de connexion infructueuses. Le compte est temporairement verrouillé. Veuillez réessayer dans 15 minutes.",
        },
        { status: 429 }
      );
    }

    // 2. Vérification des identifiants (mot de passe haché par scrypt)
    const user = db.verifyUserCredentials(cleanPseudo, password);
    if (!user) {
      db.recordLoginFailure(cleanPseudo, ipSubnet);
      return NextResponse.json(
        { error: "Identifiants incorrects. Vérifie ton pseudonyme et ton mot de passe." },
        { status: 401 }
      );
    }

    // 3. Si c'est un compte Administrateur / Répondant : 2FA obligatoire
    if (user.role === "RESPONDER" || user.role === "SUPERADMIN") {
      if (!totpCode) {
        return NextResponse.json({
          requiresTotp: true,
          message: "Code d'authentification 2FA requis.",
        });
      }

      const totpCheck = db.verifyAdminTotp(user.id, String(totpCode).trim());
      if (!totpCheck.valid) {
        db.recordLoginFailure(cleanPseudo, ipSubnet);
        return NextResponse.json(
          { error: "Code 2FA ou code de secours invalide." },
          { status: 401 }
        );
      }
    }

    // 4. Succès : Réinitialisation des tentatives et établissement de la session
    db.clearLoginFailures(cleanPseudo, ipSubnet);
    await setSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        pseudonym: user.pseudonym,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Erreur connexion :", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
