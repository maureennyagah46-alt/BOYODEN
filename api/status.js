const { getStatus } = require('./lib/store');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const status = await getStatus(req.query.sessionId);
  if (!status) return res.status(404).json({ error: 'Session not found' });

  return res.status(200).json({ status });
};
