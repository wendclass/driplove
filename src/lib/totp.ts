import crypto from "crypto";

// Alphabet RFC 4648 Base32
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Génère un secret TOTP cryptographiquement sécurisé (160 bits / 20 octets)
 */
export function generateTotpSecret(): { secretBase32: string; secretHex: string } {
  const buffer = crypto.randomBytes(20);
  return {
    secretBase32: base32Encode(buffer),
    secretHex: buffer.toString("hex"),
  };
}

/**
 * Génère l'URI standard pour les applications d'authentification (Google Auth, Apple, Bitwarden, etc.)
 */
export function generateTotpUri(
  accountName: string,
  secretBase32: string,
  issuer: string = "Dr IPLOVE"
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Calcule le code TOTP 6 chiffres pour un pas de temps donné
 */
function getTotpCodeAtCounter(secretBuffer: Buffer, counter: number): string {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac("sha1", secretBuffer).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Vérifie un code TOTP 6 chiffres avec tolérance d'horloge de +/- 30 secondes (RFC 6238)
 */
export function verifyTotpCode(
  secretBase32: string,
  userCode: string,
  windowSteps: number = 1
): boolean {
  try {
    const cleanCode = userCode.trim().replace(/\s+/g, "");
    if (!/^\d{6}$/.test(cleanCode)) return false;

    const secretBuffer = base32Decode(secretBase32);
    if (secretBuffer.length === 0) return false;

    const currentCounter = Math.floor(Date.now() / 1000 / 30);

    for (let step = -windowSteps; step <= windowSteps; step++) {
      const expectedCode = getTotpCodeAtCounter(secretBuffer, currentCounter + step);
      if (crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(expectedCode))) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Génère une liste de codes de secours d'urgence (8 codes de format XXXX-XXXX)
 */
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const part1 = crypto.randomBytes(2).toString("hex").toUpperCase();
    const part2 = crypto.randomBytes(2).toString("hex").toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

/**
 * Hache un code de secours avec sel pour stockage sécurisé
 */
export function hashBackupCode(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Vérifie si un code de secours saisi correspond à un des hashs stockés et retourne l'index du hash
 */
export function verifyAndConsumeBackupCode(
  code: string,
  storedHashes: string[]
): { valid: boolean; matchingHashIndex?: number } {
  const codeHash = hashBackupCode(code);
  const index = storedHashes.indexOf(codeHash);
  if (index !== -1) {
    return { valid: true, matchingHashIndex: index };
  }
  return { valid: false };
}
