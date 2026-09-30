const redis = require('redis');

// Create Redis Client
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.log('Redis Error:', err.message);
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.log('Redis connection error:', err.message);
  }
})();

// Basic Operations: set, get, expire, del

// 1. Set key value (with optional expire in seconds)
const set = async (key, value, expireSeconds) => {
  try {
    const val = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await client.set(key, val);
    if (expireSeconds) {
      await client.expire(key, expireSeconds);
    }
    return true;
  } catch (err) {
    console.log('Redis set error:', err.message);
    return false;
  }
};

// 2. Get key value
const get = async (key) => {
  try {
    const data = await client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (err) {
    console.log('Redis get error:', err.message);
    return null;
  }
};

// 3. Set expiration time on key
const expire = async (key, seconds) => {
  try {
    await client.expire(key, seconds);
    return true;
  } catch (err) {
    console.log('Redis expire error:', err.message);
    return false;
  }
};

// 4. Delete key
const del = async (key) => {
  try {
    await client.del(key);
    return true;
  } catch (err) {
    console.log('Redis del error:', err.message);
    return false;
  }
};

// Simple OTP helpers
const setOTP = async (email, otp, seconds = 300) => {
  return await set(`otp:${email}`, otp, seconds);
};

const getOTP = async (email) => {
  return await get(`otp:${email}`);
};

const delOTP = async (email) => {
  return await del(`otp:${email}`);
};

module.exports = {
  client,
  set,
  get,
  expire,
  del,
  setOTP,
  getOTP,
  delOTP,
  // Simple caching aliases
  setCache: set,
  getCache: get,
  delCache: del
};
