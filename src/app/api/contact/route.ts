import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, subject, message, projectType, budget, timeline, phone } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact = await Contact.create({ name, email, subject, message, projectType, budget, timeline, phone });
    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ contacts });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
