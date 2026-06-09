import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    await connectDB();

    // Fetch projects to search by project IDs too
    const clientProjects = await Project.find({ clientId: userId }).lean() as any[];
    const projectIds = clientProjects.map((p) => p._id.toString());

    const payments = await Payment.find({
      $or: [
        { clientEmail: email },
        { projectId: { $in: projectIds } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("Fetch payment history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
