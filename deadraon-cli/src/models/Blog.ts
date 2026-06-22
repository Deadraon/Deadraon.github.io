import mongoose, { Schema, type Document } from "mongoose";

export interface IBlog extends Document {

  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {

  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
