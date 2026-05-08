import mongoose, { Schema, type Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    projectType: String,
    budget: String,
    timeline: String,
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
