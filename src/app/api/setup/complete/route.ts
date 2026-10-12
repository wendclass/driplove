import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTotpCode } from "@/lib/totp";
import { setSession } from "@/lib/session";

function validatePasswordStrength(pwd: string): { valid: boolean; message?: string } {
  if (pwd.length < 10) {
    return { valid: false, message: "Le mot de passe doit comporter au moins 10 caractères." };
  }
  if (!/[A-Z]/.test(pwd)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une lettre majuscule." };
  }
  if (!/[a-z]/.test(pwd)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une lettre minuscule." };
  }
  if (!/[0-9]/.test(pwd)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un chiffre." };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un caractère spécial." };
  }
  return { valid: true };
}

export async function POST(request: Request) {
  try {
    if (db.hasSuperadmin()) {
      return NextResponse.json({ error: "Page introuvable." }, { status: 404 });
    }

    const body = await request.json();
    const {
      token,
      pseudonym,
      displayName,
      internalEmail,
      password,
      totpSecret,
      totpCode,
      backupCodes,
    } = body;

    if (!token || !db.verifySetupToken(token)) {
      return NextResponse.json(
        { error: "Jeton de configuration invalide ou expiré." },
        { status: 403 }
      );
    }

    if (!pseudonym || pseudonym.trim().length < 3) {
      return NextResponse.json(
        { error: "L'identifiant interne doit comporter au moins 3 caractères." },
        { status: 400 }
      );
    }

    if (!displayName || displayName.trim().length < 2) {
      return NextResponse.json(
        { error: "Le nom ou titre d'affichage interne est requis." },
        { status: 400 }
      );
    }

    if (!internalEmail || !internalEmail.includes("@")) {
      return NextResponse.json(
        { error: "Une adresse email de contact interne valide est requise." },
        { status: 400 }
      );
    }

    const pwdCheck = validatePasswordStrength(password || "");
    if (!pwdCheck.valid) {
      return NextResponse.json({ error: pwdCheck.message }, { status: 400 });
    }

    if (!totpSecret || !totpCode) {
      return NextResponse.json(
        { error: "La configuration de la double authentification (2FA) est obligatoire." },
        { status: 400 }
      );
    }

    const isTotpValid = verifyTotpCode(totpSecret, totpCode);
    if (!isTotpValid) {
      return NextResponse.json(
        { error: "Code 2FA invalide. Vérifie l'heure de ton appareil et saisis le code à 6 chiffres." },
        { status: 400 }
      );
    }

    if (!Array.isArray(backupCodes) || backupCodes.length < 4) {
      return NextResponse.json(
        { error: "Les codes de secours doivent être sauvegardés." },
        { status: 400 }
      );
    }

    const result = db.completeInitialSetup({
      pseudonym: pseudonym.trim(),
      passwordPlain: password,
      displayName: displayName.trim(),
      internalEmail: internalEmail.trim(),
      totpSecretBase32: totpSecret.trim(),
      backupCodes,
    });

    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error || "Erreur de configuration." }, { status: 400 });
    }

    await setSession(result.user);

    return NextResponse.json({
      success: true,
      message: "Compte Super-Administrateur configuré avec succès.",
    });
  } catch (err) {
    console.error("Erreur setup complete :", err);
    return NextResponse.json({ error: "Erreur serveur lors de la finalisation." }, { status: 500 });
  }
}
