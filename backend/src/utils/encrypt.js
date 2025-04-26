// backend/src/utils/encrypt.js
const crypto = require('crypto');
const KEY = Buffer.from(process.env.DATA_KEY, 'base64');

function encrypt(data) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  let ct = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  ct += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');
  return { ct, iv: iv.toString('base64'), authTag };
}

function decrypt({ ct, iv, authTag }) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    KEY,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  let pt = decipher.update(ct, 'base64', 'utf8');
  pt += decipher.final('utf8');
  return JSON.parse(pt);
}

module.exports = { encrypt, decrypt };
