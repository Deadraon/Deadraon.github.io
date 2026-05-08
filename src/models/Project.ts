import mongoose, { Schema, type Document } from "mongoose";

export interface IProject extends Document {
  clientId: string; // Clerk user ID
  clientEmail: string;
  clientName: string;
  projectName: string;
  description: string;
  status: "pending" | "in-progress" | "review" | "delivered" | "on-hold";
  progress: number; // 0-100
  startDate: Date;
  deliveryDate?: Date;
  budget: number;
  currency: string;
  paymentStatus: "unpaid" | "partial" | "paid";
  milestones: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    completedAt?: Date;
    dueDate?: Date;
  }[];
  tasks: {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    updatedAt: Date;
  }[];
  files: {
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
    type: string;
  }[];
  notes: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
    isInternal: boolean;
  }[];
  changelog: {
    id: string;
    message: string;
    type: "update" | "milestone" | "file" | "status" | "note";
    createdAt: Date;
  }[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    clientId: { type: String, required: true, index: true },
    clientEmail: { type: String, required: true },
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "review", "delivered", "on-hold"],
      default: "pending",
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
    milestones: [
      {
        id: String,
        title: String,
        description: String,
        completed: { type: Boolean, default: false },
        completedAt: Date,
        dueDate: Date,
      },
    ],
    tasks: [
      {
        id: String,
        title: String,
        status: {
          type: String,
          enum: ["todo", "in-progress", "done"],
          default: "todo",
        },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    files: [
      {
        id: String,
        name: String,
        url: String,
        size: Number,
        uploadedAt: { type: Date, default: Date.now },
        type: String,
      },
    ],
    notes: [
      {
        id: String,
        content: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
        isInternal: { type: Boolean, default: false },
      },
    ],
    changelog: [
      {
        id: String,
        message: String,
        type: {
          type: String,
          enum: ["update", "milestone", "file", "status", "note"],
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    techStack: [String],
    githubUrl: String,
    liveUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
