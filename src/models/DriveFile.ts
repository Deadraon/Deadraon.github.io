import mongoose from "mongoose";

export interface IDriveFile extends mongoose.Document {
  userId: string;
  fileName: string;
  fileSize: number;
  mimeType: string | null;
  messageId: number;
  folderPath: string;
  createdAt: Date;
  updatedAt: Date;
}

const driveFileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  mimeType: { type: String, default: null },
  messageId: { type: Number, required: true },
  folderPath: { type: String, default: "/" },
}, { timestamps: true });

// Compound index for quick listing within specific user directory folders
driveFileSchema.index({ userId: 1, folderPath: 1 });

export default mongoose.models.DriveFile || mongoose.model<IDriveFile>("DriveFile", driveFileSchema);
