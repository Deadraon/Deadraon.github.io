import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

async function checkAdmin(userId: string) {
  if (ADMIN_USER_IDS.length === 0) return true; // dev mode: allow all
  return ADMIN_USER_IDS.includes(userId);
}

// GET all projects (admin)
export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const projects = await Project.find({}).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ projects });
}

// POST create project (admin)
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();

  const body = await req.json();
  const { clientEmail, clientName, projectName, description, budget, deliveryDate } = body;

  if (!clientEmail || !clientName || !projectName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // The clientId will be the Clerk user ID of the client
  // For now we use email as identifier — admin can update clientId after client registers
  const project = await Project.create({
    clientId: clientEmail, // Placeholder — update after client creates Clerk account
    clientEmail,
    clientName,
    projectName,
    description: description || "",
    budget: budget ? parseInt(budget) : 0,
    deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    changelog: [{
      id: Date.now().toString(),
      message: "Project created",
      type: "status",
      createdAt: new Date(),
    }],
  });

  return NextResponse.json({ project }, { status: 201 });
}
