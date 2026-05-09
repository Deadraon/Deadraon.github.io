import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ResumeRequest from "@/models/ResumeRequest";
import { notifyAdminOfResumeRequest } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, company } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await ResumeRequest.create({ name, email, company });

    // Notify admin
    try {
      await notifyAdminOfResumeRequest({ name, email, company });
    } catch (emailError) {
      console.error("Failed to notify admin of resume request:", emailError);
    }

    return NextResponse.json({ success: true, id: request._id }, { status: 201 });
  } catch (error) {
    console.error("Resume request API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
