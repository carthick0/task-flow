const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY || 'default-replacement-key-32-chars-long';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * @param {string} text - The text to encrypt.
 * @returns {string} - The encrypted text in format: salt:iv:authTag:encryptedData.
 */
const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength);
    const salt = crypto.randomBytes(saltLength);
    const key = crypto.scryptSync(secretKey, salt, 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts a string using AES-256-GCM.
 * @param {string} encryptedText - The encrypted text in format: salt:iv:authTag:encryptedData.
 * @returns {string} - The decrypted text.
 */
const decrypt = (encryptedText) => {
    const [salt, iv, authTag, encrypted] = encryptedText.split(':');
    const key = crypto.scryptSync(secretKey, Buffer.from(salt, 'hex'), 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

module.exports = { encrypt, decrypt };
