import crypto from "crypto";

const algorithm = "aes-256-ctr";

export function encrypt(text: string, secretKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    crypto.createHash("sha256").update(secretKey).digest(),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(hash: string, secretKey: string): string {
  const [ivStr, encryptedStr] = hash.split(":");
  const iv = Buffer.from(ivStr, "hex");
  const encryptedText = Buffer.from(encryptedStr, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    crypto.createHash("sha256").update(secretKey).digest(),
    iv,
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString();
}
