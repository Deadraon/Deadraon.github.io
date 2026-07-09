import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderPath = searchParams.get("folder") || "/";

    const { data, error } = await supabase
      .from("drive_files")
      .select("*")
      .eq("user_id", session.userId)
      .eq("folder_path", folderPath)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("[list-files]", error);
      return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }

    return NextResponse.json({ files: data });
  } catch (error) {
    console.error("[list-files]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
