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
 * Build a raw multipart/form-data Buffer manually.
 * This avoids Node.js FormData/Blob compatibility issues in serverless environments.
 */
function buildMultipartBody(
  fields: Record<string, string>,
  fileField: string,
  fileName: string,
  fileBuffer: Buffer,
  fileMimeType: string
): { body: Buffer; contentType: string } {
  const boundary = `----TGBoundary${Date.now()}`;
  const crlf = "\r\n";
  const parts: Buffer[] = [];

  // Text fields
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(
        `--${boundary}${crlf}` +
        `Content-Disposition: form-data; name="${name}"${crlf}` +
        `${crlf}` +
        `${value}${crlf}`
      )
    );
  }

  // File field
  parts.push(
    Buffer.from(
      `--${boundary}${crlf}` +
      `Content-Disposition: form-data; name="${fileField}"; filename="${fileName}"${crlf}` +
      `Content-Type: ${fileMimeType}${crlf}` +
      `${crlf}`
    )
  );
  parts.push(fileBuffer);
  parts.push(Buffer.from(crlf));

  // Closing boundary
  parts.push(Buffer.from(`--${boundary}--${crlf}`));

  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

export async function POST(req: NextRequest) {
  console.log("[upload] Request received");

  try {
    // Step 1: Auth check
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      console.log("[upload] ❌ Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(`[upload] ✅ Auth OK. userId: ${session.userId}`);

    // Step 2: Env check
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.log("[upload] ❌ Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return NextResponse.json(
        { error: "Telegram Bot is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to Vercel environment variables." },
        { status: 500 }
      );
    }
    console.log(`[upload] ✅ Env OK. chatId: ${chatId}`);

    // Step 3: Parse form data
    let formData: FormData;
    try {
      formData = await req.formData();
      console.log("[upload] ✅ FormData parsed");
    } catch (e: any) {
      console.error("[upload] ❌ FormData parse failed:", e.message);
      return NextResponse.json({ error: `Failed to parse upload: ${e.message}` }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const folderPath = (formData.get("folderPath") as string) || "/";

    if (!file || typeof file === "string") {
      console.log("[upload] ❌ No file in form data");
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Step 4: Size check — Telegram Bot API limit: 50MB
    const MAX_BOT_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_BOT_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 50 MB.` },
        { status: 413 }
      );
    }

    const fileName = file.name || "unknown";
    const fileSize = file.size || 0;
    const mimeType = file.type || "application/octet-stream";
    console.log(`[upload] File: ${fileName} | ${(fileSize / 1024 / 1024).toFixed(2)} MB | ${mimeType} | folder: ${folderPath}`);

    // Step 5: Convert to buffer
    console.log("[upload] Converting to buffer...");
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    console.log(`[upload] ✅ Buffer ready: ${fileBuffer.length} bytes`);

    // Step 6: Build raw multipart body (avoids Node.js FormData/Blob issues)
    console.log("[upload] Building multipart body...");
    const { body: multipartBody, contentType } = buildMultipartBody(
      { chat_id: chatId, caption: fileName },
      "document",
      fileName,
      fileBuffer,
      mimeType
    );
    console.log(`[upload] ✅ Multipart body: ${multipartBody.length} bytes`);

    // Step 7: Send to Telegram Bot API
    console.log("[upload] Sending to Telegram Bot API...");
    let telegramData: any;
    try {
      const telegramRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendDocument`,
        {
          method: "POST",
          headers: { "Content-Type": contentType },
          body: multipartBody,
        }
      );
      telegramData = await telegramRes.json();
      console.log(`[upload] Telegram response: ok=${telegramData.ok}, status=${telegramRes.status}`);
    } catch (fetchErr: any) {
      console.error("[upload] ❌ Fetch to Telegram failed:", fetchErr.message);
      return NextResponse.json({ error: `Network error sending to Telegram: ${fetchErr.message}` }, { status: 500 });
    }

    if (!telegramData.ok) {
      const errMsg: string = telegramData.description || "Unknown Telegram error";
      console.error("[upload] ❌ Telegram API error:", errMsg, "| code:", telegramData.error_code);

      if (errMsg.includes("file is too big")) {
        return NextResponse.json({ error: "File exceeds Telegram's 50 MB limit." }, { status: 413 });
      }
      if (errMsg.toLowerCase().includes("chat not found")) {
        return NextResponse.json(
          { error: "Bot cannot reach your chat. Open @DeadraonBot in Telegram and press Start." },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: `Telegram: ${errMsg}` }, { status: 500 });
    }

    // Step 8: Extract IDs
    const result = telegramData.result;
    const messageId: number = result?.message_id ?? 0;
    const telegramFileId: string =
      result?.document?.file_id ??
      result?.video?.file_id ??
      result?.audio?.file_id ??
      "";
    console.log(`[upload] ✅ Telegram success. messageId=${messageId}, fileId=${telegramFileId}`);

    // Step 9: Save to MongoDB
    console.log("[upload] Saving to MongoDB...");
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
    console.log(`[upload] ✅ Saved to MongoDB. docId=${doc._id}`);

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    console.error("[upload] ❌ Unexpected error:", err.message, err.stack);
    return NextResponse.json(
      { error: err.message || "Upload failed due to a server error." },
      { status: 500 }
    );
  }
}
