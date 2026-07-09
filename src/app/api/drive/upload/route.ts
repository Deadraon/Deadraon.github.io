import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import { supabase } from "@/lib/supabase";
import Busboy from "busboy";

// Disable Next.js body parsing — we handle the stream ourselves
export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB (Telegram limit)

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.telegramSession || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    // Parse the multipart stream with Busboy
    const { fileBuffer, fileName, mimeType, fileSize, folderPath } =
      await new Promise<{
        fileBuffer: Buffer;
        fileName: string;
        mimeType: string;
        fileSize: number;
        folderPath: string;
      }>((resolve, reject) => {
        const bb = Busboy({ headers: { "content-type": contentType } });
        const chunks: Buffer[] = [];
        let resolvedFileName = "unknown";
        let resolvedMime = "application/octet-stream";
        let resolvedFolder = "/";
        let totalSize = 0;

        bb.on("file", (_field, stream, info) => {
          resolvedFileName = info.filename || "unknown";
          resolvedMime = info.mimeType || "application/octet-stream";

          stream.on("data", (chunk: Buffer) => {
            totalSize += chunk.length;
            if (totalSize > MAX_FILE_SIZE) {
              stream.destroy(new Error("File exceeds 2 GB limit"));
              return;
            }
            chunks.push(chunk);
          });
          stream.on("end", () => {});
          stream.on("error", reject);
        });

        bb.on("field", (name, value) => {
          if (name === "folderPath") resolvedFolder = value;
        });

        bb.on("finish", () => {
          resolve({
            fileBuffer: Buffer.concat(chunks),
            fileName: resolvedFileName,
            mimeType: resolvedMime,
            fileSize: totalSize,
            folderPath: resolvedFolder,
          });
        });
        bb.on("error", reject);

        // Pipe the request body into busboy
        req.body!.pipeTo(
          new WritableStream({
            write(chunk) {
              bb.write(chunk);
            },
            close() {
              bb.end();
            },
          })
        );
      });

    // Upload to Telegram Saved Messages
    const client = createTelegramClient(session.telegramSession);
    await client.connect();

    const message = await client.sendFile("me", {
      file: fileBuffer,
      caption: fileName,
      forceDocument: true,
    });

    await client.disconnect();

    const messageId = Number(message.id);

    // Store metadata in Supabase
    const { data, error } = await supabase
      .from("drive_files")
      .insert({
        user_id: session.userId,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        message_id: messageId,
        folder_path: folderPath || "/",
      })
      .select()
      .single();

    if (error) {
      console.error("[upload] Supabase insert error", error);
      return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 });
    }

    return NextResponse.json({ success: true, file: data });
  } catch (error: unknown) {
    const err = error as { errorMessage?: string; seconds?: number; message?: string };
    if (err.errorMessage === "FLOOD_WAIT") {
      return NextResponse.json(
        { error: `Rate limited. Please wait ${err.seconds} seconds.` },
        { status: 429 }
      );
    }
    console.error("[upload]", error);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
