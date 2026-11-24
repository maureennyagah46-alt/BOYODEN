const { Telegraf } = require('telegraf');
const { setStatus } = require('./lib/store');

const bot = new Telegraf(process.env.BOT_TOKEN);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { sessionId } = JSON.parse(event.body || '{}');
    if (!/^[a-zA-Z0-9-]{16,64}$/.test(sessionId || '')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid session' }) };
    }
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
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'waiting' })
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unable to request decision' }) };
  }
};
