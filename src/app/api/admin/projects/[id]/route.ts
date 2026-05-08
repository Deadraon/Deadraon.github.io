import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);
async function checkAdmin(userId: string) {
  return ADMIN_USER_IDS.length === 0 || ADMIN_USER_IDS.includes(userId);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  const { id } = await params;
  const project = await Project.findById(id).lean();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();

  const body = await req.json();
  const { id } = await params;
  const oldProject = await Project.findById(id);
  if (!oldProject) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auto-log status changes
  if (body.status && body.status !== oldProject.status) {
    const log = { id: Date.now().toString(), message: `Status changed to "${body.status}"`, type: "status", createdAt: new Date() };
    body.changelog = [...(body.changelog || oldProject.changelog), log];
  }

  const project = await Project.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
  return NextResponse.json({ project });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  const { id } = await params;
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
