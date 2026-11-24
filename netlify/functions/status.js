const { getStatus } = require('./lib/store');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const sessionId = event.queryStringParameters?.sessionId;
  const status = await getStatus(sessionId);
  if (!status) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Session not found' }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ status })
  };
};
