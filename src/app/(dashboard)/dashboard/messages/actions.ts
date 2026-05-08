"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { revalidatePath } from "next/cache";

export async function sendMessage(content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!content.trim()) throw new Error("Content is required");
  
  await connectDB();
  
  const newMessage = await Message.create({
    senderId: userId,
    receiverId: "admin",
    content: content.trim()
  });

  revalidatePath("/dashboard/messages");
  
  return {
    ...newMessage.toObject(),
    _id: newMessage._id.toString(),
    createdAt: newMessage.createdAt.toISOString()
  };
}
