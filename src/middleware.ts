import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/portfolio",
  "/portfolio/(.*)",
  "/services",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/contact",
  "/api/testimonials",
  "/api/portfolio",
  "/api/services",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isClientRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
