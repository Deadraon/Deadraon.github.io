import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deadraon Drive | Telegram Cloud Storage",
  description:
    "Your personal cloud storage powered by Telegram. Upload, organize and access your files anywhere.",
};

export default function DriveLayout({ children }: { children: React.ReactNode }) {
  // Standalone layout — intentionally strips global nav/Clerk wrappers
  // Drive has its own Telegram-based auth via iron-session
  return <div className="drive-root">{children}</div>;
}
