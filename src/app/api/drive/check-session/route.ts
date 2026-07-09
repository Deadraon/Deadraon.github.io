import { NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";

export async function GET() {
  try {
    const session = await getSession();
    const authenticated = !!session.telegramSession && !!session.userId;
    return NextResponse.json({ authenticated });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
