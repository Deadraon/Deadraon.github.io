import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";

export const runtime = "nodejs";

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

    const { fileName, fileSize, mimeType, messageId, telegramFileId, folderPath } = await req.json();

    if (!fileName || messageId === undefined) {
      return NextResponse.json({ error: "Missing required metadata fields" }, { status: 400 });
    }

    await connectDB();
    const doc = await DriveFile.create({
      userId: session.userId,
      fileName,
      fileSize,
      mimeType,
      messageId,
      telegramFileId,
      folderPath: folderPath || "/",
    });

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
  } catch (error: any) {
    console.error("[save-metadata] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save file metadata" }, { status: 500 });
  }
}
