import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

// Client: get their own projects
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  await connectDB();
  const projects = await Project.find({ clientId: userId }).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ projects });
}
