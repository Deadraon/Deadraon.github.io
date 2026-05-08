import mongoose, { Schema, type Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  projectType: string;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    avatar: String,
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectType: { type: String, default: "Web Development" },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
