import crypto from "crypto";

// Clé maîtresse applicative 256 bits (32 octets)
const MASTER_KEY_HEX =
  process.env.APP_ENCRYPTION_KEY ||
  "4f9b8c1a2e3d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a";
const MASTER_KEY = Buffer.from(MASTER_KEY_HEX.slice(0, 64), "hex");

export function encryptText(text: string): {
  encryptedHex: string;
  ivHex: string;
  authTagHex: string;
} {
  const iv = crypto.randomBytes(12); // 96-bit IV standard pour GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", MASTER_KEY, iv);
  
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
    const decipher = crypto.createDecipheriv("aes-256-gcm", MASTER_KEY, iv);
    
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
