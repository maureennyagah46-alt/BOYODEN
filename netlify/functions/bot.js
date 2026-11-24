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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (event.headers['x-telegram-bot-api-secret-token'] !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid webhook secret' }) };
  }
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Webhook failed' }) };
  }
};
