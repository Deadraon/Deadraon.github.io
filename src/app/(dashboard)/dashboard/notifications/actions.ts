"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function markNotificationAsRead(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await connectDB();
  await Notification.findOneAndUpdate({ _id: id, userId }, { read: true });
}

export async function markAllNotificationsAsRead() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await connectDB();
  await Notification.updateMany({ userId, read: false }, { read: true });
}
