import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const messageIdStr = searchParams.get("messageId");
    const fileName = searchParams.get("fileName") || "download";
    const inline = searchParams.get("inline") === "true";
    const mimeType = searchParams.get("mimeType") || "application/octet-stream";

    if (!messageIdStr) {
      return NextResponse.json({ error: "messageId is required" }, { status: 400 });
    }

    const messageId = parseInt(messageIdStr, 10);
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // ── Strategy 1: Use Bot API file_id if available (fast, no MTProto) ──────
    if (botToken) {
      await connectDB();
      const dbFile = await DriveFile.findOne({
        userId: session.userId,
        messageId,
      }).lean() as any;

      if (dbFile?.telegramFileId) {
        try {
          console.log(`[download] Using Bot API file_id: ${dbFile.telegramFileId}`);

          // Get the file path from Telegram
          const fileInfoRes = await fetch(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${dbFile.telegramFileId}`
          );
          const fileInfo = await fileInfoRes.json() as {
            ok: boolean;
            result?: { file_path: string };
            description?: string;
          };

          if (!fileInfo.ok || !fileInfo.result?.file_path) {
            throw new Error(fileInfo.description || "getFile failed");
          }

          // Download directly from Telegram CDN
          const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
          const fileRes = await fetch(fileUrl);

          if (!fileRes.ok) {
            throw new Error(`Telegram CDN returned ${fileRes.status}`);
          }

          const buffer = Buffer.from(await fileRes.arrayBuffer());
          const safeFileName = encodeURIComponent(fileName);
          const contentDisposition = inline
            ? `inline; filename*=UTF-8''${safeFileName}`
            : `attachment; filename*=UTF-8''${safeFileName}`;

          console.log(`[download] Bot API download success. Size: ${buffer.length} bytes`);

          return new NextResponse(new Uint8Array(buffer), {
            headers: {
              "Content-Disposition": contentDisposition,
              "Content-Type": mimeType,
              "Content-Length": buffer.length.toString(),
              "Cache-Control": "private, max-age=3600",
            },
          });
        } catch (botErr) {
          console.warn("[download] Bot API download failed, falling back to GramJS:", botErr);
          // Fall through to GramJS fallback
        }
      }
    }

    // ── Strategy 2: GramJS MTProto fallback (for old files with no file_id) ──
    console.log(`[download] Falling back to GramJS for messageId: ${messageId}`);
    const client = createTelegramClient(session.telegramSession);
    await client.connect();

    const messages = await client.getMessages("me", { ids: [messageId] });
    if (!messages || messages.length === 0 || !messages[0]) {
      await client.disconnect();
      return NextResponse.json({ error: "Message not found in Telegram." }, { status: 404 });
    }

    const buffer = await client.downloadMedia(messages[0], {}) as Buffer | null;
    await client.disconnect();

    if (!buffer) {
      return NextResponse.json({ error: "Failed to download file from Telegram." }, { status: 500 });
    }

    const safeFileName = encodeURIComponent(fileName);
    const contentDisposition = inline
      ? `inline; filename*=UTF-8''${safeFileName}`
      : `attachment; filename*=UTF-8''${safeFileName}`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": contentDisposition,
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
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
