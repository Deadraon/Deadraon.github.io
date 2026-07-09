import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const client = createTelegramClient();
    await client.connect();

    const result = await client.sendCode(
      {
        apiId: parseInt(process.env.TELEGRAM_API_ID!, 10),
        apiHash: process.env.TELEGRAM_API_HASH!,
      },
      phoneNumber
    );

    const sessionString = client.session.save() as unknown as string;
    await client.disconnect();

    const session = await getSession();
    session.phoneNumber = phoneNumber;
    session.phoneCodeHash = result.phoneCodeHash;
    session.telegramSession = sessionString;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string };
    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Rate limited. Please wait ${err.seconds} seconds.` },
        { status: 429 }
      );
    }
    console.error("[send-code]", error);
    return NextResponse.json(
      { error: err.message || "Failed to send code" },
      { status: 500 }
    );
  }
}
