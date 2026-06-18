import mongoose, { Schema, type Document } from "mongoose";

export interface IToolRequest extends Document {
  name: string;
  description: string;
  email?: string;
  status: "new" | "reviewed" | "completed";
  createdAt: Date;
}

const ToolRequestSchema = new Schema<IToolRequest>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String },
    status: {
      type: String,
      enum: ["new", "reviewed", "completed"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.ToolRequest ||
  mongoose.model<IToolRequest>("ToolRequest", ToolRequestSchema);
