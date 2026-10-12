import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { clubPass, pseudonym, password, recoveryEmail } =
      await request.json();

    if (!clubPass || !db.verifyClubPass(clubPass)) {
      return NextResponse.json(
        { error: "Le pass club est invalide. Vérification échouée." },
        { status: 401 }
      );
    }

    if (!pseudonym || pseudonym.trim().length < 3) {
      return NextResponse.json(
        { error: "Le pseudonyme doit comporter au moins 3 caractères." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    const result = db.createStudent(
      pseudonym.trim(),
      password,
      recoveryEmail?.trim()
    );

    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error || "Impossible de créer le compte." },
        { status: 409 }
      );
    }

    await setSession(result.user);

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        pseudonym: result.user.pseudonym,
        role: result.user.role,
      },
    });
  } catch (err) {
    console.error("Erreur inscription :", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du compte." },
      { status: 500 }
    );
  }
}
