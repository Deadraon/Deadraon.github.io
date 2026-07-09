import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import { CustomFile } from "telegram/client/uploads";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";

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
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as unknown as File;
    const folderPath = (formData.get("folderPath") as string) || "/";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name || "unknown";
    const fileSize = file.size || 0;
    const mimeType = file.type || "application/octet-stream";

    // Convert Web File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to Telegram Saved Messages
    const client = createTelegramClient(session.telegramSession);
    await client.connect();

    const message = await client.sendFile("me", {
      file: new CustomFile(fileName, fileSize, fileName, fileBuffer),
      caption: fileName,
      forceDocument: true,
    });

    await client.disconnect();

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

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string };
    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Rate limited. Please wait ${err.seconds} seconds.` },
        { status: 429 }
      );
    }
    console.error("[upload]", error);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
