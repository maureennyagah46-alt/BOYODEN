const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();
const PREFIX = 'boyoden:';
const TTL_SECONDS = 600;

function validSessionId(sessionId) {
  return /^[a-zA-Z0-9-]{16,64}$/.test(sessionId || '');
}

async function createSession() {
  const { randomUUID } = require('crypto');
  const sessionId = randomUUID();
  await redis.set(`${PREFIX}${sessionId}`, 'pending', { ex: TTL_SECONDS });
  return sessionId;
}

async function getStatus(sessionId) {
  if (!validSessionId(sessionId)) return null;
  return redis.get(`${PREFIX}${sessionId}`);
}

async function setStatus(sessionId, status) {
  if (!validSessionId(sessionId)) return false;
  if (!['pending', 'waiting', 'approved', 'rejected'].includes(status)) return false;
  await redis.set(`${PREFIX}${sessionId}`, status, { ex: TTL_SECONDS });
  return true;
}

module.exports = { createSession, getStatus, setStatus };
