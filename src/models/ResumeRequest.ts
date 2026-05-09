import mongoose, { Schema, type Document } from "mongoose";

export interface IResumeRequest extends Document {
  name: string;
  email: string;
  company?: string;
  status: "pending" | "approved" | "rejected";
  token: string;
  createdAt: Date;
}

const ResumeRequestSchema = new Schema<IResumeRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: String,
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeRequest ||
  mongoose.model<IResumeRequest>("ResumeRequest", ResumeRequestSchema);
