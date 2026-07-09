import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import { supabase } from "@/lib/supabase";

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

    // Verify the file belongs to this user before deleting
    const { data: existingFile } = await supabase
      .from("drive_files")
      .select("id")
      .eq("id", fileId)
      .eq("user_id", session.userId)
      .single();

    if (!existingFile) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
    }

    // Delete from Telegram Saved Messages
    const client = createTelegramClient(session.telegramSession);
    await client.connect();
    await client.deleteMessages("me", [Number(messageId)], { revoke: true });
    await client.disconnect();

    // Delete metadata from Supabase
    const { error } = await supabase
      .from("drive_files")
      .delete()
      .eq("id", fileId)
      .eq("user_id", session.userId);

    if (error) {
      console.error("[delete] Supabase delete error", error);
      return NextResponse.json(
        { error: "File deleted from Telegram but failed to remove metadata" },
        { status: 500 }
      );
    }

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
