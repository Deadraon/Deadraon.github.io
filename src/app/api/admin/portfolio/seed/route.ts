import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import PortfolioProject from "@/models/PortfolioProject";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

const SEED_PROJECTS = [
  {
    title: "Deadraon Portfolio",
    category: "web",
    description: "Full-stack freelance platform with client dashboard, project management, messaging, and Clerk auth.",
    longDesc: "A professional SaaS-style freelance portfolio built with Next.js 15, TypeScript, MongoDB, and Clerk. Features include a client-facing portfolio, project submission system, admin dashboard, messaging, notifications, and a dark-mode-first premium UI inspired by modern SaaS products.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    tags: ["Next.js", "TypeScript", "MongoDB", "Clerk", "Tailwind"],
    github: "https://github.com/Deadraon/Deadraon.github.io",
    live: "https://deadraon.dev",
    featured: true,
    published: true,
    order: 1,
  },
  {
    title: "GainIQ",
    category: "app",
    description: "AI-powered fitness & diet app with personalized plans, workout tracking, and Google Gemini integration.",
    longDesc: "GainIQ is a cross-platform Flutter fitness application featuring AI-generated diet plans powered by Google Gemini, workout logging, body metrics tracking, admin management panel, subscription control, and a premium modern UI with dark mode.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    tags: ["Flutter", "Dart", "Gemini AI", "Firebase", "Riverpod"],
    github: "https://github.com/Deadraon/gainiq",
    live: "https://gainiq-ten.vercel.app",
    featured: true,
    published: true,
    order: 2,
  },
  {
    title: "Rustic House",
    category: "ui",
    description: "Premium luxury hotel website with immersive animations, room booking, and full-screen hero experience.",
    longDesc: "A luxury hotel website built with HTML, CSS, and JavaScript featuring an immersive full-screen hero section, smooth scroll animations, room browsing, online booking system with Razorpay integration, and a stunning glassmorphism navigation on mobile.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
    tags: ["HTML", "CSS", "JavaScript", "Razorpay"],
    github: "https://github.com/Deadraon/rustic-house_build",
    live: "https://rustic-house-build.vercel.app",
    featured: false,
    published: true,
    order: 3,
  },
  {
    title: "Hotel Taj View Residency",
    category: "web",
    description: "Full-featured hotel website with a premium Crystal Glass mobile nav, room gallery, and booking system.",
    longDesc: "A full-featured hotel website for Taj View Residency. Built with JavaScript, features a premium crystal-glass mobile navigation, room photo gallery, contact forms, online enquiry system, and smooth scroll animations throughout.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    tags: ["JavaScript", "CSS", "HTML", "Vercel"],
    github: "https://github.com/Deadraon/hotel_test_full",
    live: "https://hotel-test-full.vercel.app",
    featured: true,
    published: true,
    order: 4,
  },
  {
    title: "Shivaay Fitness",
    category: "web",
    description: "Gym & fitness centre website with membership plans, class schedules, and trainer profiles.",
    longDesc: "A modern gym and fitness centre website for Shivaay Fitness. Features membership plan listings, class schedule, trainer profile cards, testimonials, and a contact section. Built with Next.js and Tailwind CSS with a dark, energetic aesthetic.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80",
    tags: ["Next.js", "JavaScript", "Tailwind", "Vercel"],
    github: "https://github.com/Deadraon/shivaay_fitness",
    live: "https://shivaay-fitness.vercel.app",
    featured: true,
    published: true,
    order: 5,
  },
  {
    title: "Lifeline Hospital",
    category: "web",
    description: "Hospital management portal with doctor listings, appointment booking, and patient services.",
    longDesc: "A comprehensive hospital web portal for Lifeline Hospital built with Next.js and TypeScript. Features doctor directory, department listings, appointment booking flow, emergency contact section, and a clean, trust-inspiring medical UI.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    github: "https://github.com/Deadraon/lifeline-hospital",
    live: "https://lifeline-hospital-phi.vercel.app",
    featured: false,
    published: true,
    order: 6,
  },
  {
    title: "Om Chaudhary Hospital",
    category: "web",
    description: "Hospital website with department listings, doctor profiles, and appointment booking.",
    longDesc: "A hospital website for Om Chaudhary Hospital built with JavaScript. Includes department and doctor listing pages, patient appointment booking, emergency contact details, and a clean, accessible healthcare UI.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    tags: ["JavaScript", "CSS", "HTML", "Vercel"],
    github: "https://github.com/Deadraon/om_chaudhary_hospital",
    live: "https://om-chaudhary-hospital.vercel.app",
    featured: false,
    published: true,
    order: 7,
  },
];

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (ADMIN_USER_IDS.length > 0 && !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    // Only seed if collection is empty to avoid duplicates
    const existing = await PortfolioProject.countDocuments();
    if (existing > 0) {
      return NextResponse.json({
        message: `Skipped: ${existing} projects already exist. Delete them first to re-seed.`,
        existing,
      });
    }

    const inserted = await PortfolioProject.insertMany(SEED_PROJECTS);
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} projects!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
