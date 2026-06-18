import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import ToolRequest from "@/models/ToolRequest";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

async function checkAdmin(userId: string) {
  if (ADMIN_USER_IDS.length === 0) return true; // dev: allow all
  return ADMIN_USER_IDS.includes(userId);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const unreadRequests = await ToolRequest.find({ status: "new" }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    success: true,
    count: unreadRequests.length,
    requests: unreadRequests,
  });
}
