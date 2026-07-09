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

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderName, parentPath } = await req.json();
    if (!folderName) {
      return NextResponse.json({ error: "folderName is required" }, { status: 400 });
    }

    const safeParent = (parentPath || "/").replace(/\/+$/, "") || "/";
    const folderPath = safeParent === "/" ? `/${folderName}` : `${safeParent}/${folderName}`;

    await connectDB();

    // Check if folder already exists
    const existing = await DriveFile.findOne({
      userId: session.userId,
      fileName: folderName,
      folderPath: safeParent,
      mimeType: "folder",
    });

    if (existing) {
      return NextResponse.json({ error: "A folder with this name already exists" }, { status: 409 });
    }

    // Insert a virtual folder record (messageId = 0 for folders)
    const doc = await DriveFile.create({
      userId: session.userId,
      fileName: folderName,
      fileSize: 0,
      mimeType: "folder",
      messageId: 0,
      folderPath: safeParent,
    });

    return NextResponse.json({ success: true, folder: mapMongoToDriveFile(doc), folderPath });
  } catch (error) {
    console.error("[create-folder]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
