"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, User } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { sendMessage } from "./actions";
import { toast } from "sonner";

export default function MessagesClient({ initialMessages, currentUserId }: { initialMessages: any[], currentUserId: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const content = input.trim();
    setInput("");
    setIsSending(true);

    try {
      const newMsg = await sendMessage(content);
      setMessages(prev => [...prev, newMsg]);
    } catch (error) {
      toast.error("Failed to send message");
      setInput(content); // Restore input on failure
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          const isMine = msg.senderId === currentUserId;
          const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;

          return (
            <div key={msg._id} className={`flex gap-3 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar placeholder */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                isMine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              } ${!showAvatar && "opacity-0"}`}>
                <User className="w-4 h-4" />
              </div>

              <div className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  isMine 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-secondary text-secondary-foreground rounded-tl-sm"
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {formatRelativeDate(new Date(msg.createdAt))}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-secondary border-none rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </form>
      </div>
    </>
  );
}
