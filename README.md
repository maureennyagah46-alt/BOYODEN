# BOYODEN

Serverless decision-status demo for Vercel and Netlify.

The browser creates a short-lived session, polls `/api/status`, and asks the backend to notify an authorized Telegram chat. Telegram callback actions update Redis-backed session state.

## Environment variables

- `BOT_TOKEN`
- `ADMIN_CHAT_ID`
- `TELEGRAM_WEBHOOK_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Vercel

```bash
npm install
npx vercel
npx vercel --prod
```

## Netlify

```bash
npm install
npx netlify deploy --build
npx netlify deploy --prod --build
```

## Telegram webhook

Set the webhook after the production domain is available:

```bash
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://YOUR-DOMAIN/api/bot","secret_token":"YOUR_TELEGRAM_WEBHOOK_SECRET","allowed_updates":["callback_query"]}'
```

Do not add secrets to Git. Configure them in the Vercel or Netlify dashboard.
