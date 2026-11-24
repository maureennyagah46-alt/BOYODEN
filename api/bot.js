const { Telegraf } = require('telegraf');
const { setStatus } = require('./lib/store');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.action(/^approve:(.+)$/, async (ctx) => {
  await setStatus(ctx.match[1], 'approved');
  await ctx.answerCbQuery('Approved');
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
});

bot.action(/^reject:(.+)$/, async (ctx) => {
  await setStatus(ctx.match[1], 'rejected');
  await ctx.answerCbQuery('Rejected');
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['x-telegram-bot-api-secret-token'] !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  try {
    await bot.handleUpdate(req.body);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Webhook failed' });
  }
};
