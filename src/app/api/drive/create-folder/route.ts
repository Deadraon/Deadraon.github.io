import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { supabase } from "@/lib/supabase";

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

    // Check if folder already exists
    const { data: existing } = await supabase
      .from("drive_files")
      .select("id")
      .eq("user_id", session.userId)
      .eq("file_name", folderName)
      .eq("folder_path", safeParent)
      .eq("mime_type", "folder")
      .single();

    if (existing) {
      return NextResponse.json({ error: "A folder with this name already exists" }, { status: 409 });
    }

    // Insert a virtual folder record (message_id = 0 for folders)
    const { data, error } = await supabase
      .from("drive_files")
      .insert({
        user_id: session.userId,
        file_name: folderName,
        file_size: 0,
        mime_type: "folder",
        message_id: 0,
        folder_path: safeParent,
      })
      .select()
      .single();

    if (error) {
      console.error("[create-folder]", error);
      return NextResponse.json({ error: `Failed to create folder: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, folder: data, folderPath });
  } catch (error) {
    console.error("[create-folder]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
