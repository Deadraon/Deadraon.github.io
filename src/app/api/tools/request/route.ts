import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ToolRequest from "@/models/ToolRequest";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, description, email } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Tool name and description are required" },
        { status: 400 }
      );
    }

    const newRequest = await ToolRequest.create({
      name,
      description,
      email: email || undefined,
      status: "new",
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (err) {
    console.error("Failed to create tool request:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
