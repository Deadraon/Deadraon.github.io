import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import { Api } from "telegram";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const session = await getSession();
    const { phoneNumber, phoneCodeHash, telegramSession } = session;

    if (!phoneNumber || !phoneCodeHash) {
      return NextResponse.json(
        { error: "No pending login. Please send the code first." },
        { status: 400 }
      );
    }

    const client = createTelegramClient(telegramSession);
    await client.connect();

    const signInResult = await client.invoke(
      new Api.auth.SignIn({
        phoneNumber,
        phoneCodeHash,
        phoneCode: code,
      })
    );

    if (signInResult instanceof Api.auth.AuthorizationSignUpRequired) {
      await client.disconnect();
      return NextResponse.json(
        { error: "Signup is required for this number, but only existing accounts are supported." },
        { status: 400 }
      );
    }

    const me = await client.getMe();
    const sessionString = client.session.save() as unknown as string;

    await client.disconnect();

    // Persist session data
    session.telegramSession = sessionString;
    session.userId = me.id.toString();
    // Clear sensitive interim data
    session.phoneNumber = undefined;
    session.phoneCodeHash = undefined;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string };
    if (err.errorMessage === "SESSION_PASSWORD_NEEDED") {
      return NextResponse.json(
        { error: "This account has 2FA enabled. 2FA login is not yet supported." },
        { status: 403 }
      );
    }
    if (err.errorMessage === "PHONE_CODE_INVALID") {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }
    if (err.errorMessage === "PHONE_CODE_EXPIRED") {
      return NextResponse.json(
        { error: "Code has expired. Please request a new one." },
        { status: 400 }
      );
    }
    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Rate limited. Please wait ${err.seconds} seconds.` },
        { status: 429 }
      );
    }
    console.error("[verify-code]", error);
    return NextResponse.json(
      { error: err.message || "Failed to verify code" },
      { status: 500 }
    );
  }
}
