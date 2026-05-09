import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ResumeRequest from "@/models/ResumeRequest";
import { sendResumeEmail } from "@/lib/email";
import { auth } from "@clerk/nextjs/server";

// Get all requests
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const requests = await ResumeRequest.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Admin resume API GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Approve/Reject a request
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { id, action } = body; // action: 'approve' | 'reject'

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await ResumeRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "approve") {
      request.status = "approved";
      await request.save();

      // Send the resume email
      try {
        await sendResumeEmail(request.email, request.name);
      } catch (emailError) {
        console.error("Failed to send resume email:", emailError);
        return NextResponse.json({ error: "Failed to send email but status updated" }, { status: 500 });
      }
    } else if (action === "reject") {
      request.status = "rejected";
      await request.save();
    }

    return NextResponse.json({ success: true, status: request.status });
  } catch (error) {
    console.error("Admin resume API PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
