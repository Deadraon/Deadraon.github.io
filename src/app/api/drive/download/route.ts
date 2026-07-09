import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const messageIdStr = searchParams.get("messageId");
    const fileName = searchParams.get("fileName") || "download";

    if (!messageIdStr) {
      return NextResponse.json({ error: "messageId is required" }, { status: 400 });
    }

    const messageId = parseInt(messageIdStr, 10);

    const client = createTelegramClient(session.telegramSession);
    await client.connect();

    // Fetch the message from Saved Messages
    const messages = await client.getMessages("me", { ids: [messageId] });
    if (!messages || messages.length === 0 || !messages[0]) {
      await client.disconnect();
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const buffer = await client.downloadMedia(messages[0], {}) as Buffer | null;
    await client.disconnect();

    if (!buffer) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }

    const safeFileName = encodeURIComponent(fileName);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename*=UTF-8''${safeFileName}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string };
    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Rate limited. Please wait ${err.seconds} seconds.` },
        { status: 429 }
      );
    }
    console.error("[download]", error);
    return NextResponse.json(
      { error: err.message || "Download failed" },
      { status: 500 }
    );
  }
}
