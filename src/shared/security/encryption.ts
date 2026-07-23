// src/shared/security/encryption.ts

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET;

  if (!secret) {
    throw new Error(
      "API_KEY_ENCRYPTION_SECRET environment variable is not configured."
    );
  }

  const key = Buffer.from(secret, "hex");

  if (key.length !== 32) {
    throw new Error(
      "API_KEY_ENCRYPTION_SECRET must be a 32-byte key encoded as hex."
    );
  }

  return key;
}

export function encrypt(plainText: string): string {
  const key = getKey();

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(cipherText: string): string {
  const key = getKey();

  const data = Buffer.from(cipherText, "base64");

  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const encrypted = data.subarray(28);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}