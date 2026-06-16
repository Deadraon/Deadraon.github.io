import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import PortfolioProject from "@/models/PortfolioProject";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

async function checkAdmin(userId: string) {
  if (ADMIN_USER_IDS.length === 0) return true; // dev mode: allow all
  return ADMIN_USER_IDS.includes(userId);
}

// GET all portfolio projects (including unpublished)
export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const projects = await PortfolioProject.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ projects });
}

// POST create new portfolio project
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();

  const body = await req.json();
  const { title, description, longDesc, image, tags, category, github, live, featured, published, order } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const project = await PortfolioProject.create({
    title,
    description,
    longDesc: longDesc || "",
    image: image || "",
    tags: tags || [],
    category: category || "web",
    github: github || "",
    live: live || "",
    featured: featured ?? false,
    published: published ?? true,
    order: order ?? 0,
  });

  return NextResponse.json({ project }, { status: 201 });
}

// PUT update a portfolio project
export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const project = await PortfolioProject.findByIdAndUpdate(id, updates, { new: true });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

// DELETE a portfolio project
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  await PortfolioProject.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
