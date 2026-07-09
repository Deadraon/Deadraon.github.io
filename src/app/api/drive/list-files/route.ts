import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
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

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderPath = searchParams.get("folder") || "/";

    await connectDB();

    const docs = await DriveFile.find({
      userId: session.userId,
      folderPath: folderPath,
    }).sort({ createdAt: -1 });

    const files = docs.map(mapMongoToDriveFile);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("[list-files]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
