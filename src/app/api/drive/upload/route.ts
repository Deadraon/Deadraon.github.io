import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";

export const runtime = "nodejs";
export const maxDuration = 60;

function mapMongoToDriveFile(doc: any) {
  return {
    id: doc._id.toString(),
    user_id: doc.userId,
    file_name: doc.fileName,
    file_size: doc.fileSize,
    mime_type: doc.mimeType,
    message_id: doc.messageId,
    telegram_file_id: doc.telegramFileId || null,
    folder_path: doc.folderPath,
    uploaded_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
  };
}

/**
 * Pick the best Telegram Bot API endpoint and form field name for the given MIME type.
 * Using the right endpoint gives better compression and streaming support on Telegram's side.
 */
function getTelegramEndpointConfig(mimeType: string): {
  endpoint: string;
  fieldName: string;
  resultKey: string;
} {
  if (mimeType.startsWith("video/")) {
    return { endpoint: "sendDocument", fieldName: "document", resultKey: "document" };
  }
  if (mimeType.startsWith("audio/")) {
    return { endpoint: "sendAudio", fieldName: "audio", resultKey: "audio" };
  }
  if (mimeType.startsWith("image/")) {
    // sendDocument preserves original quality (sendPhoto compresses)
    return { endpoint: "sendDocument", fieldName: "document", resultKey: "document" };
  }
  return { endpoint: "sendDocument", fieldName: "document", resultKey: "document" };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          error:
            "Telegram Bot is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to your Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error("[upload] Failed to parse formData:", e);
      return NextResponse.json({ error: "Failed to parse the uploaded file." }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const folderPath = (formData.get("folderPath") as string) || "/";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Telegram Bot API hard limit: 50 MB for multipart upload
    const MAX_BOT_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_BOT_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 50 MB.`,
        },
        { status: 413 }
      );
    }

    const fileName = file.name || "unknown";
    const fileSize = file.size || 0;
    const mimeType = file.type || "application/octet-stream";

    console.log(`[upload] ${fileName} | ${(fileSize / 1024 / 1024).toFixed(2)} MB | ${mimeType} | folder: ${folderPath}`);

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { endpoint, fieldName, resultKey } = getTelegramEndpointConfig(mimeType);
    console.log(`[upload] Using endpoint: ${endpoint}, field: ${fieldName}`);

    // Build Bot API multipart form
    const botForm = new FormData();
    botForm.append("chat_id", chatId);
    botForm.append("caption", fileName);
    // Always force document to preserve exact file & avoid Telegram re-encoding
    botForm.append("document", new Blob([fileBuffer], { type: mimeType }), fileName);

    // Always use sendDocument — it preserves original file without re-encoding
    // sendVideo re-encodes and can fail or corrupt files
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      { method: "POST", body: botForm }
    );

    let telegramData: any;
    try {
      telegramData = await telegramRes.json();
    } catch {
      const raw = await telegramRes.text();
      console.error("[upload] Telegram response not JSON:", raw);
      return NextResponse.json({ error: "Invalid response from Telegram API." }, { status: 500 });
    }

    if (!telegramData.ok) {
      const errMsg: string = telegramData.description || "Unknown Telegram error";
      console.error("[upload] Telegram error:", telegramData);

      // Friendly message for common errors
      if (errMsg.includes("file is too big")) {
        return NextResponse.json(
          { error: "File is too large for Telegram Bot API (max 50 MB)." },
          { status: 413 }
        );
      }
      if (errMsg.includes("CHAT_NOT_FOUND") || errMsg.includes("chat not found")) {
        return NextResponse.json(
          {
            error:
              "Bot cannot find the target chat. Make sure you sent /start to your bot in Telegram first.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: `Telegram: ${errMsg}` }, { status: 500 });
    }

    // Extract message_id and file_id from result
    const result = telegramData.result;
    const messageId: number = result?.message_id ?? 0;

    // Telegram puts file_id in different fields depending on the type
    const telegramFileId: string =
      result?.document?.file_id ??
      result?.video?.file_id ??
      result?.audio?.file_id ??
      result?.photo?.[result.photo.length - 1]?.file_id ??
      "";

    console.log(`[upload] ✓ Message ID: ${messageId} | File ID: ${telegramFileId}`);

    // Persist metadata in MongoDB
    await connectDB();
    const doc = await DriveFile.create({
      userId: session.userId,
      fileName,
      fileSize,
      mimeType,
      messageId,
      telegramFileId,
      folderPath,
    });

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[upload] Unexpected error:", error);
    return NextResponse.json(
      { error: err.message || "Upload failed due to a server error." },
      { status: 500 }
    );
  }
}
