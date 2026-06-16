import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PortfolioProject from "@/models/PortfolioProject";

export const revalidate = 60; // ISR: revalidate every 60 seconds

// Public: get all published portfolio projects
export async function GET() {
  try {
    await connectDB();
    const projects = await PortfolioProject.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching portfolio projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
