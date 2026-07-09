import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/drive-session";
import { createTelegramClient } from "@/lib/telegram";
import { CustomFile } from "telegram/client/uploads";
import connectDB from "@/lib/mongodb";
import DriveFile from "@/models/DriveFile";
import Busboy from "busboy";

// Disable Next.js body parsing — we handle the stream ourselves
export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB (Telegram limit)

function mapMongoToDriveFile(doc: any) {
  return {
    id: doc._id.toString(),
    user_id: doc.userId,
    file_name: doc.fileName,
    file_size: doc.fileSize,
    mime_type: doc.mimeType,
    message_id: doc.messageId,
    folder_path: doc.folderPath,
    uploaded_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
  };
}

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
      file: new CustomFile(fileName, fileSize, fileName, fileBuffer),
      caption: fileName,
      forceDocument: true,
    });

    await client.disconnect();

    const messageId = Number(message.id);

    // Store metadata in MongoDB
    await connectDB();
    const doc = await DriveFile.create({
      userId: session.userId,
      fileName,
      fileSize,
      mimeType,
      messageId,
      folderPath: folderPath || "/",
    });

    return NextResponse.json({ success: true, file: mapMongoToDriveFile(doc) });
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
