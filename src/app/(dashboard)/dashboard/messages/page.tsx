import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { MessageSquare } from "lucide-react";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();
  
  // Create a welcome message if none exist just to show the UI works
  const count = await Message.countDocuments({ $or: [{ senderId: userId }, { receiverId: userId }] });
  if (count === 0) {
    await Message.create({
      senderId: "admin", // Represents Deadraon
      receiverId: userId,
      content: "Hi there! I am Deadraon. If you have any questions about your project, feel free to drop a message here.",
    });
  }

  // Fetch all messages involving this user
  const messages = await Message.find({ 
    $or: [{ senderId: userId }, { receiverId: userId }] 
  }).sort({ createdAt: 1 }).lean() as any[];

  const serializedMessages = messages.map(m => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt.toISOString()
  }));

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8 h-[calc(100vh-64px)] lg:h-screen max-w-4xl mx-auto flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Messages
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Direct communication with Deadraon.</p>
      </div>

      <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col min-h-0 shadow-lg">
        <MessagesClient initialMessages={serializedMessages} currentUserId={userId} />
      </div>
    </div>
  );
}
