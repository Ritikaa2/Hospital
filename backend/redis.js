const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

let isRedisConnected = false;
const memoryCache = new Map();

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', () => {
  isRedisConnected = false;
});

(async () => {
  try {
    await client.connect();
    isRedisConnected = true;
    console.log('Connected to Redis (Port 6379)');
  } catch (err) {
    console.log('Redis offline, using fast memory cache for OTP');
    isRedisConnected = false;
  }
})();

async function setOTP(email, otp) {
  const key = `otp:${email.toLowerCase()}`;
  if (isRedisConnected) {
    try {
      await client.setEx(key, 300, otp);
      return;
    } catch (e) {}
  }
  memoryCache.set(key, { otp, expiresAt: Date.now() + 300 * 1000 });
}

async function getOTP(email) {
  const key = `otp:${email.toLowerCase()}`;
  if (isRedisConnected) {
    try {
      return await client.get(key);
    } catch (e) {}
  }
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return item.otp;
}

async function delOTP(email) {
  const key = `otp:${email.toLowerCase()}`;
  if (isRedisConnected) {
    try {
      await client.del(key);
      return;
    } catch (e) {}
  }
  memoryCache.delete(key);
}

module.exports = { client, setOTP, getOTP, delOTP };
