import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();
  
  // Create a welcome notification if none exist just to show the UI works
  const count = await Notification.countDocuments({ userId });
  if (count === 0) {
    await Notification.create({
      userId,
      title: "Welcome to your Client Portal!",
      message: "This is where you will receive updates about your projects and messages from Deadraon.",
      type: "success"
    });
  }

  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).lean() as any[];

  // Convert ObjectIds to strings so they can be passed to Client Component
  const serializedNotifications = notifications.map(n => ({
    ...n,
    _id: n._id.toString(),
    createdAt: n.createdAt.toISOString()
  }));

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          Notifications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Stay updated on your project progress.</p>
      </div>

      <NotificationsClient initialNotifications={serializedNotifications} />
    </div>
  );
}
