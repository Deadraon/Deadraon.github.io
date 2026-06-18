import { NextRequest, NextResponse } from "next/server";
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
  const requests = await ToolRequest.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, requests });
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
  }

  const updated = await ToolRequest.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, request: updated });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await ToolRequest.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
