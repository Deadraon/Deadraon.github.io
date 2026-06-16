import mongoose, { Schema, type Document } from "mongoose";

export interface IPortfolioProject extends Document {
  title: string;
  description: string;
  longDesc: string;
  image: string;
  tags: string[];
  category: "web" | "app" | "ui" | "backend";
  github?: string;
  live?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDesc: { type: String, default: "" },
    image: { type: String, default: "" },
    tags: [{ type: String }],
    category: {
      type: String,
      enum: ["web", "app", "ui", "backend"],
      default: "web",
    },
    github: { type: String, default: "" },
    live: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PortfolioProject ||
  mongoose.model<IPortfolioProject>("PortfolioProject", PortfolioProjectSchema);
