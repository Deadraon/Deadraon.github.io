import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Contact from "@/models/Contact";
import Testimonial from "@/models/Testimonial";

// GET /api/seed — only for development seeding
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  await connectDB();

  // Seed sample testimonials
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { name: "Sarah Johnson", role: "CEO", company: "TechVentures Inc.", content: "Deadraon delivered our SaaS dashboard 2 weeks ahead of schedule. Absolutely recommend!", rating: 5, projectType: "Web Development", featured: true },
    { name: "Ahmed Al-Rashid", role: "Founder", company: "HealthApp Arabia", content: "Built our entire Flutter health app from scratch. The attention to detail was world-class.", rating: 5, projectType: "App Development", featured: true },
    { name: "Priya Sharma", role: "Product Manager", company: "EduTech Solutions", content: "Our e-learning platform is now 3x faster and beautifully designed. Perfect execution!", rating: 5, projectType: "Web Development", featured: true },
  ]);

  // Seed a sample contact
  await Contact.deleteMany({});
  await Contact.create({
    name: "John Smith", email: "john@example.com", subject: "Need a full-stack web app",
    message: "Hi Deadraon, I need a professional portfolio and client management system. Looking for a long-term collaboration.",
    projectType: "Web Development", budget: "$2,000 - $5,000", timeline: "2-3 months",
  });

  return NextResponse.json({ success: true, message: "Database seeded with sample data!" });
}
