const { createSession } = require('./lib/store');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = await createSession();
    return res.status(201).json({ sessionId, status: 'pending' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to create session' });
  }
};
