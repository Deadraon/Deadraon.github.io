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
        { error: "Telegram Bot is not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in your environment variables." },
        { status: 500 }
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error("[upload] Failed to parse formData:", e);
      return NextResponse.json({ error: "Failed to parse form data." }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const folderPath = (formData.get("folderPath") as string) || "/";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Telegram Bot API limit: 50MB for multipart uploads
    const MAX_BOT_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_BOT_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum upload size is 50 MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)} MB.` },
        { status: 413 }
      );
    }

    const fileName = file.name || "unknown";
    const fileSize = file.size || 0;
    const mimeType = file.type || "application/octet-stream";

    console.log(`[upload] Sending via Bot API: ${fileName} (${fileSize} bytes) to folder: ${folderPath}`);

    // Convert to buffer and build multipart form for Bot API
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Build multipart form data for Telegram Bot API
    const botFormData = new FormData();
    botFormData.append("chat_id", chatId);
    botFormData.append("caption", fileName);

    // Use Blob since FormData expects a Blob/File in the browser-compatible API
    const blob = new Blob([fileBuffer], { type: mimeType });
    botFormData.append("document", blob, fileName);

    // Call Telegram Bot API to send the document
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        method: "POST",
        body: botFormData,
      }
    );

    const telegramData = await telegramRes.json() as {
      ok: boolean;
      result?: {
        message_id: number;
        document?: { file_id: string; file_unique_id: string };
      };
      description?: string;
      error_code?: number;
    };

    if (!telegramData.ok) {
      console.error("[upload] Telegram Bot API error:", telegramData);
      return NextResponse.json(
        { error: `Telegram error: ${telegramData.description || "Unknown error"}` },
        { status: 500 }
      );
    }

    const messageId = telegramData.result?.message_id ?? 0;
    const telegramFileId = telegramData.result?.document?.file_id ?? "";

    console.log(`[upload] Bot API success. Message ID: ${messageId}, File ID: ${telegramFileId}`);

    // Save metadata to MongoDB
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

    console.log(`[upload] Saved to MongoDB. Doc ID: ${doc._id}`);

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number };
    console.error("[upload] Unexpected error:", error);
    return NextResponse.json(
      { error: err.message || "Upload failed due to a server error." },
      { status: 500 }
    );
  }
}
