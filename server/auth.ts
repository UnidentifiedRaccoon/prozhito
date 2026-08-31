import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
let hashing=false;
async function scrypt(password:string,salt:string) {
  if(hashing) throw Object.assign(new Error("Password verification busy"),{statusCode:429});
  hashing=true;
  try { return await new Promise<Buffer>((resolve,reject)=>scryptCallback(password,salt,64,{N:131072,r:8,p:1,maxmem:256*1024*1024},(error,key)=>error?reject(error):resolve(key))); }
  finally { hashing=false; }
}
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");
export const csrfToken = (session: string) => createHmac("sha256", session).update("prozhito-editor-csrf-v1").digest("base64url");
export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export async function hashPassword(password: string) {
  const salt = randomBytes(32).toString("hex");
  const key = await scrypt(password, salt);
  return `scrypt-v1:${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [version, salt, hash] = stored.split(":");
  if (version !== "scrypt-v1" || !/^[a-f0-9]{64}$/.test(salt ?? "") || !/^[a-f0-9]{128}$/.test(hash ?? "")) return false;
  const key = await scrypt(password, salt);
  return timingSafeEqual(key, Buffer.from(hash,"hex"));
}
function base32(secret: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  if (!/^[A-Z2-7]{32,64}$/.test(secret)) throw new Error("Invalid MFA configuration");
  let bits = "";
  for (const char of secret) bits += alphabet.indexOf(char).toString(2).padStart(5,"0");
  return Buffer.from((bits.match(/.{8}/g) ?? []).map(byte => parseInt(byte,2)));
}
export function totpAt(secret: string, step: number) {
  const bytes = Buffer.alloc(8); bytes.writeBigUInt64BE(BigInt(step));
  const mac = createHmac("sha1", base32(secret)).update(bytes).digest();
  const offset = mac[mac.length-1] & 15;
  return String((mac.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6,"0");
}
export function verifyTotp(secret: string, value: string, now: Date) {
  const step = Math.floor(now.getTime()/30000);
  if (!/^\d{6}$/.test(value)) return null;
  for (const candidate of [step, step-1, step+1]) if (safeEqual(totpAt(secret,candidate),value)) return candidate;
  return null;
}
