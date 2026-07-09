import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, messageId } = await req.json();
    if (!fileId || !messageId) {
      return NextResponse.json(
        { error: "fileId and messageId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the file belongs to this user before deleting
    const existingFile = await DriveFile.findOne({
      _id: fileId,
      userId: session.userId,
    });

    if (!existingFile) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
    }

    // Delete from Telegram Saved Messages
    const client = createTelegramClient(session.telegramSession);
    await client.connect();
    await client.deleteMessages("me", [Number(messageId)], { revoke: true });
    await client.disconnect();

    // Delete metadata from MongoDB
    await DriveFile.deleteOne({
      _id: fileId,
      userId: session.userId,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string };
    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Rate limited. Please wait ${err.seconds} seconds.` },
        { status: 429 }
      );
    }
    console.error("[delete]", error);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
