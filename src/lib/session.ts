import { cookies } from "next/headers";
import { User, UserRole } from "@/types";
import { db } from "./db";
import crypto from "crypto";

const SESSION_COOKIE = "dr_iplove_session";

function getSessionSecret(): Buffer {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 32) {
    return Buffer.from(process.env.SESSION_SECRET.trim(), "utf8");
  }
  // En l'absence de variable configurée, clé éphémère aléatoire forte en mémoire
  // Aucune clé statique par défaut n'est écrite en clair
  const g = globalThis as unknown as { __EPHEMERAL_SESSION_SECRET?: Buffer };
  if (!g.__EPHEMERAL_SESSION_SECRET) {
    g.__EPHEMERAL_SESSION_SECRET = crypto.randomBytes(32);
  }
  return g.__EPHEMERAL_SESSION_SECRET;
}

export interface SessionData {
  userId: string;
  pseudonym: string;
  role: UserRole;
  adminDisplayName?: string;
  expiresAt: number;
}

export function signToken(data: Omit<SessionData, "expiresAt">): string {
  const expiresAt = Date.now() + 7 * 24 * 3600 * 1000; // 7 jours
  const payload: SessionData = { ...data, expiresAt };
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(base64)
    .digest("base64url");
  return `${base64}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  try {
    const [base64, signature] = token.split(".");
    if (!base64 || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", getSessionSecret())
      .update(base64)
      .digest("base64url");

    if (
      signature.length !== expectedSig.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSig)
      )
    ) {
      return null;
    }

    const payload: SessionData = JSON.parse(
      Buffer.from(base64, "base64url").toString("utf8")
    );

    if (payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = verifyToken(token);
  if (!session) return null;

  // Invalidation immédiate si le compte est désactivé ou supprimé
  const user = db.findUserById(session.userId);
  if (!user || !user.isActive) {
    return null;
  }

  return session;
}

export async function setSession(user: User): Promise<void> {
  let adminDisplayName: string | undefined;
  if (user.role === "RESPONDER" || user.role === "SUPERADMIN") {
    const prof = db.getAdminProfile(user.id);
    adminDisplayName = prof?.displayName;
  }

  const token = signToken({
    userId: user.id,
    pseudonym: user.pseudonym,
    role: user.role,
    adminDisplayName,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
