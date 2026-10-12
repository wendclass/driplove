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
      charterAccepted,
    } = body;

    if (!token) {
      return NextResponse.json({ error: "Jeton d'invitation manquant." }, { status: 400 });
    }

    if (!charterAccepted) {
      return NextResponse.json(
        { error: "Vous devez formellement accepter la charte déontologique et de secret pour rejoindre l'équipe." },
        { status: 400 }
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
        { error: "Le nom ou titre interne est requis." },
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
        { error: "La configuration 2FA est obligatoire pour les administrateurs et répondants." },
        { status: 400 }
      );
    }

    const isTotpValid = verifyTotpCode(totpSecret, totpCode);
    if (!isTotpValid) {
      return NextResponse.json(
        { error: "Code 2FA invalide. Vérifiez l'heure de votre appareil et saisissez le code à 6 chiffres." },
        { status: 400 }
      );
    }

    if (!Array.isArray(backupCodes) || backupCodes.length < 4) {
      return NextResponse.json(
        { error: "Les codes de secours doivent être sauvegardés." },
        { status: 400 }
      );
    }

    const result = db.acceptAdminInvitation(token.trim(), {
      pseudonym: pseudonym.trim(),
      passwordPlain: password,
      displayName: displayName.trim(),
      internalEmail: internalEmail.trim(),
      totpSecretBase32: totpSecret.trim(),
      backupCodes,
      charterAccepted: true,
    });

    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error || "Erreur lors de l'inscription." }, { status: 400 });
    }

    await setSession(result.user);

    return NextResponse.json({
      success: true,
      message: "Compte configuré avec succès.",
    });
  } catch (err) {
    console.error("Erreur invitation accept :", err);
    return NextResponse.json({ error: "Erreur serveur lors de la validation." }, { status: 500 });
  }
}
