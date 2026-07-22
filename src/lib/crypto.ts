import crypto from "crypto";

const algorithm = "aes-256-gcm";

const secret = Buffer.from(
    process.env.API_KEY_ENCRYPTION_SECRET!,
    "hex"
);

export function encrypt(text: string) {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        algorithm,
        secret,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(text),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([
        iv,
        tag,
        encrypted,
    ]).toString("base64");
}

export function decrypt(payload: string) {
    const data = Buffer.from(payload, "base64");

    const iv = data.subarray(0, 12);

    const tag = data.subarray(12, 28);

    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv(
        algorithm,
        secret,
        iv
    );

    decipher.setAuthTag(tag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]).toString();
}