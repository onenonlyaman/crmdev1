const crypto = require('crypto');
const env = require('../config/env');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT = 'crm_crypto_salt_9876';

// Derive 32-byte key from JWT_SECRET
const getSecretKey = () => {
  const secret = env.JWT_SECRET || 'fallback_secret_key';
  return crypto.pbkdf2Sync(secret, SALT, 100000, 32, 'sha256');
};

const encrypt = (text) => {
  if (!text) return null;
  try {
    const key = getSecretKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:encrypted_text:auth_tag
    return `${iv.toString('hex')}:${encrypted}:${tag}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
};

const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'hex');
    
    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
};

module.exports = {
  encrypt,
  decrypt,
};
