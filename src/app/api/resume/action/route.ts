import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ResumeRequest from "@/models/ResumeRequest";
import { sendResumeEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const action = searchParams.get("action"); // 'approve' | 'reject'

  if (!token || !action) {
    return new NextResponse("<h1>Invalid Request</h1><p>Missing token or action.</p>", {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    await connectDB();
    const request = await ResumeRequest.findOne({ token });

    if (!request) {
      return new NextResponse("<h1>Link Expired</h1><p>This request could not be found or has been removed.</p>", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (request.status !== "pending") {
      return new NextResponse(`<h1>Already Processed</h1><p>This request has already been ${request.status}.</p>`, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (action === "approve") {
      request.status = "approved";
      await request.save();

      // Send the resume email
      try {
        await sendResumeEmail(request.email, request.name);
      } catch (emailError) {
        console.error("Failed to send resume email:", emailError);
        return new NextResponse("<h1>Approval Saved, but Email Failed</h1><p>The status was updated, but we couldn't send the resume email automatically.</p>", {
          status: 500,
          headers: { "Content-Type": "text/html" },
        });
      }

      return new NextResponse(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #0070F3;">Request Approved!</h1>
          <p>Resume has been sent to <strong>${request.name}</strong> (${request.email}).</p>
          <a href="/dashboard/resume-requests" style="color: #0070F3; text-decoration: none;">Go to Dashboard</a>
        </div>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });

    } else if (action === "reject") {
      request.status = "rejected";
      await request.save();

      return new NextResponse(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #ff4444;">Request Declined</h1>
          <p>The request from <strong>${request.name}</strong> has been rejected.</p>
          <a href="/dashboard/resume-requests" style="color: #0070F3; text-decoration: none;">Go to Dashboard</a>
        </div>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    return new NextResponse("<h1>Invalid Action</h1>", {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });

  } catch (error) {
    console.error("Resume Action API error:", error);
    return new NextResponse("<h1>Server Error</h1><p>Something went wrong on our end.</p>", {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
