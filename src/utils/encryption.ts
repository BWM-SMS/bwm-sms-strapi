import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
let secretKey: Buffer;
let iv: Buffer;

function initEncryption() {
  const key = (process.env.DATA_SECRET || 'default_secret_key');
  secretKey = Buffer.from(key.padEnd(32, ' ').slice(0, 32));
  iv = crypto.randomBytes(16);
}

function encrypt(text: string): string {
  try {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (e) {
    console.log(e);
    return text;
  }
}

function decrypt(encrypted: string): string {
  try {
    const [ivText, encryptedText] = encrypted.split(':');
    const ivBuffer = Buffer.from(ivText, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    console.log(e);
    return '';
  }
}
const Encryption = {
  initEncryption,
  encrypt,
  decrypt
};

export { Encryption };