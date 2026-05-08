import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);
async function checkAdmin(userId: string) { return ADMIN_USER_IDS.length === 0 || ADMIN_USER_IDS.includes(userId); }

export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await checkAdmin(userId))) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const testimonial = await Testimonial.create({
    name: body.name, role: body.role, company: body.company, content: body.content,
    rating: parseInt(body.rating) || 5, projectType: body.projectType || "Web Development",
    featured: body.featured === "true" || body.featured === true,
  });
  return NextResponse.json({ testimonial }, { status: 201 });
}
