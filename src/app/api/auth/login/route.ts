import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { pseudonym, password } = await request.json();

    if (!pseudonym || !password) {
      return NextResponse.json(
        { error: "Pseudonyme et mot de passe requis." },
        { status: 400 }
      );
    }

    const user = db.verifyUserCredentials(pseudonym.trim(), password);
    if (!user) {
      return NextResponse.json(
        { error: "Identifiants incorrects. Vérifie ton pseudonyme et ton mot de passe." },
        { status: 401 }
      );
    }

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
