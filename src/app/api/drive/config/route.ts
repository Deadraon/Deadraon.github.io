import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "Telegram Bot is not configured." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      botToken,
      chatId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
