import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const result: Record<string, any> = {
    has_bot_token: !!botToken,
    has_chat_id: !!chatId,
    bot_token_prefix: botToken ? botToken.substring(0, 10) + "..." : "MISSING",
    chat_id: chatId || "MISSING",
    node_env: process.env.NODE_ENV,
    telegram_api_url: process.env.TELEGRAM_API_URL || "https://api.telegram.org",
  };
  const telegramApiUrl = process.env.TELEGRAM_API_URL || "https://api.telegram.org";

  // Try calling Telegram getMe
  if (botToken) {
    try {
      const res = await fetch(`${telegramApiUrl}/bot${botToken}/getMe`);
      const data = await res.json() as any;
      result.telegram_bot_ok = data.ok;
      result.telegram_bot_name = data.result?.first_name;
      result.telegram_bot_username = data.result?.username;
    } catch (e: any) {
      result.telegram_bot_error = e.message;
    }

    // Try sending a test message
    if (chatId) {
      try {
        const res = await fetch(`${telegramApiUrl}/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "Debug test from Vercel ✅" }),
        });
        const data = await res.json() as any;
        result.send_message_ok = data.ok;
        result.send_message_error = data.description || null;
      } catch (e: any) {
        result.send_message_error = e.message;
      }
    }
  }

  return NextResponse.json(result);
}
