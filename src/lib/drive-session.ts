import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface DriveSessionData {
  telegramSession?: string;
  userId?: string;
  phoneNumber?: string;
  phoneCodeHash?: string;
}

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "drive_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<DriveSessionData>> {
  const cookieStore = await cookies();
  return getIronSession<DriveSessionData>(cookieStore, sessionOptions);
}
