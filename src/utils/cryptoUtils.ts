import crypto from "crypto";

const algorithm = "aes-256-ctr";
const signature = "WAYENVBACKUP";

export function encrypt(text: string, secretKey: string): Buffer {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    crypto.createHash("sha256").update(secretKey).digest(),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const signatureBuffer = Buffer.from(signature);
  return Buffer.concat([signatureBuffer, iv, encrypted]);
}

export function decrypt(buffer: Buffer, secretKey: string): string {
  const signatureLength = Buffer.byteLength(signature);
  const fileSignature = buffer.slice(0, signatureLength).toString();
  if (fileSignature !== signature) {
    throw new Error("Invalid backup file signature");
  }
  const iv = buffer.slice(signatureLength, signatureLength + 16);
  const encryptedText = buffer.slice(signatureLength + 16);
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
