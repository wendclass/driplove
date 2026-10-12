import crypto from "crypto";

function getMasterKey(): Buffer {
  if (process.env.APP_ENCRYPTION_KEY && process.env.APP_ENCRYPTION_KEY.trim().length >= 64) {
    return Buffer.from(process.env.APP_ENCRYPTION_KEY.trim().slice(0, 64), "hex");
  }
  // En l'absence de variable configurée, clé aléatoire éphémère 256 bits
  // Aucune clé maîtresse statique par défaut n'est écrite en clair
  const g = globalThis as unknown as { __EPHEMERAL_MASTER_KEY?: Buffer };
  if (!g.__EPHEMERAL_MASTER_KEY) {
    g.__EPHEMERAL_MASTER_KEY = crypto.randomBytes(32);
  }
  return g.__EPHEMERAL_MASTER_KEY;
}

export function encryptText(text: string): {
  encryptedHex: string;
  ivHex: string;
  authTagHex: string;
} {
  const iv = crypto.randomBytes(12); // 96-bit IV standard pour GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", getMasterKey(), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedHex: encrypted,
    ivHex: iv.toString("hex"),
    authTagHex: authTag,
  };
}

export function decryptText(
  encryptedHex: string,
  ivHex: string,
  authTagHex?: string
): string {
  try {
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", getMasterKey(), iv);
    
    if (authTagHex) {
      decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    }

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Erreur de déchiffrement :", error);
    return "[Message protégé indisponible]";
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

export function hashClubCode(code: string): string {
  // Normalisation du code (sans espaces, majuscules)
  const normalized = code.trim().toUpperCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
