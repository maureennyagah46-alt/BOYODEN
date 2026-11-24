const { Telegraf } = require('telegraf');
const { setStatus } = require('./lib/store');

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionId = req.body?.sessionId;
  if (!/^[a-zA-Z0-9-]{16,64}$/.test(sessionId || '')) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  try {
    await setStatus(sessionId, 'waiting');
    await bot.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID,
      `A decision is requested for session ${sessionId}`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Approve', callback_data: `approve:${sessionId}` },
            { text: 'Reject', callback_data: `reject:${sessionId}` }
          ]]
        }
      }
    );
    return res.status(200).json({ status: 'waiting' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to request decision' });
  }
};
