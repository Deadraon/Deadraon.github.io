import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import { CustomFile } from "telegram/client/uploads";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";

// CRITICAL: Force Node.js runtime so we can handle large binary buffers
export const runtime = "nodejs";

// Allow large file uploads (up to 2 GB — Telegram's limit)
export const maxDuration = 300; // 5 minutes timeout for large files

function mapMongoToDriveFile(doc: any) {
  return {
    id: doc._id.toString(),
    user_id: doc.userId,
    file_name: doc.fileName,
    file_size: doc.fileSize,
    mime_type: doc.mimeType,
    message_id: doc.messageId,
    folder_path: doc.folderPath,
    uploaded_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  let client;
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse formData — Next.js App Router handles multipart natively on Node runtime
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error("[upload] Failed to parse formData:", e);
      return NextResponse.json({ error: "Failed to parse form data. File may be too large." }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const folderPath = (formData.get("folderPath") as string) || "/";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided in the request." }, { status: 400 });
    }

    const fileName = file.name || "unknown";
    const fileSize = file.size || 0;
    const mimeType = file.type || "application/octet-stream";

    console.log(`[upload] Uploading: ${fileName} (${fileSize} bytes) to folder: ${folderPath}`);

    // Convert Web File to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to Telegram Saved Messages using GramJS
    client = createTelegramClient(session.telegramSession);
    await client.connect();

    console.log(`[upload] Connected to Telegram. Sending file...`);

    const message = await client.sendFile("me", {
      file: new CustomFile(
        fileName,   // display name
        fileSize,   // file size in bytes
        "",         // empty path — we're using a Buffer directly
        fileBuffer  // actual file data
      ),
      caption: fileName,
      forceDocument: true,
    });

    console.log(`[upload] File sent. Message ID: ${message.id}`);

    const messageId = Number(message.id);

    // Store metadata in MongoDB
    await connectDB();
    const doc = await DriveFile.create({
      userId: session.userId,
      fileName,
      fileSize,
      mimeType,
      messageId,
      folderPath,
    });

    console.log(`[upload] Metadata saved to MongoDB. Doc ID: ${doc._id}`);

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string; code?: number };

    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Telegram rate limit hit. Please wait ${err.seconds} seconds before retrying.` },
        { status: 429 }
      );
    }

    // AUTH_KEY_UNREGISTERED or SESSION_REVOKED — session expired
    if (err.errorMessage === "AUTH_KEY_UNREGISTERED" || err.errorMessage === "SESSION_REVOKED") {
      return NextResponse.json(
        { error: "Your Telegram session has expired. Please log in again." },
        { status: 401 }
      );
    }

    console.error("[upload] Error:", error);
    return NextResponse.json(
      { error: (err.message as string) || "Upload failed due to a server error." },
      { status: 500 }
    );
  } finally {
    // Always disconnect to prevent dangling connections
    if (client) {
      try {
        await client.disconnect();
      } catch (_) {}
    }
  }
}
